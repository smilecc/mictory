package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"server/ent/mixins"
)

// Room holds the schema definition for the Room entity.
type Room struct {
	ent.Schema
}

// Fields of the Room.
func (Room) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id"),
		field.String("name").MaxLen(64).Comment("房间名"),
		field.Int32("maxMember").
			StorageKey("max_member").
			Default(50).
			Comment("房间最大人数"),
		field.Int32("sort").Default(0),
	}
}

// Edges of the Room.
func (Room) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("channel", Channel.Type).
			Ref("rooms").
			Unique().
			Required().
			Comment("频道ID"),
	}
}

func (Room) Mixin() []ent.Mixin {
	return []ent.Mixin{
		mixins.DateTime{},
		mixins.SoftDeleteMixin{},
	}
}
