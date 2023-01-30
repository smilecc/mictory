use model::room_user;
use sea_orm_migration::{prelude::*, sea_orm::DbBackend};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RoomUser::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(room_user::Column::Id)
                            .big_integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(room_user::Column::ServerId)
                            .big_integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(room_user::Column::RoomId)
                            .big_integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(room_user::Column::UserId)
                            .big_integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(room_user::Column::SessionId)
                            .string_len(32)
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(room_user::Column::Online)
                            .boolean()
                            .not_null()
                            .default(0),
                    )
                    .col(
                        ColumnDef::new(room_user::Column::CreatedTime)
                            .date_time()
                            .not_null()
                            .default(SimpleExpr::Custom("CURRENT_TIMESTAMP".to_string())),
                    )
                    .col(
                        ColumnDef::new(room_user::Column::UpdatedTime)
                            .date_time()
                            .not_null()
                            .extra(
                                if manager.get_database_backend() == DbBackend::MySql {
                                    "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                                } else {
                                    "DEFAULT CURRENT_TIMESTAMP"
                                }
                                .to_string(),
                            ),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts

        manager
            .drop_table(Table::drop().table(RoomUser::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum RoomUser {
    Table,
}
