pub use sea_orm_migration::prelude::*;

mod m20230130_162955_room;
mod m20230130_174041_room_user;
mod m20230130_174639_server;
mod m20230130_174920_user;
mod m20230130_175143_user_nickname;
mod m20230130_175316_user_server;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20230130_162955_room::Migration),
            Box::new(m20230130_174041_room_user::Migration),
            Box::new(m20230130_174639_server::Migration),
            Box::new(m20230130_174920_user::Migration),
            Box::new(m20230130_175143_user_nickname::Migration),
            Box::new(m20230130_175316_user_server::Migration),
        ]
    }
}
