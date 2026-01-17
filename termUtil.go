package main

import (
	"bytes"
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/aymanbagabas/go-pty"
	"github.com/gorilla/websocket"
	"github.com/samber/lo"
	"github.com/samber/ro"
)

type TermOption struct {
	Cols int
	Rows int
}

// var _srv *http.Server = nil
// var _token string = ""
// var _roPty RoPty = nil
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool { // github.com/gorilla/websocket.checkSameOrigin
		origin := r.Header["Origin"]
		return lo.SomeBy(origin, func(s string) bool {
			return strings.HasPrefix(s, "wails://")
		})
	},
}

//func (a *App) Term(opt *TermOption) (addr, token string, err error) {
//	if _srv != nil {
//		// TODO: resize
//		return _srv.Addr, _token, nil
//	}
//
//	// TODO: 保存 RoPty 指针，用于 resize、判断 pty closed
//	rp, err := NewRoPty(opt)
//	if err != nil {
//		return "", "", err
//	}
//
//	_roPty = rp
//
//	_srv = NewSrv()
//
//	return _srv.Addr, _token, nil
//}

//func NewSrv() *http.Server {
//	srv := &http.Server{Addr: fmt.Sprintf("127.0.0.1:%d", getPort())}
//	token := lo.RandomString(12, lo.LettersCharset)
//	var _WsConn *websocket.Conn // old websocket conn
//
//	go func() {
//		http.HandleFunc("/ws/pty/", func(w http.ResponseWriter, r *http.Request) {
//			query := r.URL.Query()
//			if query.Get("token") != token {
//				w.WriteHeader(http.StatusUnauthorized)
//				return
//			}
//			//TODO: clean-terminal
//			if _WsConn != nil {
//				if err := _WsConn.Close(); err != nil {
//					slog.Error("close old websocket connect error", err)
//				}
//			}
//
//			wsCoon, err := upgrader.Upgrade(w, r, nil)
//			if err != nil {
//				w.WriteHeader(http.StatusInternalServerError)
//				return
//			}
//			_WsConn = wsCoon
//
//			if _roPty == nil {
//				rp, err := NewRoPty(&TermOption{
//					Cols: 60,
//					Rows: 60,
//				})
//				if err != nil {
//					return
//				}
//
//				_roPty = rp
//			}
//			roPty := _roPty
//
//			createWsReader(wsCoon).Subscribe(ro.OnNext(func(b []byte) {
//				roPty.Next(b)
//			})).AddUnsubscribable(roPty.Subscribe(createWsWriter(wsCoon)))
//		})
//		slog.Info("ws server start at", "addr", srv.Addr)
//		log.Fatal(srv.ListenAndServe())
//	}()
//
//	_token = token
//	return srv
//}

type RoPty interface {
	pty.Pty
	ro.Observer[[]byte]
	ro.Observable[[]byte]
	ClearScreen()
}

type roPtyImpl struct {
	pty.Pty
	ro.Observer[[]byte]
	ro.Observable[[]byte]
}

func (r *roPtyImpl) ClearScreen() {
	r.Observer.Next([]byte("\x1b[2J\x1b[H"))
}

func NewRoPty(cancel func()) (RoPty, error) {
	ptmx, err := pty.New()
	if err != nil {
		return nil, err
	}

	// TODO: Windows
	shell := os.Getenv("SHELL")
	c := ptmx.Command("/usr/bin/env", shell, "--login")
	//c := ptmx.Command("/usr/bin/env", "/bin/zsh", "--login")
	c.Env = append(os.Environ())
	c.Dir = os.Getenv("HOME")

	if err := c.Start(); err != nil {
		return nil, err
	}

	go func() {
		err := c.Wait()
		slog.Warn("进程已退出", "err", err)
		cancel()
	}()

	return &roPtyImpl{ptmx, createPtyWriter(ptmx), createPtyReader(ptmx)}, nil
}

func createPtyReader(t pty.Pty) ro.Observable[[]byte] {
	// pty reader 是一个可以被重复订阅的 Subject，缓存最后一个发出的内容，并在被再次订阅时
	// 把最后一个发出的内容推送给新订阅者，一般情况下，这将是终端信息提示符 (Prompt)
	bus := ro.NewReplaySubject[[]byte](1)
	ro.NewObservable(func(observer ro.Observer[[]byte]) ro.Teardown {
		go func() {
			buf := make([]byte, 1024)
			for {
				n, err := io.LimitReader(t, 1024).Read(buf)
				if err != nil {
					if err != io.EOF {
						observer.Error(err)
					}
					break
				}

				if n > 0 {
					observer.Next(buf[:n])
				}
			}
			//observer.Next([]byte("进程已关闭"))
			observer.Next([]byte("process closed"))
			observer.Complete()
		}()
		return nil
	}).Subscribe(bus)
	return bus.AsObservable()
}

func createPtyWriter(t pty.Pty) ro.Observer[[]byte] {
	return ro.OnNext(func(b []byte) {
		_, err := io.Copy(t, bytes.NewReader(b))
		if err != nil {
			slog.Warn("PTY write failed", "err", err)
		}
	})
}

func createWsReader(wsConn *websocket.Conn) ro.Observable[[]byte] {
	return ro.NewObservable(func(observer ro.Observer[[]byte]) ro.Teardown {
		go func() {
			for {
				messageType, p, err := wsConn.ReadMessage()
				if err != nil {
					if err != io.EOF {
						observer.Error(err)
					}
					break
				}
				if messageType == websocket.BinaryMessage || messageType == websocket.TextMessage {
					observer.Next(p)
				}
			}
			_ = wsConn.Close()
			observer.Complete()
		}()
		return nil
	})
}

func createWsWriter(wsConn *websocket.Conn) ro.Observer[[]byte] {
	return ro.OnNext(func(b []byte) {
		err := wsConn.WriteMessage(websocket.BinaryMessage, b)
		if err != nil {
			slog.Warn("wsConn write failed", "err", err)
		}
	})
}

func getPort() int {
	port, ok := lo.Find[int](lo.RangeFrom[int](0x8000, 0xFFFF), func(port int) bool {
		conn, err := net.DialTimeout("tcp", fmt.Sprintf("127.0.0.1:%d", port), 50*time.Millisecond)
		return err != nil && conn == nil
	})
	return lo.If[int](ok, port).Else(0x8000)
}
