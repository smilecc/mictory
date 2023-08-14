// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"server/ent/channel"
	"server/ent/predicate"
	"server/ent/user"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
)

// UserUpdate is the builder for updating User entities.
type UserUpdate struct {
	config
	hooks    []Hook
	mutation *UserMutation
}

// Where appends a list predicates to the UserUpdate builder.
func (uu *UserUpdate) Where(ps ...predicate.User) *UserUpdate {
	uu.mutation.Where(ps...)
	return uu
}

// SetUpdateTime sets the "update_time" field.
func (uu *UserUpdate) SetUpdateTime(t time.Time) *UserUpdate {
	uu.mutation.SetUpdateTime(t)
	return uu
}

// SetDeleteTime sets the "delete_time" field.
func (uu *UserUpdate) SetDeleteTime(t time.Time) *UserUpdate {
	uu.mutation.SetDeleteTime(t)
	return uu
}

// SetNillableDeleteTime sets the "delete_time" field if the given value is not nil.
func (uu *UserUpdate) SetNillableDeleteTime(t *time.Time) *UserUpdate {
	if t != nil {
		uu.SetDeleteTime(*t)
	}
	return uu
}

// ClearDeleteTime clears the value of the "delete_time" field.
func (uu *UserUpdate) ClearDeleteTime() *UserUpdate {
	uu.mutation.ClearDeleteTime()
	return uu
}

// SetUsername sets the "username" field.
func (uu *UserUpdate) SetUsername(s string) *UserUpdate {
	uu.mutation.SetUsername(s)
	return uu
}

// SetNickname sets the "nickname" field.
func (uu *UserUpdate) SetNickname(s string) *UserUpdate {
	uu.mutation.SetNickname(s)
	return uu
}

// SetNicknameNo sets the "nickname_no" field.
func (uu *UserUpdate) SetNicknameNo(i int) *UserUpdate {
	uu.mutation.ResetNicknameNo()
	uu.mutation.SetNicknameNo(i)
	return uu
}

// AddNicknameNo adds i to the "nickname_no" field.
func (uu *UserUpdate) AddNicknameNo(i int) *UserUpdate {
	uu.mutation.AddNicknameNo(i)
	return uu
}

// SetAvatar sets the "avatar" field.
func (uu *UserUpdate) SetAvatar(s string) *UserUpdate {
	uu.mutation.SetAvatar(s)
	return uu
}

// SetNillableAvatar sets the "avatar" field if the given value is not nil.
func (uu *UserUpdate) SetNillableAvatar(s *string) *UserUpdate {
	if s != nil {
		uu.SetAvatar(*s)
	}
	return uu
}

// ClearAvatar clears the value of the "avatar" field.
func (uu *UserUpdate) ClearAvatar() *UserUpdate {
	uu.mutation.ClearAvatar()
	return uu
}

// SetSessionState sets the "session_state" field.
func (uu *UserUpdate) SetSessionState(us user.SessionState) *UserUpdate {
	uu.mutation.SetSessionState(us)
	return uu
}

// SetNillableSessionState sets the "session_state" field if the given value is not nil.
func (uu *UserUpdate) SetNillableSessionState(us *user.SessionState) *UserUpdate {
	if us != nil {
		uu.SetSessionState(*us)
	}
	return uu
}

// SetPassword sets the "password" field.
func (uu *UserUpdate) SetPassword(s string) *UserUpdate {
	uu.mutation.SetPassword(s)
	return uu
}

// SetPasswordSalt sets the "password_salt" field.
func (uu *UserUpdate) SetPasswordSalt(s string) *UserUpdate {
	uu.mutation.SetPasswordSalt(s)
	return uu
}

// AddOwnerIDs adds the "owner" edge to the Channel entity by IDs.
func (uu *UserUpdate) AddOwnerIDs(ids ...int64) *UserUpdate {
	uu.mutation.AddOwnerIDs(ids...)
	return uu
}

// AddOwner adds the "owner" edges to the Channel entity.
func (uu *UserUpdate) AddOwner(c ...*Channel) *UserUpdate {
	ids := make([]int64, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return uu.AddOwnerIDs(ids...)
}

// Mutation returns the UserMutation object of the builder.
func (uu *UserUpdate) Mutation() *UserMutation {
	return uu.mutation
}

// ClearOwner clears all "owner" edges to the Channel entity.
func (uu *UserUpdate) ClearOwner() *UserUpdate {
	uu.mutation.ClearOwner()
	return uu
}

// RemoveOwnerIDs removes the "owner" edge to Channel entities by IDs.
func (uu *UserUpdate) RemoveOwnerIDs(ids ...int64) *UserUpdate {
	uu.mutation.RemoveOwnerIDs(ids...)
	return uu
}

// RemoveOwner removes "owner" edges to Channel entities.
func (uu *UserUpdate) RemoveOwner(c ...*Channel) *UserUpdate {
	ids := make([]int64, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return uu.RemoveOwnerIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (uu *UserUpdate) Save(ctx context.Context) (int, error) {
	if err := uu.defaults(); err != nil {
		return 0, err
	}
	return withHooks(ctx, uu.sqlSave, uu.mutation, uu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (uu *UserUpdate) SaveX(ctx context.Context) int {
	affected, err := uu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (uu *UserUpdate) Exec(ctx context.Context) error {
	_, err := uu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (uu *UserUpdate) ExecX(ctx context.Context) {
	if err := uu.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (uu *UserUpdate) defaults() error {
	if _, ok := uu.mutation.UpdateTime(); !ok {
		if user.UpdateDefaultUpdateTime == nil {
			return fmt.Errorf("ent: uninitialized user.UpdateDefaultUpdateTime (forgotten import ent/runtime?)")
		}
		v := user.UpdateDefaultUpdateTime()
		uu.mutation.SetUpdateTime(v)
	}
	return nil
}

// check runs all checks and user-defined validators on the builder.
func (uu *UserUpdate) check() error {
	if v, ok := uu.mutation.Username(); ok {
		if err := user.UsernameValidator(v); err != nil {
			return &ValidationError{Name: "username", err: fmt.Errorf(`ent: validator failed for field "User.username": %w`, err)}
		}
	}
	if v, ok := uu.mutation.Nickname(); ok {
		if err := user.NicknameValidator(v); err != nil {
			return &ValidationError{Name: "nickname", err: fmt.Errorf(`ent: validator failed for field "User.nickname": %w`, err)}
		}
	}
	if v, ok := uu.mutation.Avatar(); ok {
		if err := user.AvatarValidator(v); err != nil {
			return &ValidationError{Name: "avatar", err: fmt.Errorf(`ent: validator failed for field "User.avatar": %w`, err)}
		}
	}
	if v, ok := uu.mutation.SessionState(); ok {
		if err := user.SessionStateValidator(v); err != nil {
			return &ValidationError{Name: "session_state", err: fmt.Errorf(`ent: validator failed for field "User.session_state": %w`, err)}
		}
	}
	if v, ok := uu.mutation.Password(); ok {
		if err := user.PasswordValidator(v); err != nil {
			return &ValidationError{Name: "password", err: fmt.Errorf(`ent: validator failed for field "User.password": %w`, err)}
		}
	}
	if v, ok := uu.mutation.PasswordSalt(); ok {
		if err := user.PasswordSaltValidator(v); err != nil {
			return &ValidationError{Name: "password_salt", err: fmt.Errorf(`ent: validator failed for field "User.password_salt": %w`, err)}
		}
	}
	return nil
}

func (uu *UserUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := uu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(user.Table, user.Columns, sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt64))
	if ps := uu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := uu.mutation.UpdateTime(); ok {
		_spec.SetField(user.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := uu.mutation.DeleteTime(); ok {
		_spec.SetField(user.FieldDeleteTime, field.TypeTime, value)
	}
	if uu.mutation.DeleteTimeCleared() {
		_spec.ClearField(user.FieldDeleteTime, field.TypeTime)
	}
	if value, ok := uu.mutation.Username(); ok {
		_spec.SetField(user.FieldUsername, field.TypeString, value)
	}
	if value, ok := uu.mutation.Nickname(); ok {
		_spec.SetField(user.FieldNickname, field.TypeString, value)
	}
	if value, ok := uu.mutation.NicknameNo(); ok {
		_spec.SetField(user.FieldNicknameNo, field.TypeInt, value)
	}
	if value, ok := uu.mutation.AddedNicknameNo(); ok {
		_spec.AddField(user.FieldNicknameNo, field.TypeInt, value)
	}
	if value, ok := uu.mutation.Avatar(); ok {
		_spec.SetField(user.FieldAvatar, field.TypeString, value)
	}
	if uu.mutation.AvatarCleared() {
		_spec.ClearField(user.FieldAvatar, field.TypeString)
	}
	if value, ok := uu.mutation.SessionState(); ok {
		_spec.SetField(user.FieldSessionState, field.TypeEnum, value)
	}
	if value, ok := uu.mutation.Password(); ok {
		_spec.SetField(user.FieldPassword, field.TypeString, value)
	}
	if value, ok := uu.mutation.PasswordSalt(); ok {
		_spec.SetField(user.FieldPasswordSalt, field.TypeString, value)
	}
	if uu.mutation.OwnerCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   user.OwnerTable,
			Columns: []string{user.OwnerColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(channel.FieldID, field.TypeInt64),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := uu.mutation.RemovedOwnerIDs(); len(nodes) > 0 && !uu.mutation.OwnerCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   user.OwnerTable,
			Columns: []string{user.OwnerColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(channel.FieldID, field.TypeInt64),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := uu.mutation.OwnerIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   user.OwnerTable,
			Columns: []string{user.OwnerColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(channel.FieldID, field.TypeInt64),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, uu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{user.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	uu.mutation.done = true
	return n, nil
}

// UserUpdateOne is the builder for updating a single User entity.
type UserUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *UserMutation
}

// SetUpdateTime sets the "update_time" field.
func (uuo *UserUpdateOne) SetUpdateTime(t time.Time) *UserUpdateOne {
	uuo.mutation.SetUpdateTime(t)
	return uuo
}

// SetDeleteTime sets the "delete_time" field.
func (uuo *UserUpdateOne) SetDeleteTime(t time.Time) *UserUpdateOne {
	uuo.mutation.SetDeleteTime(t)
	return uuo
}

// SetNillableDeleteTime sets the "delete_time" field if the given value is not nil.
func (uuo *UserUpdateOne) SetNillableDeleteTime(t *time.Time) *UserUpdateOne {
	if t != nil {
		uuo.SetDeleteTime(*t)
	}
	return uuo
}

// ClearDeleteTime clears the value of the "delete_time" field.
func (uuo *UserUpdateOne) ClearDeleteTime() *UserUpdateOne {
	uuo.mutation.ClearDeleteTime()
	return uuo
}

// SetUsername sets the "username" field.
func (uuo *UserUpdateOne) SetUsername(s string) *UserUpdateOne {
	uuo.mutation.SetUsername(s)
	return uuo
}

// SetNickname sets the "nickname" field.
func (uuo *UserUpdateOne) SetNickname(s string) *UserUpdateOne {
	uuo.mutation.SetNickname(s)
	return uuo
}

// SetNicknameNo sets the "nickname_no" field.
func (uuo *UserUpdateOne) SetNicknameNo(i int) *UserUpdateOne {
	uuo.mutation.ResetNicknameNo()
	uuo.mutation.SetNicknameNo(i)
	return uuo
}

// AddNicknameNo adds i to the "nickname_no" field.
func (uuo *UserUpdateOne) AddNicknameNo(i int) *UserUpdateOne {
	uuo.mutation.AddNicknameNo(i)
	return uuo
}

// SetAvatar sets the "avatar" field.
func (uuo *UserUpdateOne) SetAvatar(s string) *UserUpdateOne {
	uuo.mutation.SetAvatar(s)
	return uuo
}

// SetNillableAvatar sets the "avatar" field if the given value is not nil.
func (uuo *UserUpdateOne) SetNillableAvatar(s *string) *UserUpdateOne {
	if s != nil {
		uuo.SetAvatar(*s)
	}
	return uuo
}

// ClearAvatar clears the value of the "avatar" field.
func (uuo *UserUpdateOne) ClearAvatar() *UserUpdateOne {
	uuo.mutation.ClearAvatar()
	return uuo
}

// SetSessionState sets the "session_state" field.
func (uuo *UserUpdateOne) SetSessionState(us user.SessionState) *UserUpdateOne {
	uuo.mutation.SetSessionState(us)
	return uuo
}

// SetNillableSessionState sets the "session_state" field if the given value is not nil.
func (uuo *UserUpdateOne) SetNillableSessionState(us *user.SessionState) *UserUpdateOne {
	if us != nil {
		uuo.SetSessionState(*us)
	}
	return uuo
}

// SetPassword sets the "password" field.
func (uuo *UserUpdateOne) SetPassword(s string) *UserUpdateOne {
	uuo.mutation.SetPassword(s)
	return uuo
}

// SetPasswordSalt sets the "password_salt" field.
func (uuo *UserUpdateOne) SetPasswordSalt(s string) *UserUpdateOne {
	uuo.mutation.SetPasswordSalt(s)
	return uuo
}

// AddOwnerIDs adds the "owner" edge to the Channel entity by IDs.
func (uuo *UserUpdateOne) AddOwnerIDs(ids ...int64) *UserUpdateOne {
	uuo.mutation.AddOwnerIDs(ids...)
	return uuo
}

// AddOwner adds the "owner" edges to the Channel entity.
func (uuo *UserUpdateOne) AddOwner(c ...*Channel) *UserUpdateOne {
	ids := make([]int64, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return uuo.AddOwnerIDs(ids...)
}

// Mutation returns the UserMutation object of the builder.
func (uuo *UserUpdateOne) Mutation() *UserMutation {
	return uuo.mutation
}

// ClearOwner clears all "owner" edges to the Channel entity.
func (uuo *UserUpdateOne) ClearOwner() *UserUpdateOne {
	uuo.mutation.ClearOwner()
	return uuo
}

// RemoveOwnerIDs removes the "owner" edge to Channel entities by IDs.
func (uuo *UserUpdateOne) RemoveOwnerIDs(ids ...int64) *UserUpdateOne {
	uuo.mutation.RemoveOwnerIDs(ids...)
	return uuo
}

// RemoveOwner removes "owner" edges to Channel entities.
func (uuo *UserUpdateOne) RemoveOwner(c ...*Channel) *UserUpdateOne {
	ids := make([]int64, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return uuo.RemoveOwnerIDs(ids...)
}

// Where appends a list predicates to the UserUpdate builder.
func (uuo *UserUpdateOne) Where(ps ...predicate.User) *UserUpdateOne {
	uuo.mutation.Where(ps...)
	return uuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (uuo *UserUpdateOne) Select(field string, fields ...string) *UserUpdateOne {
	uuo.fields = append([]string{field}, fields...)
	return uuo
}

// Save executes the query and returns the updated User entity.
func (uuo *UserUpdateOne) Save(ctx context.Context) (*User, error) {
	if err := uuo.defaults(); err != nil {
		return nil, err
	}
	return withHooks(ctx, uuo.sqlSave, uuo.mutation, uuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (uuo *UserUpdateOne) SaveX(ctx context.Context) *User {
	node, err := uuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (uuo *UserUpdateOne) Exec(ctx context.Context) error {
	_, err := uuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (uuo *UserUpdateOne) ExecX(ctx context.Context) {
	if err := uuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (uuo *UserUpdateOne) defaults() error {
	if _, ok := uuo.mutation.UpdateTime(); !ok {
		if user.UpdateDefaultUpdateTime == nil {
			return fmt.Errorf("ent: uninitialized user.UpdateDefaultUpdateTime (forgotten import ent/runtime?)")
		}
		v := user.UpdateDefaultUpdateTime()
		uuo.mutation.SetUpdateTime(v)
	}
	return nil
}

// check runs all checks and user-defined validators on the builder.
func (uuo *UserUpdateOne) check() error {
	if v, ok := uuo.mutation.Username(); ok {
		if err := user.UsernameValidator(v); err != nil {
			return &ValidationError{Name: "username", err: fmt.Errorf(`ent: validator failed for field "User.username": %w`, err)}
		}
	}
	if v, ok := uuo.mutation.Nickname(); ok {
		if err := user.NicknameValidator(v); err != nil {
			return &ValidationError{Name: "nickname", err: fmt.Errorf(`ent: validator failed for field "User.nickname": %w`, err)}
		}
	}
	if v, ok := uuo.mutation.Avatar(); ok {
		if err := user.AvatarValidator(v); err != nil {
			return &ValidationError{Name: "avatar", err: fmt.Errorf(`ent: validator failed for field "User.avatar": %w`, err)}
		}
	}
	if v, ok := uuo.mutation.SessionState(); ok {
		if err := user.SessionStateValidator(v); err != nil {
			return &ValidationError{Name: "session_state", err: fmt.Errorf(`ent: validator failed for field "User.session_state": %w`, err)}
		}
	}
	if v, ok := uuo.mutation.Password(); ok {
		if err := user.PasswordValidator(v); err != nil {
			return &ValidationError{Name: "password", err: fmt.Errorf(`ent: validator failed for field "User.password": %w`, err)}
		}
	}
	if v, ok := uuo.mutation.PasswordSalt(); ok {
		if err := user.PasswordSaltValidator(v); err != nil {
			return &ValidationError{Name: "password_salt", err: fmt.Errorf(`ent: validator failed for field "User.password_salt": %w`, err)}
		}
	}
	return nil
}

func (uuo *UserUpdateOne) sqlSave(ctx context.Context) (_node *User, err error) {
	if err := uuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(user.Table, user.Columns, sqlgraph.NewFieldSpec(user.FieldID, field.TypeInt64))
	id, ok := uuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "User.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := uuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, user.FieldID)
		for _, f := range fields {
			if !user.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != user.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := uuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := uuo.mutation.UpdateTime(); ok {
		_spec.SetField(user.FieldUpdateTime, field.TypeTime, value)
	}
	if value, ok := uuo.mutation.DeleteTime(); ok {
		_spec.SetField(user.FieldDeleteTime, field.TypeTime, value)
	}
	if uuo.mutation.DeleteTimeCleared() {
		_spec.ClearField(user.FieldDeleteTime, field.TypeTime)
	}
	if value, ok := uuo.mutation.Username(); ok {
		_spec.SetField(user.FieldUsername, field.TypeString, value)
	}
	if value, ok := uuo.mutation.Nickname(); ok {
		_spec.SetField(user.FieldNickname, field.TypeString, value)
	}
	if value, ok := uuo.mutation.NicknameNo(); ok {
		_spec.SetField(user.FieldNicknameNo, field.TypeInt, value)
	}
	if value, ok := uuo.mutation.AddedNicknameNo(); ok {
		_spec.AddField(user.FieldNicknameNo, field.TypeInt, value)
	}
	if value, ok := uuo.mutation.Avatar(); ok {
		_spec.SetField(user.FieldAvatar, field.TypeString, value)
	}
	if uuo.mutation.AvatarCleared() {
		_spec.ClearField(user.FieldAvatar, field.TypeString)
	}
	if value, ok := uuo.mutation.SessionState(); ok {
		_spec.SetField(user.FieldSessionState, field.TypeEnum, value)
	}
	if value, ok := uuo.mutation.Password(); ok {
		_spec.SetField(user.FieldPassword, field.TypeString, value)
	}
	if value, ok := uuo.mutation.PasswordSalt(); ok {
		_spec.SetField(user.FieldPasswordSalt, field.TypeString, value)
	}
	if uuo.mutation.OwnerCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   user.OwnerTable,
			Columns: []string{user.OwnerColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(channel.FieldID, field.TypeInt64),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := uuo.mutation.RemovedOwnerIDs(); len(nodes) > 0 && !uuo.mutation.OwnerCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   user.OwnerTable,
			Columns: []string{user.OwnerColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(channel.FieldID, field.TypeInt64),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := uuo.mutation.OwnerIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   user.OwnerTable,
			Columns: []string{user.OwnerColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(channel.FieldID, field.TypeInt64),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &User{config: uuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, uuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{user.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	uuo.mutation.done = true
	return _node, nil
}
