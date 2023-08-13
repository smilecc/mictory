// Code generated by ent, DO NOT EDIT.

package room

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
)

const (
	// Label holds the string label denoting the room type in the database.
	Label = "room"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreateTime holds the string denoting the create_time field in the database.
	FieldCreateTime = "create_time"
	// FieldUpdateTime holds the string denoting the update_time field in the database.
	FieldUpdateTime = "update_time"
	// FieldDeleteTime holds the string denoting the delete_time field in the database.
	FieldDeleteTime = "delete_time"
	// FieldName holds the string denoting the name field in the database.
	FieldName = "name"
	// FieldMaxMember holds the string denoting the max_member field in the database.
	FieldMaxMember = "max_member"
	// FieldSort holds the string denoting the sort field in the database.
	FieldSort = "sort"
	// EdgeChannel holds the string denoting the channel edge name in mutations.
	EdgeChannel = "channel"
	// Table holds the table name of the room in the database.
	Table = "rooms"
	// ChannelTable is the table that holds the channel relation/edge.
	ChannelTable = "rooms"
	// ChannelInverseTable is the table name for the Channel entity.
	// It exists in this package in order to avoid circular dependency with the "channel" package.
	ChannelInverseTable = "channels"
	// ChannelColumn is the table column denoting the channel relation/edge.
	ChannelColumn = "channel_rooms"
)

// Columns holds all SQL columns for room fields.
var Columns = []string{
	FieldID,
	FieldCreateTime,
	FieldUpdateTime,
	FieldDeleteTime,
	FieldName,
	FieldMaxMember,
	FieldSort,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "rooms"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"channel_rooms",
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

// Note that the variables below are initialized by the runtime
// package on the initialization of the application. Therefore,
// it should be imported in the main as follows:
//
//	import _ "server/ent/runtime"
var (
	Hooks        [1]ent.Hook
	Interceptors [1]ent.Interceptor
	// DefaultCreateTime holds the default value on creation for the "create_time" field.
	DefaultCreateTime func() time.Time
	// DefaultUpdateTime holds the default value on creation for the "update_time" field.
	DefaultUpdateTime func() time.Time
	// UpdateDefaultUpdateTime holds the default value on update for the "update_time" field.
	UpdateDefaultUpdateTime func() time.Time
	// NameValidator is a validator for the "name" field. It is called by the builders before save.
	NameValidator func(string) error
	// DefaultMaxMember holds the default value on creation for the "max_member" field.
	DefaultMaxMember int
	// DefaultSort holds the default value on creation for the "sort" field.
	DefaultSort int
)

// OrderOption defines the ordering options for the Room queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByCreateTime orders the results by the create_time field.
func ByCreateTime(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCreateTime, opts...).ToFunc()
}

// ByUpdateTime orders the results by the update_time field.
func ByUpdateTime(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUpdateTime, opts...).ToFunc()
}

// ByDeleteTime orders the results by the delete_time field.
func ByDeleteTime(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldDeleteTime, opts...).ToFunc()
}

// ByName orders the results by the name field.
func ByName(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldName, opts...).ToFunc()
}

// ByMaxMember orders the results by the max_member field.
func ByMaxMember(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldMaxMember, opts...).ToFunc()
}

// BySort orders the results by the sort field.
func BySort(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldSort, opts...).ToFunc()
}

// ByChannelField orders the results by channel field.
func ByChannelField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newChannelStep(), sql.OrderByField(field, opts...))
	}
}
func newChannelStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(ChannelInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, ChannelTable, ChannelColumn),
	)
}