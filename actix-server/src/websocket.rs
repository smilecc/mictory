use actix::{
    fut, Actor, ActorContext, ActorFutureExt, Addr, AsyncContext, ContextFutureSpawner, Handler,
    Message, StreamHandler, WrapFuture,
};
use actix_web_actors::ws::{self, ProtocolError};
use serde_json::Value;

use crate::engine;

#[derive(Message)]
#[rtype(result = "()")]
pub struct WebSocketMessage {}

#[derive(Debug)]
pub struct WebSocketSession {
    pub session_id: String,
    pub engine_addr: Addr<engine::Engine>,
}

impl Actor for WebSocketSession {
    type Context = ws::WebsocketContext<Self>;

    // 实现Actor启动事件
    fn started(&mut self, ctx: &mut Self::Context) {
        let address = ctx.address();

        // 发送消息给Engine，告知websocket链接创建
        self.engine_addr
            .send(engine::WebSocketConnectMessage {
                ws_message_subscriber: address.recipient(),
            })
            .into_actor(self)
            .then(|res, act, ctx| {
                // 将Engine分配的会话ID写入当前会话
                match res {
                    Ok(res) => act.session_id = res,
                    _ => ctx.stop(),
                }
                fut::ready(())
            })
            .wait(ctx);
    }
}

// 实现Websocket的消息处理
impl StreamHandler<Result<actix_web_actors::ws::Message, ProtocolError>> for WebSocketSession {
    fn handle(
        &mut self,
        msg: Result<actix_web_actors::ws::Message, ProtocolError>,
        ctx: &mut Self::Context,
    ) {
        println!("ws: {msg:?}");

        match msg {
            Ok(ws::Message::Text(text)) => {
                if let Ok(v) = serde_json::from_str::<Value>(&text) {
                    println!("收到消息 {v:?}")
                }
            }
            Ok(ws::Message::Close(reason)) => {
                // 客户端通知关闭连接，关闭连接并通知Engine
                ctx.close(reason);
                self.engine_addr
                    .do_send(engine::WebSocketDisconnectMessage {
                        session_id: self.session_id.clone(),
                    });
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}

// 监听外部发送的WebSocket消息
impl Handler<WebSocketMessage> for WebSocketSession {
    type Result = ();

    fn handle(&mut self, msg: WebSocketMessage, ctx: &mut Self::Context) -> Self::Result {
        todo!()
    }
}
