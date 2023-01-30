use actix_web::{get, web, Responder};
use model::room;
use sea_orm::EntityTrait;
use sea_orm::{ColumnTrait, QueryFilter};

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
