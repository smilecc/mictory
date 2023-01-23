use actix_web::{get, post, web, HttpResponse, Responder};
use sea_orm::{ActiveModelTrait, EntityTrait, Set};
use serde_json::json;

use crate::api::ResultBuilder;
use crate::model::*;
use crate::AppState;

#[get("/api/rooms")]
pub async fn get_rooms(app_state: web::Data<AppState>) -> impl Responder {
    let db = app_state.db.as_ref();
    let rooms = room::Entity::find().all(db).await.unwrap_or(vec![]);

    ResultBuilder::success(rooms).ok()
}
