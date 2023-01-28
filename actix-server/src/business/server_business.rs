use nanoid::nanoid;
use sea_orm::{ActiveModelTrait, ConnectionTrait, Set};

use crate::model::*;

pub async fn create_server<C>(db: &C, name: &str, creator_id: &i64) -> server::Model
where
    C: ConnectionTrait,
{
    // 创建服务器
    let insert_server = server::ActiveModel {
        name: Set(name.to_string()),
        code: Set(nanoid!()),
        creator_id: Set(creator_id.clone()),
        state: Set(server::ServerState::Enable),
        ..Default::default()
    };

    let new_server = insert_server.insert(db).await.unwrap();

    // 创建用户记录
    user_server::ActiveModel {
        server_id: Set(new_server.id.clone()),
        user_id: Set(creator_id.clone()),
        ..Default::default()
    }
    .insert(db)
    .await
    .unwrap();

    // 创建房间
    room::ActiveModel {
        name: Set("默认房间".to_string()),
        server_id: Set(new_server.id.clone()),
        max_member: Set(50),
        ..Default::default()
    }
    .insert(db)
    .await
    .unwrap();

    return new_server;
}
