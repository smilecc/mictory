package engine

import (
	"github.com/gofiber/websocket/v2"
	"github.com/pion/rtp"
)

type TestMessage struct {
	Hello string
}

type WebSocketConnectMessage struct {
	Connection *websocket.Conn
}

type WebSocketDisconnectMessage struct {
	SessionId string
}

type RTCTrackCopyMessage struct {
	Packet *rtp.Packet
}

type WebSocketSendMessage struct {
	Message *WebsocketMessage
}
