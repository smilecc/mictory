package business

import (
	"encoding/json"
	"fmt"
	httpCors "github.com/rs/cors"
	"github.com/zishang520/socket.io/socket"
	"net/http"
)

type SocketServer struct {
	Server *socket.Server
}

type SocketData struct {
	UserId     int64
	RTCSession *WebRTCSession
}

func NewSocketServer() *SocketServer {
	return &SocketServer{
		Server: socket.NewServer(nil, nil),
	}
}

func (s *SocketServer) Start() {
	s.startHandleEvent()
	s.Server.Use(func(s *socket.Socket, next func(*socket.ExtendedError)) {
		// 初始化回话数据
		if s.Data() == nil {
			s.SetData(SocketData{})
		}

		next(nil)
	})

	// 启动服务
	mux := http.NewServeMux()
	mux.Handle("/socket.io/", s.Server.ServeHandler(nil))

	go func() {
		_ = http.ListenAndServe(":8025", httpCors.Default().Handler(mux))
	}()
}

func (s *SocketServer) startHandleEvent() {
	_ = s.Server.On("connection", func(args ...any) {
		client := args[0].(*socket.Socket)
		_ = client.On("event", func(args ...any) {
			data := args[0].(map[string]interface{})
			j, _ := json.Marshal(data)
			fmt.Println(string(j))

			//global.SocketServer.GetRemoteSocket().Rooms()
		})

		// 加入房间
		_ = client.On("room:join", func(args ...any) {
			eventData := args[0].(map[string]interface{})

			data := client.Data().(*SocketData)
			data.RTCSession = NewWebRTCSession(string(client.Id()))
			data.RTCSession.HandleRemoteSDPOffer(eventData["sdp"].(string))
		})

		// 退出房间
		_ = client.On("room:exit", func(args ...any) {

		})

		// 处理RTC协商
		//_ = client.On("rtc:candidate", func(args ...any) {
		//	data := client.Data().(*SocketData)
		//	eventData := args[0].(map[string]interface{})
		//
		//	if data.RTCSession == nil {
		//		return
		//	}
		//
		//	candidate := webrtc.ICECandidateInit{}
		//	if err := json.Unmarshal([]byte(message.Data), &candidate); err != nil {
		//		log.Println(err)
		//		return
		//	}
		//
		//	if err := data.RTCSession.PeerConnection.AddICECandidate(candidate); err != nil {
		//		log.Println(err)
		//		return
		//	}
		//})

		_ = client.On("rtc:answer")

		_ = client.On("disconnect", func(...any) {
		})
	})
}

func (s *SocketServer) GetRemoteSocket(sessionId string) *socket.RemoteSocket {
	sockets := s.Server.To(socket.Room(sessionId)).FetchSockets()
	if len(sockets) == 0 {
		return nil
	}

	return sockets[0]
}
