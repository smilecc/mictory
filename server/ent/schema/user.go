package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"server/ent/mixins"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id"),
		field.String("username").MaxLen(32).Comment("用户名"),
		field.String("nickname").MaxLen(32).Comment("昵称"),
		field.Int("nicknameNo").
			StorageKey("nickname_no").
			Comment("昵称编号"),
		field.String("avatar").MaxLen(512).Optional().Comment("头像"),
		field.Enum("sessionState").
			StorageKey("session_state").
			Values("online", "offline").
			Default("offline").
			Comment("会话状态"),
		field.String("password").MaxLen(512).Comment("密码").StructTag(`json:"-"`),
		field.String("password_salt").MaxLen(512).Comment("密码盐").StructTag(`json:"-"`),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("owner", Channel.Type),
		edge.From("channels", Channel.Type).Ref("users"),
	}
}

func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixins.DateTime{},
		mixins.SoftDeleteMixin{},
	}
}
