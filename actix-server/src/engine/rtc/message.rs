use std::collections::HashSet;

use actix::prelude::*;

use webrtc::{
    ice_transport::ice_candidate::RTCIceCandidateInit,
    peer_connection::sdp::{sdp_type::RTCSdpType, session_description::RTCSessionDescription},
};

use super::session::{LocalTrack, RTCSession};

// RTC增加轨道消息
#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCAddTrackMessage {
    pub source_session_id: String,
    pub local_tracks: HashSet<LocalTrack>,
}

impl Handler<RTCAddTrackMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCAddTrackMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        let session_id = self.session_id.clone();

        Box::pin(async move {
            log::info!(
                "RTC会话{}增加来自于{}的轨道",
                session_id,
                msg.source_session_id
            );

            for track in msg.local_tracks {
                let sender = peer_connection
                    .add_track(track.0.track.clone())
                    .await
                    .unwrap();

                track.0.sender.lock().await.borrow_mut().set(Some(sender));
            }
        })
    }
}

// RTC移除轨道消息
#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCRemoveTrackMessage {
    pub source_session_id: String,
    pub local_tracks: HashSet<LocalTrack>,
}

impl Handler<RTCRemoveTrackMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCRemoveTrackMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        let session_id = self.session_id.clone();

        Box::pin(async move {
            log::info!(
                "RTC会话{}移除来自于{}的轨道",
                session_id,
                msg.source_session_id
            );

            for track in msg.local_tracks {
                if let Some(s) = track.0.sender.lock().await.borrow().0.clone() {
                    peer_connection.remove_track(&s).await.unwrap_or_default();
                }
            }
        })
    }
}

// RTC会话停止消息
#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCStopMessage {}

impl Handler<RTCStopMessage> for RTCSession {
    type Result = ();

    fn handle(&mut self, _msg: RTCStopMessage, ctx: &mut Self::Context) -> Self::Result {
        ctx.stop();
    }
}

// RTC ICE Candidate处理
#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCCandidateMessage {
    pub candidate: RTCIceCandidateInit,
}

impl Handler<RTCCandidateMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCCandidateMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        Box::pin(async move {
            peer_connection
                .add_ice_candidate(msg.candidate)
                .await
                .unwrap_or_default();
        })
    }
}

// RTC 接收到Offer进行应答
#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCReceiveOfferMessage {
    pub sdp: String,
}

impl Handler<RTCReceiveOfferMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCReceiveOfferMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        let ws_addr = self.ws_addr.clone();
        Box::pin(async move {
            // 转换SDP，并设置为remote_description
            let offer = serde_json::from_str::<RTCSessionDescription>(&msg.sdp).unwrap();
            if let Some(err) = peer_connection.set_remote_description(offer).await.err() {
                log::error!("{}", err);
                return;
            }

            RTCSession::create_sdp_and_send(peer_connection, RTCSdpType::Answer, ws_addr)
                .await
                .unwrap_or_default();
        })
    }
}

// RTC 接收到应答，进行处理
#[derive(Message)]
#[rtype(result = "()")]
pub struct RTCReceiveAnswerMessage {
    pub sdp: RTCSessionDescription,
}

impl Handler<RTCReceiveAnswerMessage> for RTCSession {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: RTCReceiveAnswerMessage, _ctx: &mut Self::Context) -> Self::Result {
        let peer_connection = self.peer_connection.clone();
        Box::pin(async move {
            if let Some(err) = peer_connection.set_remote_description(msg.sdp).await.err() {
                log::error!("{}", err);
            }
        })
    }
}
