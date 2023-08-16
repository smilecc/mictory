// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"server/ent/chat"
	"server/ent/predicate"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
)

// ChatUpdate is the builder for updating Chat entities.
type ChatUpdate struct {
	config
	hooks    []Hook
	mutation *ChatMutation
}

// Where appends a list predicates to the ChatUpdate builder.
func (cu *ChatUpdate) Where(ps ...predicate.Chat) *ChatUpdate {
	cu.mutation.Where(ps...)
	return cu
}

// SetUpdateTime sets the "updateTime" field.
func (cu *ChatUpdate) SetUpdateTime(t time.Time) *ChatUpdate {
	cu.mutation.SetUpdateTime(t)
	return cu
}

// SetDeleteTime sets the "delete_time" field.
func (cu *ChatUpdate) SetDeleteTime(t time.Time) *ChatUpdate {
	cu.mutation.SetDeleteTime(t)
	return cu
}

// SetNillableDeleteTime sets the "delete_time" field if the given value is not nil.
func (cu *ChatUpdate) SetNillableDeleteTime(t *time.Time) *ChatUpdate {
	if t != nil {
		cu.SetDeleteTime(*t)
	}
	return cu
}

// ClearDeleteTime clears the value of the "delete_time" field.
func (cu *ChatUpdate) ClearDeleteTime() *ChatUpdate {
	cu.mutation.ClearDeleteTime()
	return cu
}

// SetBusinessType sets the "businessType" field.
func (cu *ChatUpdate) SetBusinessType(ct chat.BusinessType) *ChatUpdate {
	cu.mutation.SetBusinessType(ct)
	return cu
}

// SetBusinessID sets the "business_id" field.
func (cu *ChatUpdate) SetBusinessID(s string) *ChatUpdate {
	cu.mutation.SetBusinessID(s)
	return cu
}

// SetFromUserId sets the "fromUserId" field.
func (cu *ChatUpdate) SetFromUserId(s string) *ChatUpdate {
	cu.mutation.SetFromUserId(s)
	return cu
}

// SetSourceType sets the "sourceType" field.
func (cu *ChatUpdate) SetSourceType(ct chat.SourceType) *ChatUpdate {
	cu.mutation.SetSourceType(ct)
	return cu
}

// SetContentType sets the "contentType" field.
func (cu *ChatUpdate) SetContentType(ct chat.ContentType) *ChatUpdate {
	cu.mutation.SetContentType(ct)
	return cu
}

// SetContent sets the "content" field.
func (cu *ChatUpdate) SetContent(s string) *ChatUpdate {
	cu.mutation.SetContent(s)
	return cu
}

// Mutation returns the ChatMutation object of the builder.
func (cu *ChatUpdate) Mutation() *ChatMutation {
	return cu.mutation
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (cu *ChatUpdate) Save(ctx context.Context) (int, error) {
	if err := cu.defaults(); err != nil {
		return 0, err
	}
	return withHooks(ctx, cu.sqlSave, cu.mutation, cu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (cu *ChatUpdate) SaveX(ctx context.Context) int {
	affected, err := cu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (cu *ChatUpdate) Exec(ctx context.Context) error {
	_, err := cu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (cu *ChatUpdate) ExecX(ctx context.Context) {
	if err := cu.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (cu *ChatUpdate) defaults() error {
	if _, ok := cu.mutation.UpdateTime(); !ok {
		if chat.UpdateDefaultUpdateTime == nil {
			return fmt.Errorf("ent: uninitialized chat.UpdateDefaultUpdateTime (forgotten import ent/runtime?)")
		}
		v := chat.UpdateDefaultUpdateTime()
		cu.mutation.SetUpdateTime(v)
	}
	return nil
}

// check runs all checks and user-defined validators on the builder.
func (cu *ChatUpdate) check() error {
	if v, ok := cu.mutation.BusinessType(); ok {
		if err := chat.BusinessTypeValidator(v); err != nil {
			return &ValidationError{Name: "businessType", err: fmt.Errorf(`ent: validator failed for field "Chat.businessType": %w`, err)}
		}
	}
	if v, ok := cu.mutation.BusinessID(); ok {
		if err := chat.BusinessIDValidator(v); err != nil {
			return &ValidationError{Name: "business_id", err: fmt.Errorf(`ent: validator failed for field "Chat.business_id": %w`, err)}
		}
	}
	if v, ok := cu.mutation.FromUserId(); ok {
		if err := chat.FromUserIdValidator(v); err != nil {
			return &ValidationError{Name: "fromUserId", err: fmt.Errorf(`ent: validator failed for field "Chat.fromUserId": %w`, err)}
		}
	}
	if v, ok := cu.mutation.SourceType(); ok {
		if err := chat.SourceTypeValidator(v); err != nil {
			return &ValidationError{Name: "sourceType", err: fmt.Errorf(`ent: validator failed for field "Chat.sourceType": %w`, err)}
		}
	}
	if v, ok := cu.mutation.ContentType(); ok {
		if err := chat.ContentTypeValidator(v); err != nil {
			return &ValidationError{Name: "contentType", err: fmt.Errorf(`ent: validator failed for field "Chat.contentType": %w`, err)}
		}
	}
	return nil
}

func (cu *ChatUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := cu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(chat.Table, chat.Columns, sqlgraph.NewFieldSpec(chat.FieldID, field.TypeInt64))
	if ps := cu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := cu.mutation.UpdateTime(); ok {
		_spec.SetField(chat.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := cu.mutation.DeleteTime(); ok {
		_spec.SetField(chat.FieldDeleteTime, field.TypeTime, value)
	}
	if cu.mutation.DeleteTimeCleared() {
		_spec.ClearField(chat.FieldDeleteTime, field.TypeTime)
	}
	if value, ok := cu.mutation.BusinessType(); ok {
		_spec.SetField(chat.FieldBusinessType, field.TypeEnum, value)
	}
	if value, ok := cu.mutation.BusinessID(); ok {
		_spec.SetField(chat.FieldBusinessID, field.TypeString, value)
	}
	if value, ok := cu.mutation.FromUserId(); ok {
		_spec.SetField(chat.FieldFromUserId, field.TypeString, value)
	}
	if value, ok := cu.mutation.SourceType(); ok {
		_spec.SetField(chat.FieldSourceType, field.TypeEnum, value)
	}
	if value, ok := cu.mutation.ContentType(); ok {
		_spec.SetField(chat.FieldContentType, field.TypeEnum, value)
	}
	if value, ok := cu.mutation.Content(); ok {
		_spec.SetField(chat.FieldContent, field.TypeString, value)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, cu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{chat.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	cu.mutation.done = true
	return n, nil
}

// ChatUpdateOne is the builder for updating a single Chat entity.
type ChatUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *ChatMutation
}

// SetUpdateTime sets the "updateTime" field.
func (cuo *ChatUpdateOne) SetUpdateTime(t time.Time) *ChatUpdateOne {
	cuo.mutation.SetUpdateTime(t)
	return cuo
}

// SetDeleteTime sets the "delete_time" field.
func (cuo *ChatUpdateOne) SetDeleteTime(t time.Time) *ChatUpdateOne {
	cuo.mutation.SetDeleteTime(t)
	return cuo
}

// SetNillableDeleteTime sets the "delete_time" field if the given value is not nil.
func (cuo *ChatUpdateOne) SetNillableDeleteTime(t *time.Time) *ChatUpdateOne {
	if t != nil {
		cuo.SetDeleteTime(*t)
	}
	return cuo
}

// ClearDeleteTime clears the value of the "delete_time" field.
func (cuo *ChatUpdateOne) ClearDeleteTime() *ChatUpdateOne {
	cuo.mutation.ClearDeleteTime()
	return cuo
}

// SetBusinessType sets the "businessType" field.
func (cuo *ChatUpdateOne) SetBusinessType(ct chat.BusinessType) *ChatUpdateOne {
	cuo.mutation.SetBusinessType(ct)
	return cuo
}

// SetBusinessID sets the "business_id" field.
func (cuo *ChatUpdateOne) SetBusinessID(s string) *ChatUpdateOne {
	cuo.mutation.SetBusinessID(s)
	return cuo
}

// SetFromUserId sets the "fromUserId" field.
func (cuo *ChatUpdateOne) SetFromUserId(s string) *ChatUpdateOne {
	cuo.mutation.SetFromUserId(s)
	return cuo
}

// SetSourceType sets the "sourceType" field.
func (cuo *ChatUpdateOne) SetSourceType(ct chat.SourceType) *ChatUpdateOne {
	cuo.mutation.SetSourceType(ct)
	return cuo
}

// SetContentType sets the "contentType" field.
func (cuo *ChatUpdateOne) SetContentType(ct chat.ContentType) *ChatUpdateOne {
	cuo.mutation.SetContentType(ct)
	return cuo
}

// SetContent sets the "content" field.
func (cuo *ChatUpdateOne) SetContent(s string) *ChatUpdateOne {
	cuo.mutation.SetContent(s)
	return cuo
}

// Mutation returns the ChatMutation object of the builder.
func (cuo *ChatUpdateOne) Mutation() *ChatMutation {
	return cuo.mutation
}

// Where appends a list predicates to the ChatUpdate builder.
func (cuo *ChatUpdateOne) Where(ps ...predicate.Chat) *ChatUpdateOne {
	cuo.mutation.Where(ps...)
	return cuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (cuo *ChatUpdateOne) Select(field string, fields ...string) *ChatUpdateOne {
	cuo.fields = append([]string{field}, fields...)
	return cuo
}

// Save executes the query and returns the updated Chat entity.
func (cuo *ChatUpdateOne) Save(ctx context.Context) (*Chat, error) {
	if err := cuo.defaults(); err != nil {
		return nil, err
	}
	return withHooks(ctx, cuo.sqlSave, cuo.mutation, cuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (cuo *ChatUpdateOne) SaveX(ctx context.Context) *Chat {
	node, err := cuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (cuo *ChatUpdateOne) Exec(ctx context.Context) error {
	_, err := cuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (cuo *ChatUpdateOne) ExecX(ctx context.Context) {
	if err := cuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (cuo *ChatUpdateOne) defaults() error {
	if _, ok := cuo.mutation.UpdateTime(); !ok {
		if chat.UpdateDefaultUpdateTime == nil {
			return fmt.Errorf("ent: uninitialized chat.UpdateDefaultUpdateTime (forgotten import ent/runtime?)")
		}
		v := chat.UpdateDefaultUpdateTime()
		cuo.mutation.SetUpdateTime(v)
	}
	return nil
}

// check runs all checks and user-defined validators on the builder.
func (cuo *ChatUpdateOne) check() error {
	if v, ok := cuo.mutation.BusinessType(); ok {
		if err := chat.BusinessTypeValidator(v); err != nil {
			return &ValidationError{Name: "businessType", err: fmt.Errorf(`ent: validator failed for field "Chat.businessType": %w`, err)}
		}
	}
	if v, ok := cuo.mutation.BusinessID(); ok {
		if err := chat.BusinessIDValidator(v); err != nil {
			return &ValidationError{Name: "business_id", err: fmt.Errorf(`ent: validator failed for field "Chat.business_id": %w`, err)}
		}
	}
	if v, ok := cuo.mutation.FromUserId(); ok {
		if err := chat.FromUserIdValidator(v); err != nil {
			return &ValidationError{Name: "fromUserId", err: fmt.Errorf(`ent: validator failed for field "Chat.fromUserId": %w`, err)}
		}
	}
	if v, ok := cuo.mutation.SourceType(); ok {
		if err := chat.SourceTypeValidator(v); err != nil {
			return &ValidationError{Name: "sourceType", err: fmt.Errorf(`ent: validator failed for field "Chat.sourceType": %w`, err)}
		}
	}
	if v, ok := cuo.mutation.ContentType(); ok {
		if err := chat.ContentTypeValidator(v); err != nil {
			return &ValidationError{Name: "contentType", err: fmt.Errorf(`ent: validator failed for field "Chat.contentType": %w`, err)}
		}
	}
	return nil
}

func (cuo *ChatUpdateOne) sqlSave(ctx context.Context) (_node *Chat, err error) {
	if err := cuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(chat.Table, chat.Columns, sqlgraph.NewFieldSpec(chat.FieldID, field.TypeInt64))
	id, ok := cuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "Chat.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := cuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, chat.FieldID)
		for _, f := range fields {
			if !chat.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != chat.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := cuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := cuo.mutation.UpdateTime(); ok {
		_spec.SetField(chat.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := cuo.mutation.DeleteTime(); ok {
		_spec.SetField(chat.FieldDeleteTime, field.TypeTime, value)
	}
	if cuo.mutation.DeleteTimeCleared() {
		_spec.ClearField(chat.FieldDeleteTime, field.TypeTime)
	}
	if value, ok := cuo.mutation.BusinessType(); ok {
		_spec.SetField(chat.FieldBusinessType, field.TypeEnum, value)
	}
	if value, ok := cuo.mutation.BusinessID(); ok {
		_spec.SetField(chat.FieldBusinessID, field.TypeString, value)
	}
	if value, ok := cuo.mutation.FromUserId(); ok {
		_spec.SetField(chat.FieldFromUserId, field.TypeString, value)
	}
	if value, ok := cuo.mutation.SourceType(); ok {
		_spec.SetField(chat.FieldSourceType, field.TypeEnum, value)
	}
	if value, ok := cuo.mutation.ContentType(); ok {
		_spec.SetField(chat.FieldContentType, field.TypeEnum, value)
	}
	if value, ok := cuo.mutation.Content(); ok {
		_spec.SetField(chat.FieldContent, field.TypeString, value)
	}
	_node = &Chat{config: cuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, cuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{chat.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	cuo.mutation.done = true
	return _node, nil
}
