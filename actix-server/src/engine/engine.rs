use std::collections::HashMap;

use actix::prelude::*;
use nanoid::nanoid;

use crate::engine::rtc::{self, RTCStopMessage};

use super::{
    rtc::RTCSession,
    websocket::{self, WebSocketSession},
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

    fn handle(&mut self, msg: WebSocketConnectMessage, _ctx: &mut Self::Context) -> Self::Result {
        let ws_addr = msg.ws_addr.clone();
        Box::pin(
            async {
                let session_id = nanoid!();
                log::info!("WebSocket会话连接，会话ID: {}", &session_id);

                // 创建RTC会话和连接
                let rtc_session_addr =
                    rtc::RTCSession::new(ws_addr, session_id.clone(), "1".to_owned())
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
