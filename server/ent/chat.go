// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"server/ent/chat"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
)

// Chat is the model entity for the Chat schema.
type Chat struct {
	config `json:"-"`
	// ID of the ent.
	ID int64 `json:"id,omitempty"`
	// CreateTime holds the value of the "create_time" field.
	CreateTime time.Time `json:"create_time,omitempty"`
	// UpdateTime holds the value of the "update_time" field.
	UpdateTime time.Time `json:"update_time,omitempty"`
	// DeleteTime holds the value of the "delete_time" field.
	DeleteTime time.Time `json:"delete_time,omitempty"`
	// 业务类型
	BusinessType chat.BusinessType `json:"business_type,omitempty"`
	// 业务ID
	BusinessID string `json:"business_id,omitempty"`
	// 来源用户ID
	FromUserID string `json:"from_user_id,omitempty"`
	// 来源类型
	SourceType chat.SourceType `json:"source_type,omitempty"`
	// 来源类型
	ContentType chat.ContentType `json:"content_type,omitempty"`
	// 消息内容
	Content      string `json:"content,omitempty"`
	selectValues sql.SelectValues
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Chat) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case chat.FieldID:
			values[i] = new(sql.NullInt64)
		case chat.FieldBusinessType, chat.FieldBusinessID, chat.FieldFromUserID, chat.FieldSourceType, chat.FieldContentType, chat.FieldContent:
			values[i] = new(sql.NullString)
		case chat.FieldCreateTime, chat.FieldUpdateTime, chat.FieldDeleteTime:
			values[i] = new(sql.NullTime)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Chat fields.
func (c *Chat) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case chat.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			c.ID = int64(value.Int64)
		case chat.FieldCreateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field create_time", values[i])
			} else if value.Valid {
				c.CreateTime = value.Time
			}
		case chat.FieldUpdateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field update_time", values[i])
			} else if value.Valid {
				c.UpdateTime = value.Time
			}
		case chat.FieldDeleteTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field delete_time", values[i])
			} else if value.Valid {
				c.DeleteTime = value.Time
			}
		case chat.FieldBusinessType:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field business_type", values[i])
			} else if value.Valid {
				c.BusinessType = chat.BusinessType(value.String)
			}
		case chat.FieldBusinessID:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field business_id", values[i])
			} else if value.Valid {
				c.BusinessID = value.String
			}
		case chat.FieldFromUserID:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field from_user_id", values[i])
			} else if value.Valid {
				c.FromUserID = value.String
			}
		case chat.FieldSourceType:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field source_type", values[i])
			} else if value.Valid {
				c.SourceType = chat.SourceType(value.String)
			}
		case chat.FieldContentType:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field content_type", values[i])
			} else if value.Valid {
				c.ContentType = chat.ContentType(value.String)
			}
		case chat.FieldContent:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field content", values[i])
			} else if value.Valid {
				c.Content = value.String
			}
		default:
			c.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Chat.
// This includes values selected through modifiers, order, etc.
func (c *Chat) Value(name string) (ent.Value, error) {
	return c.selectValues.Get(name)
}

// Update returns a builder for updating this Chat.
// Note that you need to call Chat.Unwrap() before calling this method if this Chat
// was returned from a transaction, and the transaction was committed or rolled back.
func (c *Chat) Update() *ChatUpdateOne {
	return NewChatClient(c.config).UpdateOne(c)
}

// Unwrap unwraps the Chat entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (c *Chat) Unwrap() *Chat {
	_tx, ok := c.config.driver.(*txDriver)
	if !ok {
		panic("ent: Chat is not a transactional entity")
	}
	c.config.driver = _tx.drv
	return c
}

// String implements the fmt.Stringer.
func (c *Chat) String() string {
	var builder strings.Builder
	builder.WriteString("Chat(")
	builder.WriteString(fmt.Sprintf("id=%v, ", c.ID))
	builder.WriteString("create_time=")
	builder.WriteString(c.CreateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("update_time=")
	builder.WriteString(c.UpdateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("delete_time=")
	builder.WriteString(c.DeleteTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("business_type=")
	builder.WriteString(fmt.Sprintf("%v", c.BusinessType))
	builder.WriteString(", ")
	builder.WriteString("business_id=")
	builder.WriteString(c.BusinessID)
	builder.WriteString(", ")
	builder.WriteString("from_user_id=")
	builder.WriteString(c.FromUserID)
	builder.WriteString(", ")
	builder.WriteString("source_type=")
	builder.WriteString(fmt.Sprintf("%v", c.SourceType))
	builder.WriteString(", ")
	builder.WriteString("content_type=")
	builder.WriteString(fmt.Sprintf("%v", c.ContentType))
	builder.WriteString(", ")
	builder.WriteString("content=")
	builder.WriteString(c.Content)
	builder.WriteByte(')')
	return builder.String()
}

// Chats is a parsable slice of Chat.
type Chats []*Chat
