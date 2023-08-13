package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"server/ent/mixins"
)

// Channel holds the schema definition for the Channel entity.
type Channel struct {
	ent.Schema
}

// Fields of the Channel.
func (Channel) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id"),
		field.String("code").
			MaxLen(32).
			Unique().
			Optional().
			Comment("频道代号"),
		field.String("name").
			MaxLen(32).
			Comment("频道名"),
	}
}

// Edges of the Channel.
func (Channel) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("rooms", Room.Type),
		edge.From("owner_user", User.Type).
			Ref("owner").
			Unique().
			Required().
			Comment("所有人ID"),
	}
}

func (Channel) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixins.DateTime{},
		mixins.SoftDeleteMixin{},
	}
}