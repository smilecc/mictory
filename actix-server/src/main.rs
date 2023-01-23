use std::sync::Arc;

use actix::{Actor, Addr};
use actix_web::{middleware, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use actix_web_static_files::ResourceFiles;
use api::*;
use engine::{engine::Engine, websocket::WebSocketSession};
use jwt_simple::prelude::HS512Key;
use sea_orm::{Database, DatabaseConnection};

mod api;
mod engine;
mod model;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

#[derive(Debug, Clone)]
pub struct AppState {
    pub engine: Addr<Engine>,
    pub db: Arc<DatabaseConnection>,
    pub jwt_key: HS512Key,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 初始化环境变量
    dotenvy::dotenv().ok();
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db_conn = Arc::new(Database::connect(&db_url).await.unwrap());

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let jwt_key = api::middleware::init_jwt_key();

    // 初始化引擎类
    let app_state = AppState {
        engine: Engine::new(db_conn.clone()).start(),
        db: db_conn.clone(),
        jwt_key,
    };

    // 创建Http与Websocket服务
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .configure(init_config)
    })
    .bind(("0.0.0.0", 20424))?
    .run()
    .await
}

fn init_config(cfg: &mut web::ServiceConfig) {
    let generated = generate();
    cfg.service(ResourceFiles::new("/demo", generated));
    cfg.route(
        "/ws",
        web::get()
            .to(ws_handler)
            .wrap(middleware::Logger::default()),
    );

    cfg.service(api::user_api::login);

    let jwt_key = api::middleware::init_jwt_key();
    cfg.service(
        web::scope("")
            .wrap(api::middleware::JWTAuth { jwt_key })
            .service(room_api::get_rooms)
            .service(server_api::create_server)
            .service(server_api::list_user_server),
    );
}

async fn ws_handler(
    req: HttpRequest,
    stream: web::Payload,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    // 使用会话结构体作为ws的actor
    ws::start(
        WebSocketSession {
            // session_id将会由Engine类的Connect事件分配
            session_id: "".to_owned(),
            // 此处将Engine的Address存入会话类，用于和引擎做事件交互
            engine_addr: app_state.engine.clone(),
            rtc_session_addr: None,
        },
        &req,
        stream,
    )
}
