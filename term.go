package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/samber/lo"
	"github.com/samber/ro"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type Term struct {
	app   *application.App
	ctx   context.Context
	log   *slog.Logger
	pty   RoPty
	srv   *http.Server
	token string
}

func NewTerm(app *application.App) *Term {
	return &Term{
		app:   app,
		log:   app.Logger.WithGroup("Term"),
		token: lo.RandomString(12, lo.LettersCharset),
	}
}

func (t *Term) ServiceStartup(ctx context.Context, options application.ServiceOptions) error {
	t.ctx = ctx
	return nil
}

func (t *Term) ServiceShutdown() error {
	return nil
}

var wspath = "/ws/pty/"

func (t *Term) Serve() (string, error) {
	if t.srv != nil {
		return fmt.Sprintf("ws://%s%s?token=%s", t.srv.Addr, wspath, t.token), nil
	}
	srv := &http.Server{Addr: fmt.Sprintf("127.0.0.1:%d", getPort())}
	var _WsConn *websocket.Conn // old websocket conn

	go func() {
		http.HandleFunc(wspath, func(w http.ResponseWriter, r *http.Request) {
			query := r.URL.Query()
			if query.Get("token") != t.token {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			//TODO: clean-terminal
			if _WsConn != nil {
				if err := _WsConn.Close(); err != nil {
					slog.Error("close old websocket connect error", err)
				}
			}

			wsConn, err := upgrader.Upgrade(w, r, nil)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			_WsConn = wsConn

			if t.pty == nil {
				t.pty, err = NewRoPty(func() {
					t.pty = nil
					_ = wsConn.Close()
				})
				if err != nil {
					return
				}
			}
			roPty := t.pty

			createWsReader(wsConn).Subscribe(ro.NewObserver(func(b []byte) {
				roPty.Next(b)
			}, func(err error) {
				t.log.Error("term ws conn throw an error", "err", err)
				_ = wsConn.Close()
			}, func() {
				t.log.Error("term ws conn closed")
			})).AddUnsubscribable(roPty.Subscribe(createWsWriter(wsConn)))
		})
		slog.Info("ws server start at", "addr", srv.Addr)
		log.Fatal(srv.ListenAndServe())
	}()

	t.srv = srv
	return fmt.Sprintf("ws://%s%s?token=%s", t.srv.Addr, wspath, t.token), nil
}

func (t *Term) Resize(cols, rows int) error {
	if t.pty != nil {
		return t.pty.Resize(cols, rows)
	}
	return nil
}

func (t *Term) Clear() error {
	if t.pty != nil {
		_, err := t.pty.Write([]byte("\x1b[2J\x1b[H"))
		return err
	}
	return nil
}
