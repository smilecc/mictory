use std::{collections::HashMap, sync::Arc};

use actix::prelude::*;
use nanoid::nanoid;
use webrtc::track::track_local::track_local_static_rtp::TrackLocalStaticRTP;

use crate::engine::rtc::{self, RTCStopMessage};

use super::{
    rtc::{RTCAddTrackMessage, RTCSession},
    websocket::WebSocketSession,
};

#[derive(Debug)]
pub struct Engine {
    pub ws_message_addrs: HashMap<String, Addr<WebSocketSession>>,
    pub rtc_session_addrs: HashMap<String, Addr<RTCSession>>,
}

impl Engine {
    pub fn new() -> Self {
        Engine {
            ws_message_addrs: HashMap::new(),
            rtc_session_addrs: HashMap::new(),
        }
    }
}

impl Actor for Engine {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(1024);
    }
}

#[derive(Debug)]
pub struct WebSocketConnectMessageResult {
    pub session_id: String,
    pub rtc_session_addr: Addr<RTCSession>,
}

#[derive(Message)]
#[rtype(WebSocketConnectMessageResult)]
pub struct WebSocketConnectMessage {
    pub ws_addr: Addr<WebSocketSession>,
}

// 处理新Websocket连接
impl Handler<WebSocketConnectMessage> for Engine {
    type Result = ResponseActFuture<Self, WebSocketConnectMessageResult>;

    fn handle(&mut self, msg: WebSocketConnectMessage, ctx: &mut Self::Context) -> Self::Result {
        let ws_addr = msg.ws_addr.clone();
        let engine_addr = ctx.address();

        Box::pin(
            async {
                let session_id = nanoid!();
                log::info!("WebSocket会话连接，会话ID: {}", &session_id);

                // 创建RTC会话和连接
                let rtc_session_addr =
                    rtc::RTCSession::new(engine_addr, ws_addr, session_id.clone(), "1".to_owned())
                        .await
                        .unwrap()
                        .start();

                WebSocketConnectMessageResult {
                    session_id,
                    rtc_session_addr,
                }
            }
            .into_actor(self)
            .map(|res, act, _ctx| {
                // 写入到当前actor
                act.ws_message_addrs
                    .insert(res.session_id.clone(), msg.ws_addr);
                act.rtc_session_addrs
                    .insert(res.session_id.clone(), res.rtc_session_addr.clone());
                res
            }),
        )
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct WebSocketDisconnectMessage {
    pub session_id: String,
}

// 处理Websocket连接断开
impl Handler<WebSocketDisconnectMessage> for Engine {
    type Result = ();

    fn handle(&mut self, msg: WebSocketDisconnectMessage, _: &mut Self::Context) -> Self::Result {
        log::info!("WebSocket会话断开，会话ID：{}", &msg.session_id);
        self.ws_message_addrs.remove(&msg.session_id);

        // 关闭RTC会话
        if let Some(rtc_addr) = self.rtc_session_addrs.get(&msg.session_id) {
            rtc_addr.do_send(RTCStopMessage {});
        }
        self.rtc_session_addrs.remove(&msg.session_id);
    }
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct EngineNewTrackMessage {
    pub session_id: String,
    pub local_track: Arc<TrackLocalStaticRTP>,
}

// 当有新轨道时，筛选需要加入的会话，通知加入会话
impl Handler<EngineNewTrackMessage> for Engine {
    type Result = ResponseFuture<()>;

    fn handle(&mut self, msg: EngineNewTrackMessage, _: &mut Self::Context) -> Self::Result {
        let rtc_session_addrs = self.rtc_session_addrs.clone();

        Box::pin(async move {
            for (current_session_id, rtc_session_addr) in rtc_session_addrs {
                // 如果来源会话和循环当前会话为同一会话，则忽略
                if msg.session_id == current_session_id {
                    continue;
                }

                rtc_session_addr.do_send(RTCAddTrackMessage {
                    source_session_id: msg.session_id.clone(),
                    local_track: msg.local_track.clone(),
                })
            }
        })
    }
}
