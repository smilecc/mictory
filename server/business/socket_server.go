package business

import (
	"encoding/json"
	httpCors "github.com/rs/cors"
	"github.com/sirupsen/logrus"
	"github.com/zishang520/socket.io/socket"
	"log"
	"net/http"
)

var GlobalSocketServer *SocketServer

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
			s.SetData(&SocketData{})
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
		logrus.WithField("sessionId", client.Id()).Info("新SocketIO会话加入")

		// 加入房间
		_ = client.On("room:join", func(args ...any) {
			var e EventRoomJoin
			event := handleEventArgs(args, &e)
			if event == nil {
				return
			}

			logrus.WithField("sessionId", client.Id()).WithField("roomId", event.RoomId).Info("会话加入房间")
			client.Join(event.RoomId)

			data := client.Data().(*SocketData)
			data.RTCSession = NewWebRTCSession(string(client.Id()))
			data.RTCSession.HandleRemoteSDPOffer(event.SDP)
		})

		// 退出房间
		_ = client.On("room:exit", func(args ...any) {
			data := client.Data().(*SocketData)
			if data.RTCSession != nil && data.RTCSession.PeerConnection != nil {
				_ = data.RTCSession.PeerConnection.Close()
			}
			s.LeaveAllRooms(string(client.Id()))
		})

		// 处理RTC协商
		_ = client.On("rtc:candidate", func(args ...any) {
			var e EventRTCCandidate
			event := handleEventArgs(args, &e)
			if event == nil {
				return
			}

			data := client.Data().(*SocketData)
			if data.RTCSession == nil {
				return
			}

			if err := data.RTCSession.PeerConnection.AddICECandidate(e.Data); err != nil {
				log.Println(err)
				return
			}
		})

		// 处理RTC应答
		_ = client.On("rtc:answer", func(args ...any) {
			var e EventRTCAnswer
			event := handleEventArgs(args, &e)
			if event == nil {
				return
			}

			data := client.Data().(*SocketData)
			_ = data.RTCSession.PeerConnection.SetRemoteDescription(event.SDP)
		})

		// 客户端连接断开
		_ = client.On("disconnect", func(...any) {
			data := client.Data().(*SocketData)
			if data.RTCSession != nil && data.RTCSession.PeerConnection != nil {
				_ = data.RTCSession.PeerConnection.Close()
			}
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

func (s *SocketServer) LeaveAllRooms(sessionId string) {
	remoteSocket := s.GetRemoteSocket(sessionId)
	if remoteSocket == nil {
		return
	}

	// 退出所有房间（除自己会话ID外）
	for _, roomId := range remoteSocket.Rooms().Keys() {
		if roomId != socket.Room(remoteSocket.Id()) {
			remoteSocket.Leave(roomId)
			logrus.
				WithField("sessionId", remoteSocket.Id()).
				WithField("RoomId", roomId).
				Info("会话退出房间")
		}
	}
}

func handleEventArgs[T any](args []any, event *T) *T {
	if len(args) == 0 {
		return nil
	}

	switch args[0].(type) {
	case string:
		err := json.Unmarshal([]byte(args[0].(string)), event)
		if err != nil {
			logrus.Errorln(err)
			return nil
		}

		return event
	default:
		return nil
	}
}
