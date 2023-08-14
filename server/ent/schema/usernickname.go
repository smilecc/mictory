package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"server/ent/mixins"
)

// UserNickname holds the schema definition for the UserNickname entity.
type UserNickname struct {
	ent.Schema
}

// Fields of the UserNickname.
func (UserNickname) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id"),
		field.String("nickname").MaxLen(32).Comment("昵称"),
		field.Int("no").Comment("编号"),
	}
}

// Edges of the UserNickname.
func (UserNickname) Edges() []ent.Edge {
	return nil
}

func (UserNickname) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixins.DateTime{},
		mixins.SoftDeleteMixin{},
	}
}
