use std::sync::Arc;

use actix::{Actor, Addr};
use actix_cors::Cors;
use actix_web::{middleware, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_web_actors::ws;
use actix_web_static_files::ResourceFiles;
use api::*;
use engine::{engine::Engine, websocket::WebSocketSession};
use jwt_simple::prelude::HS512Key;
use sea_orm::{ConnectOptions, Database, DatabaseConnection};

mod api;
mod business;
mod engine;
mod model;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

#[derive(Debug, Clone)]
pub struct AppState {
    pub engine: Addr<Engine>,
    pub db: Arc<DatabaseConnection>,
    pub jwt_key: HS512Key,
}

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!(
        r"$$\      $$\ $$\             $$\                     Version: {}",
        VERSION
    );
    println!(r"$$$\    $$$ |\__|            $$ |                                  ");
    println!(r"$$$$\  $$$$ |$$\  $$$$$$$\ $$$$$$\    $$$$$$\   $$$$$$\  $$\   $$\ ");
    println!(r"$$\$$\$$ $$ |$$ |$$  _____|\_$$  _|  $$  __$$\ $$  __$$\ $$ |  $$ |");
    println!(r"$$ \$$$  $$ |$$ |$$ /        $$ |    $$ /  $$ |$$ |  \__|$$ |  $$ |");
    println!(r"$$ |\$  /$$ |$$ |$$ |        $$ |$$\ $$ |  $$ |$$ |      $$ |  $$ |");
    println!(r"$$ | \_/ $$ |$$ |\$$$$$$$\   \$$$$  |\$$$$$$  |$$ |      \$$$$$$$ |");
    println!(r"\__|     \__|\__| \_______|   \____/  \______/ \__|       \____$$ |");
    println!(r"                                                         $$\   $$ |");
    println!(r"                                                         \$$$$$$  |");
    println!(r"                                                          \______/ ");

    // 初始化环境变量
    dotenvy::dotenv().ok();

    // 连接数据库
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let mut db_opt = ConnectOptions::new(db_url);
    db_opt
        .sqlx_logging(false) // Disabling SQLx log
        .sqlx_logging_level(log::LevelFilter::Debug); // Setting SQLx log level

    let db_conn = Arc::new(Database::connect(db_opt).await.unwrap());

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
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .max_age(3600),
            )
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

    cfg.service(api::server_api::get_version)
        .service(api::user_api::login)
        .service(api::user_api::create_user)
        .service(api::server_api::list_server_users);

    let jwt_key = api::middleware::init_jwt_key();
    cfg.service(
        web::scope("")
            .wrap(api::middleware::JWTAuth { jwt_key })
            .service(room_api::get_rooms)
            .service(server_api::create_server)
            .service(server_api::list_user_server)
            .service(server_api::join_server)
            .service(user_api::get_user),
    );
}

async fn ws_handler(
    req: HttpRequest,
    stream: web::Payload,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    // 使用会话结构体作为ws的actor
    ws::start(
        WebSocketSession::new(
            app_state.engine.clone(),
            app_state.jwt_key.clone(),
            app_state.db.clone(),
        ),
        &req,
        stream,
    )
}
