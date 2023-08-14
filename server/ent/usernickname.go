// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"server/ent/usernickname"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
)

// UserNickname is the model entity for the UserNickname schema.
type UserNickname struct {
	config `json:"-"`
	// ID of the ent.
	ID int64 `json:"id,omitempty"`
	// CreateTime holds the value of the "create_time" field.
	CreateTime time.Time `json:"create_time,omitempty"`
	// UpdateTime holds the value of the "update_time" field.
	UpdateTime time.Time `json:"update_time,omitempty"`
	// DeleteTime holds the value of the "delete_time" field.
	DeleteTime time.Time `json:"delete_time,omitempty"`
	// 昵称
	Nickname string `json:"nickname,omitempty"`
	// 编号
	No           int `json:"no,omitempty"`
	selectValues sql.SelectValues
}

// scanValues returns the types for scanning values from sql.Rows.
func (*UserNickname) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case usernickname.FieldID, usernickname.FieldNo:
			values[i] = new(sql.NullInt64)
		case usernickname.FieldNickname:
			values[i] = new(sql.NullString)
		case usernickname.FieldCreateTime, usernickname.FieldUpdateTime, usernickname.FieldDeleteTime:
			values[i] = new(sql.NullTime)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the UserNickname fields.
func (un *UserNickname) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case usernickname.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			un.ID = int64(value.Int64)
		case usernickname.FieldCreateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field create_time", values[i])
			} else if value.Valid {
				un.CreateTime = value.Time
			}
		case usernickname.FieldUpdateTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field update_time", values[i])
			} else if value.Valid {
				un.UpdateTime = value.Time
			}
		case usernickname.FieldDeleteTime:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field delete_time", values[i])
			} else if value.Valid {
				un.DeleteTime = value.Time
			}
		case usernickname.FieldNickname:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field nickname", values[i])
			} else if value.Valid {
				un.Nickname = value.String
			}
		case usernickname.FieldNo:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field no", values[i])
			} else if value.Valid {
				un.No = int(value.Int64)
			}
		default:
			un.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the UserNickname.
// This includes values selected through modifiers, order, etc.
func (un *UserNickname) Value(name string) (ent.Value, error) {
	return un.selectValues.Get(name)
}

// Update returns a builder for updating this UserNickname.
// Note that you need to call UserNickname.Unwrap() before calling this method if this UserNickname
// was returned from a transaction, and the transaction was committed or rolled back.
func (un *UserNickname) Update() *UserNicknameUpdateOne {
	return NewUserNicknameClient(un.config).UpdateOne(un)
}

// Unwrap unwraps the UserNickname entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (un *UserNickname) Unwrap() *UserNickname {
	_tx, ok := un.config.driver.(*txDriver)
	if !ok {
		panic("ent: UserNickname is not a transactional entity")
	}
	un.config.driver = _tx.drv
	return un
}

// String implements the fmt.Stringer.
func (un *UserNickname) String() string {
	var builder strings.Builder
	builder.WriteString("UserNickname(")
	builder.WriteString(fmt.Sprintf("id=%v, ", un.ID))
	builder.WriteString("create_time=")
	builder.WriteString(un.CreateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("update_time=")
	builder.WriteString(un.UpdateTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("delete_time=")
	builder.WriteString(un.DeleteTime.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("nickname=")
	builder.WriteString(un.Nickname)
	builder.WriteString(", ")
	builder.WriteString("no=")
	builder.WriteString(fmt.Sprintf("%v", un.No))
	builder.WriteByte(')')
	return builder.String()
}

// UserNicknames is a parsable slice of UserNickname.
type UserNicknames []*UserNickname