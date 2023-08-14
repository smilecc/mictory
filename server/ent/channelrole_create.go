// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"fmt"
	"server/ent/channelrole"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
)

// ChannelRoleCreate is the builder for creating a ChannelRole entity.
type ChannelRoleCreate struct {
	config
	mutation *ChannelRoleMutation
	hooks    []Hook
}

// Mutation returns the ChannelRoleMutation object of the builder.
func (crc *ChannelRoleCreate) Mutation() *ChannelRoleMutation {
	return crc.mutation
}

// Save creates the ChannelRole in the database.
func (crc *ChannelRoleCreate) Save(ctx context.Context) (*ChannelRole, error) {
	return withHooks(ctx, crc.sqlSave, crc.mutation, crc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (crc *ChannelRoleCreate) SaveX(ctx context.Context) *ChannelRole {
	v, err := crc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (crc *ChannelRoleCreate) Exec(ctx context.Context) error {
	_, err := crc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (crc *ChannelRoleCreate) ExecX(ctx context.Context) {
	if err := crc.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (crc *ChannelRoleCreate) check() error {
	return nil
}

func (crc *ChannelRoleCreate) sqlSave(ctx context.Context) (*ChannelRole, error) {
	if err := crc.check(); err != nil {
		return nil, err
	}
	_node, _spec := crc.createSpec()
	if err := sqlgraph.CreateNode(ctx, crc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	crc.mutation.id = &_node.ID
	crc.mutation.done = true
	return _node, nil
}

func (crc *ChannelRoleCreate) createSpec() (*ChannelRole, *sqlgraph.CreateSpec) {
	var (
		_node = &ChannelRole{config: crc.config}
		_spec = sqlgraph.NewCreateSpec(channelrole.Table, sqlgraph.NewFieldSpec(channelrole.FieldID, field.TypeInt))
	)
	return _node, _spec
}

// ChannelRoleCreateBulk is the builder for creating many ChannelRole entities in bulk.
type ChannelRoleCreateBulk struct {
	config
	builders []*ChannelRoleCreate
}

// Save creates the ChannelRole entities in the database.
func (crcb *ChannelRoleCreateBulk) Save(ctx context.Context) ([]*ChannelRole, error) {
	specs := make([]*sqlgraph.CreateSpec, len(crcb.builders))
	nodes := make([]*ChannelRole, len(crcb.builders))
	mutators := make([]Mutator, len(crcb.builders))
	for i := range crcb.builders {
		func(i int, root context.Context) {
			builder := crcb.builders[i]
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*ChannelRoleMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				var err error
				nodes[i], specs[i] = builder.createSpec()
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, crcb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, crcb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				if specs[i].ID.Value != nil {
					id := specs[i].ID.Value.(int64)
					nodes[i].ID = int(id)
				}
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, crcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (crcb *ChannelRoleCreateBulk) SaveX(ctx context.Context) []*ChannelRole {
	v, err := crcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (crcb *ChannelRoleCreateBulk) Exec(ctx context.Context) error {
	_, err := crcb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (crcb *ChannelRoleCreateBulk) ExecX(ctx context.Context) {
	if err := crcb.Exec(ctx); err != nil {
		panic(err)
	}
}
