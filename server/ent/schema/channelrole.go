package schema

import "entgo.io/ent"

// ChannelRole holds the schema definition for the ChannelRole entity.
type ChannelRole struct {
	ent.Schema
}

// Fields of the ChannelRole.
func (ChannelRole) Fields() []ent.Field {
	return nil
}

// Edges of the ChannelRole.
func (ChannelRole) Edges() []ent.Edge {
	return nil
}
