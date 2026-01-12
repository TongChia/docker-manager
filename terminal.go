package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
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

func (a *App) Terminal(opt *TermOption) (addr string, err error) {
	if a.tws != nil {
		return a.tws.Addr(), nil
	}

	ps, err := NewPtySrv()
	if err != nil {
		return "", err
	}
	_ = ps.pty.Resize(opt.Cols, opt.Rows)

	a.tws = &ps

	return a.tws.Addr(), nil
}

func NewPty() (pty.Pty, error) {
	ptmx, err := pty.New()
	if err != nil {
		return nil, err
	}

	// TODO: get user shell
	c := ptmx.Command("/usr/bin/env", "/bin/zsh", "--login")
	c.Env = append(os.Environ())
	c.Dir = os.Getenv("HOME")

	if err := c.Start(); err != nil {
		return nil, err
	}

	return ptmx, nil
}

func NewSrv(ps *PtySrv) *http.Server {
	srv := &http.Server{Addr: fmt.Sprintf("127.0.0.1:%d", getPort())}
	ps.token = lo.RandomString(12, lo.LettersCharset)

	go func() {
		http.HandleFunc("/ws/pty/", ps.WsHandler)
		log.Printf("ws server start at %s", srv.Addr)
		log.Fatal(srv.ListenAndServe())
	}()

	return srv
}

type PtySrv struct {
	pty   pty.Pty
	out   ro.Observable[[]byte]
	in    ro.Observer[[]byte]
	srv   *http.Server
	token string
	conn  *websocket.Conn
}

func NewPtySrv() (r PtySrv, err error) {
	r.pty, err = NewPty()
	if err != nil {
		return
	}

	r.out = createPtyReader(r.pty)
	r.in = createPtyWriter(r.pty)

	r.srv = NewSrv(&r)

	return
}

func (ps *PtySrv) Addr() string {
	return fmt.Sprintf("ws://%s/ws/pty/?token=%s", ps.srv.Addr, ps.token)
}

func (ps *PtySrv) WsHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	if query.Get("token") != ps.token {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	//TODO: clean-terminal
	if ps.conn != nil {
		err := ps.conn.Close()
		slog.Warn("关闭 ws 连接", "err", err)
	}
	wsCoon, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	ps.conn = wsCoon

	sub := ps.out.Subscribe(createWsWriter(wsCoon))

	createWsReader(wsCoon).Subscribe(ro.OnNext(func(b []byte) {
		ps.in.Next(b)
	})).Add(func() {
		sub.Unsubscribe()
	})
}

//func termWsHandler(ps *PtySrv) func(w http.ResponseWriter, r *http.Request) {
//	return func(w http.ResponseWriter, r *http.Request) {
//		//TODO: get secret key and term size
//		//TODO: clean-terminal
//		wsConn, err := upgrader.Upgrade(w, r, nil)
//		if err != nil {
//			// TODO: response err
//			log.Printf("错误 ws 请求升级失败，err: %+v \n", err)
//			return
//		}
//
//		ps.out.Subscribe(createWsWriter(wsConn))
//
//		createWsReader(wsConn).Subscribe(ps.in)
//		slog.Debug("ws 流结束")
//	}
//}

type RoPty interface {
	pty.Pty
	ro.Observable[[]byte]
	ro.Observer[[]byte]
}

type roPtyImpl struct {
	pty.Pty
	ro.Observable[[]byte]
	ro.Observer[[]byte]
}

func NewRoPty() (RoPty, error) {
	ptmx, err := NewPty()
	if err != nil {
		return nil, err
	}
	return &roPtyImpl{ptmx, createPtyReader(ptmx), createPtyWriter(ptmx)}, nil
}

func createPtyReader(t pty.Pty) ro.Observable[[]byte] {
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
			observer.Complete()
		}()
		return nil
	}).Subscribe(bus)
	return bus
}

// TODO: 不需要 BehaviorSubject
func createPtyWriter(t pty.Pty) ro.Observer[[]byte] {
	return ro.NewObserver(func(b []byte) {
		_, err := io.Copy(t, bytes.NewReader(b))
		if err != nil {
			slog.Warn("PTY write failed", "err", err)
		}
		return
	}, func(err error) {
		slog.Error("PTY write Observer 收到来自上游的 error", err)
	}, func() {
		slog.Warn("PTY write ro stopped")
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
	return ro.NewObserver(func(b []byte) {
		err := wsConn.WriteMessage(websocket.BinaryMessage, b)
		if err != nil {
			slog.Warn("term ws conn write failed", "err", err)
		}
	}, func(err error) {
		slog.Error("term pty out", "err", err)
	}, func() {
		_ = wsConn.Close()
	})
}

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

func getPort() int {
	port, ok := lo.Find[int](lo.RangeFrom[int](0x8000, 0xFFFF), func(port int) bool {
		conn, err := net.DialTimeout("tcp", fmt.Sprintf("127.0.0.1:%d", port), 50*time.Millisecond)
		return err != nil && conn == nil
	})
	return lo.If[int](ok, port).Else(0x8000)
}

//func getListen() (net.Listener, int) {
//	ports := lo.RangeFrom[int](32768, 65535)
//	mutable.Shuffle(ports)
//	for port := range ports {
//		ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", port))
//		if err == nil {
//			return ln, port
//		}
//		log.Printf("listen port error %v", err)
//	}
//	return nil, 0
//}
