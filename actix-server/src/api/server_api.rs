use actix_web::{get, post, web, Responder};
use sea_orm::EntityTrait;
use serde_json::json;

use crate::{api::ResultBuilder, model::server, AppState};

use super::middleware::JWTAuthClaims;

#[post("/api/server")]
pub async fn create_server(
    app_state: web::Data<AppState>,
    server_form: web::Json<server::Model>,
) -> impl Responder {
    let db = app_state.db.as_ref();
    let form: server::ActiveModel = server_form.into_inner().into();

    let insert_result = server::Entity::insert(form).exec(db).await.unwrap();
    let new_id = insert_result.last_insert_id;

    ResultBuilder::success(json!({"new_id": new_id, })).ok()
}

#[get("/api/user/servers")]
pub async fn list_user_server(claims: JWTAuthClaims) -> impl Responder {
    ResultBuilder::success(claims).ok()
}
