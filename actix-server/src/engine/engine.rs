use std::{collections::HashMap, sync::Arc};

use actix::prelude::*;
use nanoid::nanoid;

use crate::engine::rtc;

use super::websocket;

#[derive(Debug)]
pub struct Engine {
    pub ws_message_subscribers: HashMap<String, Recipient<websocket::WebSocketMessage>>,
}

impl Engine {
    pub fn new() -> Self {
        Engine {
            ws_message_subscribers: HashMap::new(),
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

        let fut = Box::pin(async {
            log::info!("创建PeerConnection");
        });

        let session_id_rtc = session_id_return.clone();

        async move {
            log::info!("创建PeerConnection");
            let rtc_session = rtc::RTCSession::new(session_id_rtc, "1".to_owned()).await.start();
            rtc_session
        }
        .into_actor(self)
        .map(|res, act, _ctx| {
            // res.
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
    }
}
