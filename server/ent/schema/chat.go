package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"server/ent/mixins"
)

// Chat holds the schema definition for the Chat entity.
type Chat struct {
	ent.Schema
}

// Fields of the Chat.
func (Chat) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id"),
		field.Enum("business_type").
			Values("room", "user").
			Comment("业务类型"),
		field.String("business_id").
			MaxLen(128).
			Comment("业务ID"),
		field.String("from_user_id").
			MaxLen(64).
			Comment("来源用户ID"),
		field.Enum("source_type").
			Values("system", "admin", "user").
			Comment("来源类型"),
		field.Enum("content_type").
			Values("text", "image").
			Comment("来源类型"),
		field.Text("content").
			Comment("消息内容"),
	}
}

// Edges of the Chat.
func (Chat) Edges() []ent.Edge {
	return nil
}

func (Chat) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixins.DateTime{},
		mixins.SoftDeleteMixin{},
	}
}
