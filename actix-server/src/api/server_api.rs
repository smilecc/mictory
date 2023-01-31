use crate::{api::ResultBuilder, business::server_business, AppState, VERSION};
use actix_web::{get, http::StatusCode, post, web, Responder};
use model::{room_user, server, user, user_server};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, EntityTrait, FromQueryResult, JoinType, PaginatorTrait,
    QueryFilter, QuerySelect, Set, TransactionTrait,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use validator::Validate;

use super::middleware::JWTAuthClaims;
use sea_orm::prelude::DateTime;

#[get("/api/version")]
pub async fn get_version() -> impl Responder {
    ResultBuilder::success(json!({ "version": VERSION })).ok()
}

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
    let new_server = server_business::create_server(&txn, &query.name, &claims.user_id).await;

    txn.commit().await.unwrap();
    ResultBuilder::success(json!({"serverId": new_server.id.clone(), })).ok()
}

#[post("/api/server/{server_id}/join")]
pub async fn join_server(
    app_state: web::Data<AppState>,
    path: web::Path<(i64,)>,
    claims: JWTAuthClaims,
) -> impl Responder {
    let txn = app_state.db.begin().await.unwrap();

    // 查询服务器是否存在
    let current_server = server::Entity::find()
        .filter(server::Column::Id.eq(path.0.clone()))
        .one(&txn)
        .await
        .unwrap();

    if current_server.is_none() {
        return ResultBuilder::fail_str(10404, "服务器不存在").err(StatusCode::NOT_FOUND);
    }

    // 查询是否已经加入
    let exist_count = user_server::Entity::find()
        .filter(user_server::Column::ServerId.eq(path.0.clone()))
        .filter(user_server::Column::UserId.eq(claims.user_id.clone()))
        .count(&txn)
        .await
        .unwrap();

    // 创建用户记录
    if exist_count == 0 {
        user_server::ActiveModel {
            server_id: Set(path.0.clone()),
            user_id: Set(claims.user_id.clone()),
            ..Default::default()
        }
        .insert(&txn)
        .await
        .unwrap();
    }

    txn.commit().await.unwrap();
    ResultBuilder::success_with_null().ok()
}

#[get("/api/user/servers")]
pub async fn list_user_server(
    app_state: web::Data<AppState>,
    claims: JWTAuthClaims,
) -> impl Responder {
    let servers: Vec<server::Model> = user_server::Entity::find()
        .filter(user_server::Column::UserId.eq(claims.user_id.clone()))
        .find_also_related(server::Entity)
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
        id: Option<i64>,
        server_id: i64,
        room_id: i64,
        user_id: i64,
        session_id: Option<String>,
        online: bool,
        session_online: bool,
        user_nickname: String,
        created_time: Option<DateTime>,
        updated_time: Option<DateTime>,
    }

    #[derive(Debug, FromQueryResult, Serialize, Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct SelectServerUserResult {
        server_id: i64,
        user_id: i64,
        user_nickname: String,
        session_online: bool,
    }

    let server_id = path.0.clone();
    let db = app_state.db.clone().begin().await.unwrap();

    // 查询房间用户列表
    let mut users = room_user::Entity::find()
        .column_as(user::Column::Nickname, "user_nickname")
        .column(user::Column::SessionOnline)
        .filter(room_user::Column::ServerId.eq(server_id))
        .join_rev(
            JoinType::LeftJoin,
            user::Entity::belongs_to(room_user::Entity)
                .from(user::Column::Id)
                .to(room_user::Column::UserId)
                .into(),
        )
        .into_model::<SelectUserResult>()
        .all(&db)
        .await
        .unwrap();

    // 查询服务器用户列表
    let server_users = user_server::Entity::find()
        .column_as(user::Column::Nickname, "user_nickname")
        .column(user::Column::SessionOnline)
        .filter(user_server::Column::ServerId.eq(server_id))
        .join_rev(
            JoinType::LeftJoin,
            user::Entity::belongs_to(user_server::Entity)
                .from(user::Column::Id)
                .to(user_server::Column::UserId)
                .into(),
        )
        .into_model::<SelectServerUserResult>()
        .all(&db)
        .await
        .unwrap();

    for server_user in server_users.iter() {
        // 查询当前用户是否在房间列表中
        if users
            .iter()
            .find(|&u| u.user_id == server_user.user_id)
            .is_none()
        {
            users.push(SelectUserResult {
                server_id: server_user.server_id.clone(),
                room_id: 0,
                user_id: server_user.user_id.clone(),
                online: false,
                session_online: server_user.session_online.clone(),
                user_nickname: server_user.user_nickname.clone(),
                id: None,
                session_id: None,
                created_time: None,
                updated_time: None,
            });
        }
    }

    ResultBuilder::success(users).ok()
}
