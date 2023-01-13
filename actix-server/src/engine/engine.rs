use std::{collections::HashMap};

use actix::prelude::*;
use nanoid::nanoid;

use crate::engine::rtc::{self, RTCStopMessage};

use super::{rtc::RTCSession, websocket};

#[derive(Debug)]
pub struct Engine {
    pub ws_message_subscribers: HashMap<String, Recipient<websocket::WebSocketMessage>>,
    pub rtc_session_addrs: HashMap<String, Addr<RTCSession>>,
}

impl Engine {
    pub fn new() -> Self {
        Engine {
            ws_message_subscribers: HashMap::new(),
            rtc_session_addrs: HashMap::new(),
        }
    }
}

impl Actor for Engine {
    type Context = Context<Self>;
}

#[derive(Message)]
#[rtype(String)]
pub struct WebSocketConnectMessage {
    pub ws_message_subscriber: Recipient<websocket::WebSocketMessage>,
}

// 处理新Websocket连接
impl Handler<WebSocketConnectMessage> for Engine {
    type Result = String;

    fn handle(&mut self, msg: WebSocketConnectMessage, ctx: &mut Self::Context) -> Self::Result {
        let session_id = nanoid!();
        let session_id_return = session_id.clone();

        log::info!("WebSocket会话连接，会话ID: {}", &session_id);

        self.ws_message_subscribers
            .insert(session_id, msg.ws_message_subscriber);

        // 开始创建RTC连接
        let session_id_rtc = session_id_return.clone();

        async move {
            let rtc_session = rtc::RTCSession::new(session_id_rtc.clone(), "1".to_owned())
                .await
                .start();
            (session_id_rtc, rtc_session)
        }
        .into_actor(self)
        .map(|res, act, _ctx| {
            // res.do_send(RTCStopMessage {});
            act.rtc_session_addrs.insert(res.0, res.1);
        })
        .wait(ctx);

        return session_id_return;
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
        self.ws_message_subscribers.remove(&msg.session_id);

        // 关闭RTC会话
        if let Some(rtc_addr) = self.rtc_session_addrs.get(&msg.session_id) {
            rtc_addr.do_send(RTCStopMessage {});
        }
        self.rtc_session_addrs.remove(&msg.session_id);
    }
}
