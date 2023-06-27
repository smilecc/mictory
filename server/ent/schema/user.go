package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
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
		field.String("username").MinLen(32).Comment("用户名"),
		field.String("nickname").MaxLen(32).Comment("昵称"),
		field.Int("nickname_no").Comment("昵称编号"),
		field.String("avatar").MaxLen(512).Optional().Comment("头像"),
		field.Enum("session_state").
			Values("online", "offline").
			Default("offline").
			Comment("会话状态"),
		field.String("password").Comment("密码"),
		field.String("password_salt").Comment("密码盐"),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("owner", Channel.Type),
	}
}

func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixin.Time{},
		mixins.SoftDeleteMixin{},
	}
}
