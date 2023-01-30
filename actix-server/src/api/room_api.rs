use actix_web::http::StatusCode;
use actix_web::{get, post, web, Responder};
use model::{room, server};
use sea_orm::{ActiveModelTrait, EntityTrait, Set};
use sea_orm::{ColumnTrait, QueryFilter};
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::api::middleware::JWTAuthClaims;
use crate::api::ResultBuilder;
use crate::AppState;

#[get("/api/server/{server_id}/rooms")]
pub async fn get_rooms(app_state: web::Data<AppState>, path: web::Path<(i64,)>) -> impl Responder {
    let server_id = path.0.clone();
    let db = app_state.db.as_ref();
    let rooms = room::Entity::find()
        .filter(room::Column::ServerId.eq(server_id))
        .all(db)
        .await
        .unwrap_or(vec![]);

    ResultBuilder::success(rooms).ok()
}

#[derive(Debug, Deserialize, Serialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateRoomQuery {
    pub name: String,
}

#[post("/api/server/{server_id}/room")]
pub async fn create_room(
    app_state: web::Data<AppState>,
    path: web::Path<(i64,)>,
    query: web::Json<CreateRoomQuery>,
    claims: JWTAuthClaims,
) -> impl Responder {
    let server_id = path.0.clone();
    let db = app_state.db.as_ref();

    let server_model = server::Entity::find_by_id(server_id.clone())
        .one(db)
        .await
        .unwrap();

    if server_model.is_none() || server_model.unwrap().creator_id != claims.user_id {
        return ResultBuilder::fail_str(10403, "创建房间失败，您无权限创建")
            .err(StatusCode::FORBIDDEN);
    }

    let new_room = room::ActiveModel {
        server_id: Set(server_id),
        name: Set(query.name.clone()),
        max_member: Set(50),
        ..Default::default()
    }
    .insert(db)
    .await
    .unwrap();

    ResultBuilder::success(new_room).ok()
}
