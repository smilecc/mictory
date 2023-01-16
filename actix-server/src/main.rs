use actix::{Actor, Addr};
use actix_web::{middleware, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use engine::{engine::Engine, websocket::WebSocketSession};

mod engine;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // 初始化引擎类
    let engine_state = Engine::new().start();

    // 创建Http与Websocket服务
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(engine_state.clone()))
            .route(
                "/ws",
                web::get()
                    .to(ws_handler)
                    .wrap(middleware::Logger::default()),
            )
    })
    .bind(("0.0.0.0", 20424))?
    .run()
    .await
}

async fn ws_handler(
    req: HttpRequest,
    stream: web::Payload,
    engine_addr: web::Data<Addr<Engine>>,
) -> Result<HttpResponse, Error> {
    // 使用会话结构体作为ws的actor
    ws::start(
        WebSocketSession {
            // session_id将会由Engine类的Connect事件分配
            session_id: "".to_owned(),
            // 此处将Engine的Address存入会话类，用于和引擎做事件交互
            engine_addr: engine_addr.get_ref().clone(),
            rtc_session_addr: None,
        },
        &req,
        stream,
    )
}
