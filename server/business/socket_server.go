package business

import (
	"encoding/json"
	"fmt"
	httpCors "github.com/rs/cors"
	"github.com/zishang520/socket.io/socket"
	"net/http"
)

type SocketServer struct {
	server *socket.Server
}

type SocketData struct {
	UserId int64
}

func NewSocketServer() *SocketServer {
	return &SocketServer{
		server: socket.NewServer(nil, nil),
	}
}

func (s *SocketServer) Start() {
	s.startHandleEvent()
	s.server.Use(func(s *socket.Socket, next func(*socket.ExtendedError)) {
		// 初始化回话数据
		if s.Data() == nil {
			s.SetData(SocketData{})
		}

		next(nil)
	})

	// 启动服务
	mux := http.NewServeMux()
	mux.Handle("/socket.io/", s.server.ServeHandler(nil))

	go func() {
		_ = http.ListenAndServe(":8025", httpCors.Default().Handler(mux))
	}()
}

func (s *SocketServer) startHandleEvent() {
	_ = s.server.On("connection", func(args ...any) {
		client := args[0].(*socket.Socket)
		_ = client.On("event", func(args ...any) {
			data := args[0].(map[string]interface{})
			j, _ := json.Marshal(data)
			fmt.Println(string(j))
		})

		_ = client.On("disconnect", func(...any) {
		})
	})
}
