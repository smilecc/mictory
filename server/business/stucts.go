package business

import (
	"github.com/pion/webrtc/v3"
	"github.com/zishang520/socket.io/socket"
)

type RTCAnswer struct {
	SDP *webrtc.SessionDescription `json:"sdp"`
}

type EventRoomJoin struct {
	RoomId socket.Room               `json:"roomId"`
	SDP    webrtc.SessionDescription `json:"sdp"`
}

type EventRTCCandidate struct {
	Data webrtc.ICECandidateInit `json:"data"`
}

type EventRTCAnswer struct {
	SDP webrtc.SessionDescription `json:"sdp"`
}
