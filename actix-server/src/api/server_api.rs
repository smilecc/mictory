use actix_web::{get, post, web, Responder};
use nanoid::nanoid;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, FromQueryResult, JoinType, QueryFilter, QueryOrder,
    QuerySelect, Set, TransactionTrait,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use validator::Validate;

use crate::{
    api::ResultBuilder,
    model::{room_user, server, user, user_server},
    AppState,
};

use super::middleware::JWTAuthClaims;
use sea_orm::prelude::DateTime;

#[derive(Debug, Deserialize, Serialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct CreateServerQuery {
    pub name: String,
}

#[post("/api/server")]
pub async fn create_server(
    app_state: web::Data<AppState>,
    query: web::Json<CreateServerQuery>,
    claims: JWTAuthClaims,
) -> impl Responder {
    let txn = app_state.db.begin().await.unwrap();
    // 创建服务器
    let insert_server = server::ActiveModel {
        name: Set(query.name.clone()),
        code: Set(nanoid!()),
        creator_id: Set(claims.user_id.clone()),
        state: Set(server::ServerState::Enable),
        ..Default::default()
    };

    let new_server = insert_server.insert(&txn).await.unwrap();

    // 创建用户记录
    user_server::ActiveModel {
        server_id: Set(new_server.id.clone()),
        user_id: Set(claims.user_id.clone()),
        ..Default::default()
    }
    .insert(&txn)
    .await
    .unwrap();

    txn.commit().await.unwrap();
    ResultBuilder::success(json!({"serverId": new_server.id.clone(), })).ok()
}

#[get("/api/user/servers")]
pub async fn list_user_server(
    app_state: web::Data<AppState>,
    claims: JWTAuthClaims,
) -> impl Responder {
    let servers: Vec<server::Model> = user_server::Entity::find()
        .filter(user_server::Column::UserId.eq(claims.user_id.clone()))
        .find_also_related(server::Entity)
        .order_by_desc(user_server::Column::Id)
        .all(app_state.db.as_ref())
        .await
        .unwrap()
        .iter()
        .filter_map(|it| it.1.clone())
        .collect();

    ResultBuilder::success(servers).ok()
}

#[get("/api/server/{server_id}/users")]
pub async fn list_server_users(
    app_state: web::Data<AppState>,
    path: web::Path<(i64,)>,
) -> impl Responder {
    #[derive(Debug, FromQueryResult, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct SelectUserResult {
        id: i64,
        server_id: i64,
        room_id: i64,
        user_id: i64,
        session_id: String,
        online: bool,
        user_nickname: String,
        created_time: DateTime,
        updated_time: DateTime,
    }

    let server_id = path.0.clone();
    let db = app_state.db.as_ref();
    let users = room_user::Entity::find()
        .column_as(user::Column::Nickname, "user_nickname")
        .filter(room_user::Column::ServerId.eq(server_id))
        .join_rev(
            JoinType::InnerJoin,
            user::Entity::belongs_to(room_user::Entity)
                .from(user::Column::Id)
                .to(room_user::Column::UserId)
                .into(),
        )
        .into_model::<SelectUserResult>()
        .all(db)
        .await
        .unwrap();

    ResultBuilder::success(users).ok()
}
