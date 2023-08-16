// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"server/ent/channel"
	"server/ent/user"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
)

// Channel is the model entity for the Channel schema.
type Channel struct {
	config `json:"-"`
	// ID of the ent.
	ID int64 `json:"id,omitempty"`
	// CreateTime holds the value of the "createTime" field.
	CreateTime time.Time `json:"createTime,omitempty"`
	// UpdateTime holds the value of the "updateTime" field.
	UpdateTime time.Time `json:"updateTime,omitempty"`
	// DeleteTime holds the value of the "delete_time" field.
	DeleteTime time.Time `json:"-"`
	// 频道代号
	Code string `json:"code,omitempty"`
	// 频道名
	Name string `json:"name,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ChannelQuery when eager-loading is set.
	Edges        ChannelEdges `json:"edges"`
	user_owner   *int64
	selectValues sql.SelectValues
}

// ChannelEdges holds the relations/edges for other nodes in the graph.
type ChannelEdges struct {
	// Rooms holds the value of the rooms edge.
	Rooms []*Room `json:"rooms,omitempty"`
	// Users holds the value of the users edge.
	Users []*User `json:"users,omitempty"`
	// 所有人ID
	OwnerUser *User `json:"owner_user,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [3]bool
}

// RoomsOrErr returns the Rooms value or an error if the edge
// was not loaded in eager-loading.
func (e ChannelEdges) RoomsOrErr() ([]*Room, error) {
	if e.loadedTypes[0] {
		return e.Rooms, nil
	}
	return nil, &NotLoadedError{edge: "rooms"}
}

// UsersOrErr returns the Users value or an error if the edge
// was not loaded in eager-loading.
func (e ChannelEdges) UsersOrErr() ([]*User, error) {
	if e.loadedTypes[1] {
		return e.Users, nil
	}
	return nil, &NotLoadedError{edge: "users"}
}

// OwnerUserOrErr returns the OwnerUser value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e ChannelEdges) OwnerUserOrErr() (*User, error) {
	if e.loadedTypes[2] {
		if e.OwnerUser == nil {
			// Edge was loaded but was not found.
			return nil, &NotFoundError{label: user.Label}
		}
		return e.OwnerUser, nil
	}
	return nil, &NotLoadedError{edge: "owner_user"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Channel) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case channel.FieldID:
			values[i] = new(sql.NullInt64)
		case channel.FieldCode, channel.FieldName:
			values[i] = new(sql.NullString)
		case channel.FieldCreateTime, channel.FieldUpdateTime, channel.FieldDeleteTime:
			values[i] = new(sql.NullTime)
		case channel.ForeignKeys[0]: // user_owner
			values[i] = new(sql.NullInt64)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Channel fields.
func (c *Channel) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case channel.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			c.ID = int64(value.Int64)
		case channel.FieldCreateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field createTime", values[i])
			} else if value.Valid {
				c.CreateTime = value.Time
			}
		case channel.FieldUpdateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updateTime", values[i])
			} else if value.Valid {
				c.UpdateTime = value.Time
			}
		case channel.FieldDeleteTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field delete_time", values[i])
			} else if value.Valid {
				c.DeleteTime = value.Time
			}
		case channel.FieldCode:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field code", values[i])
			} else if value.Valid {
				c.Code = value.String
			}
		case channel.FieldName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field name", values[i])
			} else if value.Valid {
				c.Name = value.String
			}
		case channel.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field user_owner", value)
			} else if value.Valid {
				c.user_owner = new(int64)
				*c.user_owner = int64(value.Int64)
			}
		default:
			c.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Channel.
// This includes values selected through modifiers, order, etc.
func (c *Channel) Value(name string) (ent.Value, error) {
	return c.selectValues.Get(name)
}

// QueryRooms queries the "rooms" edge of the Channel entity.
func (c *Channel) QueryRooms() *RoomQuery {
	return NewChannelClient(c.config).QueryRooms(c)
}

// QueryUsers queries the "users" edge of the Channel entity.
func (c *Channel) QueryUsers() *UserQuery {
	return NewChannelClient(c.config).QueryUsers(c)
}

// QueryOwnerUser queries the "owner_user" edge of the Channel entity.
func (c *Channel) QueryOwnerUser() *UserQuery {
	return NewChannelClient(c.config).QueryOwnerUser(c)
}

// Update returns a builder for updating this Channel.
// Note that you need to call Channel.Unwrap() before calling this method if this Channel
// was returned from a transaction, and the transaction was committed or rolled back.
func (c *Channel) Update() *ChannelUpdateOne {
	return NewChannelClient(c.config).UpdateOne(c)
}

// Unwrap unwraps the Channel entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (c *Channel) Unwrap() *Channel {
	_tx, ok := c.config.driver.(*txDriver)
	if !ok {
		panic("ent: Channel is not a transactional entity")
	}
	c.config.driver = _tx.drv
	return c
}

// String implements the fmt.Stringer.
func (c *Channel) String() string {
	var builder strings.Builder
	builder.WriteString("Channel(")
	builder.WriteString(fmt.Sprintf("id=%v, ", c.ID))
	builder.WriteString("createTime=")
	builder.WriteString(c.CreateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updateTime=")
	builder.WriteString(c.UpdateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("delete_time=")
	builder.WriteString(c.DeleteTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("code=")
	builder.WriteString(c.Code)
	builder.WriteString(", ")
	builder.WriteString("name=")
	builder.WriteString(c.Name)
	builder.WriteByte(')')
	return builder.String()
}

// Channels is a parsable slice of Channel.
type Channels []*Channel
