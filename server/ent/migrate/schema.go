// Code generated by ent, DO NOT EDIT.

package migrate

import (
	"entgo.io/ent/dialect/sql/schema"
	"entgo.io/ent/schema/field"
)

var (
	// ChannelsColumns holds the columns for the "channels" table.
	ChannelsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt64, Increment: true},
		{Name: "create_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "update_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "delete_time", Type: field.TypeTime, Nullable: true, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "code", Type: field.TypeString, Unique: true, Nullable: true, Size: 32},
		{Name: "name", Type: field.TypeString, Size: 32},
		{Name: "user_owner", Type: field.TypeInt64},
	}
	// ChannelsTable holds the schema information for the "channels" table.
	ChannelsTable = &schema.Table{
		Name:       "channels",
		Columns:    ChannelsColumns,
		PrimaryKey: []*schema.Column{ChannelsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "channels_users_owner",
				Columns:    []*schema.Column{ChannelsColumns[6]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.NoAction,
			},
		},
	}
	// ChannelRolesColumns holds the columns for the "channel_roles" table.
	ChannelRolesColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
	}
	// ChannelRolesTable holds the schema information for the "channel_roles" table.
	ChannelRolesTable = &schema.Table{
		Name:       "channel_roles",
		Columns:    ChannelRolesColumns,
		PrimaryKey: []*schema.Column{ChannelRolesColumns[0]},
	}
	// ChatsColumns holds the columns for the "chats" table.
	ChatsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt64, Increment: true},
		{Name: "create_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "update_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "delete_time", Type: field.TypeTime, Nullable: true, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "business_type", Type: field.TypeEnum, Enums: []string{"room", "user"}},
		{Name: "business_id", Type: field.TypeString, Size: 128},
		{Name: "from_user_id", Type: field.TypeString, Size: 64},
		{Name: "source_type", Type: field.TypeEnum, Enums: []string{"system", "admin", "user"}},
		{Name: "content_type", Type: field.TypeEnum, Enums: []string{"text", "image"}},
		{Name: "content", Type: field.TypeString, Size: 2147483647},
	}
	// ChatsTable holds the schema information for the "chats" table.
	ChatsTable = &schema.Table{
		Name:       "chats",
		Columns:    ChatsColumns,
		PrimaryKey: []*schema.Column{ChatsColumns[0]},
	}
	// RoomsColumns holds the columns for the "rooms" table.
	RoomsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt64, Increment: true},
		{Name: "create_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "update_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "delete_time", Type: field.TypeTime, Nullable: true, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "name", Type: field.TypeString, Size: 64},
		{Name: "max_member", Type: field.TypeInt, Default: 50},
		{Name: "sort", Type: field.TypeInt, Default: 0},
		{Name: "channel_rooms", Type: field.TypeInt64},
	}
	// RoomsTable holds the schema information for the "rooms" table.
	RoomsTable = &schema.Table{
		Name:       "rooms",
		Columns:    RoomsColumns,
		PrimaryKey: []*schema.Column{RoomsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "rooms_channels_rooms",
				Columns:    []*schema.Column{RoomsColumns[7]},
				RefColumns: []*schema.Column{ChannelsColumns[0]},
				OnDelete:   schema.NoAction,
			},
		},
	}
	// UsersColumns holds the columns for the "users" table.
	UsersColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt64, Increment: true},
		{Name: "create_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "update_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "delete_time", Type: field.TypeTime, Nullable: true, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "username", Type: field.TypeString, Size: 32},
		{Name: "nickname", Type: field.TypeString, Size: 32},
		{Name: "nickname_no", Type: field.TypeInt},
		{Name: "avatar", Type: field.TypeString, Nullable: true, Size: 512},
		{Name: "session_state", Type: field.TypeEnum, Enums: []string{"online", "offline"}, Default: "offline"},
		{Name: "password", Type: field.TypeString, Size: 512},
		{Name: "password_salt", Type: field.TypeString, Size: 512},
	}
	// UsersTable holds the schema information for the "users" table.
	UsersTable = &schema.Table{
		Name:       "users",
		Columns:    UsersColumns,
		PrimaryKey: []*schema.Column{UsersColumns[0]},
	}
	// UserNicknamesColumns holds the columns for the "user_nicknames" table.
	UserNicknamesColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt64, Increment: true},
		{Name: "create_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "update_time", Type: field.TypeTime, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "delete_time", Type: field.TypeTime, Nullable: true, SchemaType: map[string]string{"mysql": "datetime"}},
		{Name: "nickname", Type: field.TypeString, Size: 32},
		{Name: "no", Type: field.TypeInt},
	}
	// UserNicknamesTable holds the schema information for the "user_nicknames" table.
	UserNicknamesTable = &schema.Table{
		Name:       "user_nicknames",
		Columns:    UserNicknamesColumns,
		PrimaryKey: []*schema.Column{UserNicknamesColumns[0]},
	}
	// ChannelUsersColumns holds the columns for the "channel_users" table.
	ChannelUsersColumns = []*schema.Column{
		{Name: "channel_id", Type: field.TypeInt64},
		{Name: "user_id", Type: field.TypeInt64},
	}
	// ChannelUsersTable holds the schema information for the "channel_users" table.
	ChannelUsersTable = &schema.Table{
		Name:       "channel_users",
		Columns:    ChannelUsersColumns,
		PrimaryKey: []*schema.Column{ChannelUsersColumns[0], ChannelUsersColumns[1]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "channel_users_channel_id",
				Columns:    []*schema.Column{ChannelUsersColumns[0]},
				RefColumns: []*schema.Column{ChannelsColumns[0]},
				OnDelete:   schema.Cascade,
			},
			{
				Symbol:     "channel_users_user_id",
				Columns:    []*schema.Column{ChannelUsersColumns[1]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.Cascade,
			},
		},
	}
	// Tables holds all the tables in the schema.
	Tables = []*schema.Table{
		ChannelsTable,
		ChannelRolesTable,
		ChatsTable,
		RoomsTable,
		UsersTable,
		UserNicknamesTable,
		ChannelUsersTable,
	}
)

func init() {
	ChannelsTable.ForeignKeys[0].RefTable = UsersTable
	RoomsTable.ForeignKeys[0].RefTable = ChannelsTable
	ChannelUsersTable.ForeignKeys[0].RefTable = ChannelsTable
	ChannelUsersTable.ForeignKeys[1].RefTable = UsersTable
}
