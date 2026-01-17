package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"github.com/aymanbagabas/go-pty"
	"github.com/gorilla/websocket"
	"github.com/samber/lo"
	"github.com/samber/ro"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type Term struct {
	app *application.App
	ctx context.Context
	log *slog.Logger
	pty RoPty
	srv *http.Server
}

func NewTerm(app *application.App) *Term {
	return &Term{
		app: app,
		log: app.Logger.WithGroup("Term"),
	}
}

func (t *Term) ServiceStartup(ctx context.Context, options application.ServiceOptions) error {
	t.ctx = ctx
	return nil
}

func (t *Term) ServiceShutdown() error {
	return nil
}

func (t *Term) Serve() (string, error) {
	if t.srv != nil {
		return "", nil
	}
	srv := &http.Server{Addr: fmt.Sprintf("127.0.0.1:%d", getPort())}
	token := lo.RandomString(12, lo.LettersCharset)
	var _WsConn *websocket.Conn // old websocket conn

	go func() {
		http.HandleFunc("/ws/pty/", func(w http.ResponseWriter, r *http.Request) {
			query := r.URL.Query()
			if query.Get("token") != token {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			//TODO: clean-terminal
			if _WsConn != nil {
				if err := _WsConn.Close(); err != nil {
					slog.Error("close old websocket connect error", err)
				}
			}

			wsCoon, err := upgrader.Upgrade(w, r, nil)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			_WsConn = wsCoon

			if t.pty == nil {
				err := t.newRoPty()
				if err != nil {
					return
				}
			}
			roPty := t.pty

			createWsReader(wsCoon).Subscribe(ro.OnNext(func(b []byte) {
				roPty.Next(b)
			})).AddUnsubscribable(roPty.Subscribe(createWsWriter(wsCoon)))
		})
		slog.Info("ws server start at", "addr", srv.Addr)
		log.Fatal(srv.ListenAndServe())
	}()

	return token, nil
}

func (t *Term) newRoPty() error {
	ptmx, err := pty.New()
	if err != nil {
		return err
	}

	//err = ptmx.Resize(opt.Cols, opt.Rows)
	//if err != nil {
	//	return err
	//}

	// TODO: Windows
	shell := os.Getenv("SHELL")
	c := ptmx.Command("/usr/bin/env", shell, "--login")
	//c := ptmx.Command("/usr/bin/env", "/bin/zsh", "--login")
	c.Env = append(os.Environ())
	c.Dir = os.Getenv("HOME")

	if err := c.Start(); err != nil {
		return err
	}

	cancelResizeEvent := t.app.Event.On("terminal:resize", func(event *application.CustomEvent) {
		opt, ok := event.Data.(*TermOption)
		if ok {
			err := ptmx.Resize(opt.Cols, opt.Rows)
			if err != nil {
				t.log.Error("terminal pty resize failed", "err", err)
			}
		}
	})

	go func() {
		err := c.Wait()
		slog.Warn("进程已退出", "err", err)
		t.pty = nil
		cancelResizeEvent()
	}()

	t.pty = &roPtyImpl{ptmx, createPtyWriter(ptmx), createPtyReader(ptmx)}

	return nil
}
