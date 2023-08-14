// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"log"

	"server/ent/migrate"

	"server/ent/channel"
	"server/ent/channelrole"
	"server/ent/chat"
	"server/ent/room"
	"server/ent/user"
	"server/ent/usernickname"

	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
)

// Client is the client that holds all ent builders.
type Client struct {
	config
	// Schema is the client for creating, migrating and dropping schema.
	Schema *migrate.Schema
	// Channel is the client for interacting with the Channel builders.
	Channel *ChannelClient
	// ChannelRole is the client for interacting with the ChannelRole builders.
	ChannelRole *ChannelRoleClient
	// Chat is the client for interacting with the Chat builders.
	Chat *ChatClient
	// Room is the client for interacting with the Room builders.
	Room *RoomClient
	// User is the client for interacting with the User builders.
	User *UserClient
	// UserNickname is the client for interacting with the UserNickname builders.
	UserNickname *UserNicknameClient
}

// NewClient creates a new client configured with the given options.
func NewClient(opts ...Option) *Client {
	cfg := config{log: log.Println, hooks: &hooks{}, inters: &inters{}}
	cfg.options(opts...)
	client := &Client{config: cfg}
	client.init()
	return client
}

func (c *Client) init() {
	c.Schema = migrate.NewSchema(c.driver)
	c.Channel = NewChannelClient(c.config)
	c.ChannelRole = NewChannelRoleClient(c.config)
	c.Chat = NewChatClient(c.config)
	c.Room = NewRoomClient(c.config)
	c.User = NewUserClient(c.config)
	c.UserNickname = NewUserNicknameClient(c.config)
}

type (
	// config is the configuration for the client and its builder.
	config struct {
		// driver used for executing database requests.
		driver dialect.Driver
		// debug enable a debug logging.
		debug bool
		// log used for logging on debug mode.
		log func(...any)
		// hooks to execute on mutations.
		hooks *hooks
		// interceptors to execute on queries.
		inters *inters
	}
	// Option function to configure the client.
	Option func(*config)
)

// options applies the options on the config object.
func (c *config) options(opts ...Option) {
	for _, opt := range opts {
		opt(c)
	}
	if c.debug {
		c.driver = dialect.Debug(c.driver, c.log)
	}
}

// Debug enables debug logging on the ent.Driver.
func Debug() Option {
	return func(c *config) {
		c.debug = true
	}
}

// Log sets the logging function for debug mode.
func Log(fn func(...any)) Option {
	return func(c *config) {
		c.log = fn
	}
}

// Driver configures the client driver.
func Driver(driver dialect.Driver) Option {
	return func(c *config) {
		c.driver = driver
	}
}

// Open opens a database/sql.DB specified by the driver name and
// the data source name, and returns a new client attached to it.
// Optional parameters can be added for configuring the client.
func Open(driverName, dataSourceName string, options ...Option) (*Client, error) {
	switch driverName {
	case dialect.MySQL, dialect.Postgres, dialect.SQLite:
		drv, err := sql.Open(driverName, dataSourceName)
		if err != nil {
			return nil, err
		}
		return NewClient(append(options, Driver(drv))...), nil
	default:
		return nil, fmt.Errorf("unsupported driver: %q", driverName)
	}
}

// Tx returns a new transactional client. The provided context
// is used until the transaction is committed or rolled back.
func (c *Client) Tx(ctx context.Context) (*Tx, error) {
	if _, ok := c.driver.(*txDriver); ok {
		return nil, errors.New("ent: cannot start a transaction within a transaction")
	}
	tx, err := newTx(ctx, c.driver)
	if err != nil {
		return nil, fmt.Errorf("ent: starting a transaction: %w", err)
	}
	cfg := c.config
	cfg.driver = tx
	return &Tx{
		ctx:          ctx,
		config:       cfg,
		Channel:      NewChannelClient(cfg),
		ChannelRole:  NewChannelRoleClient(cfg),
		Chat:         NewChatClient(cfg),
		Room:         NewRoomClient(cfg),
		User:         NewUserClient(cfg),
		UserNickname: NewUserNicknameClient(cfg),
	}, nil
}

// BeginTx returns a transactional client with specified options.
func (c *Client) BeginTx(ctx context.Context, opts *sql.TxOptions) (*Tx, error) {
	if _, ok := c.driver.(*txDriver); ok {
		return nil, errors.New("ent: cannot start a transaction within a transaction")
	}
	tx, err := c.driver.(interface {
		BeginTx(context.Context, *sql.TxOptions) (dialect.Tx, error)
	}).BeginTx(ctx, opts)
	if err != nil {
		return nil, fmt.Errorf("ent: starting a transaction: %w", err)
	}
	cfg := c.config
	cfg.driver = &txDriver{tx: tx, drv: c.driver}
	return &Tx{
		ctx:          ctx,
		config:       cfg,
		Channel:      NewChannelClient(cfg),
		ChannelRole:  NewChannelRoleClient(cfg),
		Chat:         NewChatClient(cfg),
		Room:         NewRoomClient(cfg),
		User:         NewUserClient(cfg),
		UserNickname: NewUserNicknameClient(cfg),
	}, nil
}

// Debug returns a new debug-client. It's used to get verbose logging on specific operations.
//
//	client.Debug().
//		Channel.
//		Query().
//		Count(ctx)
func (c *Client) Debug() *Client {
	if c.debug {
		return c
	}
	cfg := c.config
	cfg.driver = dialect.Debug(c.driver, c.log)
	client := &Client{config: cfg}
	client.init()
	return client
}

// Close closes the database connection and prevents new queries from starting.
func (c *Client) Close() error {
	return c.driver.Close()
}

// Use adds the mutation hooks to all the entity clients.
// In order to add hooks to a specific client, call: `client.Node.Use(...)`.
func (c *Client) Use(hooks ...Hook) {
	for _, n := range []interface{ Use(...Hook) }{
		c.Channel, c.ChannelRole, c.Chat, c.Room, c.User, c.UserNickname,
	} {
		n.Use(hooks...)
	}
}

// Intercept adds the query interceptors to all the entity clients.
// In order to add interceptors to a specific client, call: `client.Node.Intercept(...)`.
func (c *Client) Intercept(interceptors ...Interceptor) {
	for _, n := range []interface{ Intercept(...Interceptor) }{
		c.Channel, c.ChannelRole, c.Chat, c.Room, c.User, c.UserNickname,
	} {
		n.Intercept(interceptors...)
	}
}

// Mutate implements the ent.Mutator interface.
func (c *Client) Mutate(ctx context.Context, m Mutation) (Value, error) {
	switch m := m.(type) {
	case *ChannelMutation:
		return c.Channel.mutate(ctx, m)
	case *ChannelRoleMutation:
		return c.ChannelRole.mutate(ctx, m)
	case *ChatMutation:
		return c.Chat.mutate(ctx, m)
	case *RoomMutation:
		return c.Room.mutate(ctx, m)
	case *UserMutation:
		return c.User.mutate(ctx, m)
	case *UserNicknameMutation:
		return c.UserNickname.mutate(ctx, m)
	default:
		return nil, fmt.Errorf("ent: unknown mutation type %T", m)
	}
}

// ChannelClient is a client for the Channel schema.
type ChannelClient struct {
	config
}

// NewChannelClient returns a client for the Channel from the given config.
func NewChannelClient(c config) *ChannelClient {
	return &ChannelClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `channel.Hooks(f(g(h())))`.
func (c *ChannelClient) Use(hooks ...Hook) {
	c.hooks.Channel = append(c.hooks.Channel, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `channel.Intercept(f(g(h())))`.
func (c *ChannelClient) Intercept(interceptors ...Interceptor) {
	c.inters.Channel = append(c.inters.Channel, interceptors...)
}

// Create returns a builder for creating a Channel entity.
func (c *ChannelClient) Create() *ChannelCreate {
	mutation := newChannelMutation(c.config, OpCreate)
	return &ChannelCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of Channel entities.
func (c *ChannelClient) CreateBulk(builders ...*ChannelCreate) *ChannelCreateBulk {
	return &ChannelCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for Channel.
func (c *ChannelClient) Update() *ChannelUpdate {
	mutation := newChannelMutation(c.config, OpUpdate)
	return &ChannelUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *ChannelClient) UpdateOne(ch *Channel) *ChannelUpdateOne {
	mutation := newChannelMutation(c.config, OpUpdateOne, withChannel(ch))
	return &ChannelUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *ChannelClient) UpdateOneID(id int64) *ChannelUpdateOne {
	mutation := newChannelMutation(c.config, OpUpdateOne, withChannelID(id))
	return &ChannelUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for Channel.
func (c *ChannelClient) Delete() *ChannelDelete {
	mutation := newChannelMutation(c.config, OpDelete)
	return &ChannelDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *ChannelClient) DeleteOne(ch *Channel) *ChannelDeleteOne {
	return c.DeleteOneID(ch.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *ChannelClient) DeleteOneID(id int64) *ChannelDeleteOne {
	builder := c.Delete().Where(channel.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &ChannelDeleteOne{builder}
}

// Query returns a query builder for Channel.
func (c *ChannelClient) Query() *ChannelQuery {
	return &ChannelQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeChannel},
		inters: c.Interceptors(),
	}
}

// Get returns a Channel entity by its id.
func (c *ChannelClient) Get(ctx context.Context, id int64) (*Channel, error) {
	return c.Query().Where(channel.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *ChannelClient) GetX(ctx context.Context, id int64) *Channel {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryRooms queries the rooms edge of a Channel.
func (c *ChannelClient) QueryRooms(ch *Channel) *RoomQuery {
	query := (&RoomClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := ch.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(channel.Table, channel.FieldID, id),
			sqlgraph.To(room.Table, room.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, channel.RoomsTable, channel.RoomsColumn),
		)
		fromV = sqlgraph.Neighbors(ch.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// QueryOwnerUser queries the owner_user edge of a Channel.
func (c *ChannelClient) QueryOwnerUser(ch *Channel) *UserQuery {
	query := (&UserClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := ch.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(channel.Table, channel.FieldID, id),
			sqlgraph.To(user.Table, user.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, channel.OwnerUserTable, channel.OwnerUserColumn),
		)
		fromV = sqlgraph.Neighbors(ch.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *ChannelClient) Hooks() []Hook {
	hooks := c.hooks.Channel
	return append(hooks[:len(hooks):len(hooks)], channel.Hooks[:]...)
}

// Interceptors returns the client interceptors.
func (c *ChannelClient) Interceptors() []Interceptor {
	inters := c.inters.Channel
	return append(inters[:len(inters):len(inters)], channel.Interceptors[:]...)
}

func (c *ChannelClient) mutate(ctx context.Context, m *ChannelMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&ChannelCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&ChannelUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&ChannelUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&ChannelDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown Channel mutation op: %q", m.Op())
	}
}

// ChannelRoleClient is a client for the ChannelRole schema.
type ChannelRoleClient struct {
	config
}

// NewChannelRoleClient returns a client for the ChannelRole from the given config.
func NewChannelRoleClient(c config) *ChannelRoleClient {
	return &ChannelRoleClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `channelrole.Hooks(f(g(h())))`.
func (c *ChannelRoleClient) Use(hooks ...Hook) {
	c.hooks.ChannelRole = append(c.hooks.ChannelRole, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `channelrole.Intercept(f(g(h())))`.
func (c *ChannelRoleClient) Intercept(interceptors ...Interceptor) {
	c.inters.ChannelRole = append(c.inters.ChannelRole, interceptors...)
}

// Create returns a builder for creating a ChannelRole entity.
func (c *ChannelRoleClient) Create() *ChannelRoleCreate {
	mutation := newChannelRoleMutation(c.config, OpCreate)
	return &ChannelRoleCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of ChannelRole entities.
func (c *ChannelRoleClient) CreateBulk(builders ...*ChannelRoleCreate) *ChannelRoleCreateBulk {
	return &ChannelRoleCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for ChannelRole.
func (c *ChannelRoleClient) Update() *ChannelRoleUpdate {
	mutation := newChannelRoleMutation(c.config, OpUpdate)
	return &ChannelRoleUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *ChannelRoleClient) UpdateOne(cr *ChannelRole) *ChannelRoleUpdateOne {
	mutation := newChannelRoleMutation(c.config, OpUpdateOne, withChannelRole(cr))
	return &ChannelRoleUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *ChannelRoleClient) UpdateOneID(id int) *ChannelRoleUpdateOne {
	mutation := newChannelRoleMutation(c.config, OpUpdateOne, withChannelRoleID(id))
	return &ChannelRoleUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for ChannelRole.
func (c *ChannelRoleClient) Delete() *ChannelRoleDelete {
	mutation := newChannelRoleMutation(c.config, OpDelete)
	return &ChannelRoleDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *ChannelRoleClient) DeleteOne(cr *ChannelRole) *ChannelRoleDeleteOne {
	return c.DeleteOneID(cr.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *ChannelRoleClient) DeleteOneID(id int) *ChannelRoleDeleteOne {
	builder := c.Delete().Where(channelrole.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &ChannelRoleDeleteOne{builder}
}

// Query returns a query builder for ChannelRole.
func (c *ChannelRoleClient) Query() *ChannelRoleQuery {
	return &ChannelRoleQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeChannelRole},
		inters: c.Interceptors(),
	}
}

// Get returns a ChannelRole entity by its id.
func (c *ChannelRoleClient) Get(ctx context.Context, id int) (*ChannelRole, error) {
	return c.Query().Where(channelrole.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *ChannelRoleClient) GetX(ctx context.Context, id int) *ChannelRole {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// Hooks returns the client hooks.
func (c *ChannelRoleClient) Hooks() []Hook {
	return c.hooks.ChannelRole
}

// Interceptors returns the client interceptors.
func (c *ChannelRoleClient) Interceptors() []Interceptor {
	return c.inters.ChannelRole
}

func (c *ChannelRoleClient) mutate(ctx context.Context, m *ChannelRoleMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&ChannelRoleCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&ChannelRoleUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&ChannelRoleUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&ChannelRoleDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown ChannelRole mutation op: %q", m.Op())
	}
}

// ChatClient is a client for the Chat schema.
type ChatClient struct {
	config
}

// NewChatClient returns a client for the Chat from the given config.
func NewChatClient(c config) *ChatClient {
	return &ChatClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `chat.Hooks(f(g(h())))`.
func (c *ChatClient) Use(hooks ...Hook) {
	c.hooks.Chat = append(c.hooks.Chat, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `chat.Intercept(f(g(h())))`.
func (c *ChatClient) Intercept(interceptors ...Interceptor) {
	c.inters.Chat = append(c.inters.Chat, interceptors...)
}

// Create returns a builder for creating a Chat entity.
func (c *ChatClient) Create() *ChatCreate {
	mutation := newChatMutation(c.config, OpCreate)
	return &ChatCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of Chat entities.
func (c *ChatClient) CreateBulk(builders ...*ChatCreate) *ChatCreateBulk {
	return &ChatCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for Chat.
func (c *ChatClient) Update() *ChatUpdate {
	mutation := newChatMutation(c.config, OpUpdate)
	return &ChatUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *ChatClient) UpdateOne(ch *Chat) *ChatUpdateOne {
	mutation := newChatMutation(c.config, OpUpdateOne, withChat(ch))
	return &ChatUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *ChatClient) UpdateOneID(id int64) *ChatUpdateOne {
	mutation := newChatMutation(c.config, OpUpdateOne, withChatID(id))
	return &ChatUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for Chat.
func (c *ChatClient) Delete() *ChatDelete {
	mutation := newChatMutation(c.config, OpDelete)
	return &ChatDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *ChatClient) DeleteOne(ch *Chat) *ChatDeleteOne {
	return c.DeleteOneID(ch.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *ChatClient) DeleteOneID(id int64) *ChatDeleteOne {
	builder := c.Delete().Where(chat.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &ChatDeleteOne{builder}
}

// Query returns a query builder for Chat.
func (c *ChatClient) Query() *ChatQuery {
	return &ChatQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeChat},
		inters: c.Interceptors(),
	}
}

// Get returns a Chat entity by its id.
func (c *ChatClient) Get(ctx context.Context, id int64) (*Chat, error) {
	return c.Query().Where(chat.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *ChatClient) GetX(ctx context.Context, id int64) *Chat {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// Hooks returns the client hooks.
func (c *ChatClient) Hooks() []Hook {
	hooks := c.hooks.Chat
	return append(hooks[:len(hooks):len(hooks)], chat.Hooks[:]...)
}

// Interceptors returns the client interceptors.
func (c *ChatClient) Interceptors() []Interceptor {
	inters := c.inters.Chat
	return append(inters[:len(inters):len(inters)], chat.Interceptors[:]...)
}

func (c *ChatClient) mutate(ctx context.Context, m *ChatMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&ChatCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&ChatUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&ChatUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&ChatDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown Chat mutation op: %q", m.Op())
	}
}

// RoomClient is a client for the Room schema.
type RoomClient struct {
	config
}

// NewRoomClient returns a client for the Room from the given config.
func NewRoomClient(c config) *RoomClient {
	return &RoomClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `room.Hooks(f(g(h())))`.
func (c *RoomClient) Use(hooks ...Hook) {
	c.hooks.Room = append(c.hooks.Room, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `room.Intercept(f(g(h())))`.
func (c *RoomClient) Intercept(interceptors ...Interceptor) {
	c.inters.Room = append(c.inters.Room, interceptors...)
}

// Create returns a builder for creating a Room entity.
func (c *RoomClient) Create() *RoomCreate {
	mutation := newRoomMutation(c.config, OpCreate)
	return &RoomCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of Room entities.
func (c *RoomClient) CreateBulk(builders ...*RoomCreate) *RoomCreateBulk {
	return &RoomCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for Room.
func (c *RoomClient) Update() *RoomUpdate {
	mutation := newRoomMutation(c.config, OpUpdate)
	return &RoomUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *RoomClient) UpdateOne(r *Room) *RoomUpdateOne {
	mutation := newRoomMutation(c.config, OpUpdateOne, withRoom(r))
	return &RoomUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *RoomClient) UpdateOneID(id int64) *RoomUpdateOne {
	mutation := newRoomMutation(c.config, OpUpdateOne, withRoomID(id))
	return &RoomUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for Room.
func (c *RoomClient) Delete() *RoomDelete {
	mutation := newRoomMutation(c.config, OpDelete)
	return &RoomDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *RoomClient) DeleteOne(r *Room) *RoomDeleteOne {
	return c.DeleteOneID(r.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *RoomClient) DeleteOneID(id int64) *RoomDeleteOne {
	builder := c.Delete().Where(room.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &RoomDeleteOne{builder}
}

// Query returns a query builder for Room.
func (c *RoomClient) Query() *RoomQuery {
	return &RoomQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeRoom},
		inters: c.Interceptors(),
	}
}

// Get returns a Room entity by its id.
func (c *RoomClient) Get(ctx context.Context, id int64) (*Room, error) {
	return c.Query().Where(room.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *RoomClient) GetX(ctx context.Context, id int64) *Room {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryChannel queries the channel edge of a Room.
func (c *RoomClient) QueryChannel(r *Room) *ChannelQuery {
	query := (&ChannelClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := r.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(room.Table, room.FieldID, id),
			sqlgraph.To(channel.Table, channel.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, room.ChannelTable, room.ChannelColumn),
		)
		fromV = sqlgraph.Neighbors(r.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *RoomClient) Hooks() []Hook {
	hooks := c.hooks.Room
	return append(hooks[:len(hooks):len(hooks)], room.Hooks[:]...)
}

// Interceptors returns the client interceptors.
func (c *RoomClient) Interceptors() []Interceptor {
	inters := c.inters.Room
	return append(inters[:len(inters):len(inters)], room.Interceptors[:]...)
}

func (c *RoomClient) mutate(ctx context.Context, m *RoomMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&RoomCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&RoomUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&RoomUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&RoomDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown Room mutation op: %q", m.Op())
	}
}

// UserClient is a client for the User schema.
type UserClient struct {
	config
}

// NewUserClient returns a client for the User from the given config.
func NewUserClient(c config) *UserClient {
	return &UserClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `user.Hooks(f(g(h())))`.
func (c *UserClient) Use(hooks ...Hook) {
	c.hooks.User = append(c.hooks.User, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `user.Intercept(f(g(h())))`.
func (c *UserClient) Intercept(interceptors ...Interceptor) {
	c.inters.User = append(c.inters.User, interceptors...)
}

// Create returns a builder for creating a User entity.
func (c *UserClient) Create() *UserCreate {
	mutation := newUserMutation(c.config, OpCreate)
	return &UserCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of User entities.
func (c *UserClient) CreateBulk(builders ...*UserCreate) *UserCreateBulk {
	return &UserCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for User.
func (c *UserClient) Update() *UserUpdate {
	mutation := newUserMutation(c.config, OpUpdate)
	return &UserUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *UserClient) UpdateOne(u *User) *UserUpdateOne {
	mutation := newUserMutation(c.config, OpUpdateOne, withUser(u))
	return &UserUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *UserClient) UpdateOneID(id int64) *UserUpdateOne {
	mutation := newUserMutation(c.config, OpUpdateOne, withUserID(id))
	return &UserUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for User.
func (c *UserClient) Delete() *UserDelete {
	mutation := newUserMutation(c.config, OpDelete)
	return &UserDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *UserClient) DeleteOne(u *User) *UserDeleteOne {
	return c.DeleteOneID(u.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *UserClient) DeleteOneID(id int64) *UserDeleteOne {
	builder := c.Delete().Where(user.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &UserDeleteOne{builder}
}

// Query returns a query builder for User.
func (c *UserClient) Query() *UserQuery {
	return &UserQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeUser},
		inters: c.Interceptors(),
	}
}

// Get returns a User entity by its id.
func (c *UserClient) Get(ctx context.Context, id int64) (*User, error) {
	return c.Query().Where(user.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *UserClient) GetX(ctx context.Context, id int64) *User {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// QueryOwner queries the owner edge of a User.
func (c *UserClient) QueryOwner(u *User) *ChannelQuery {
	query := (&ChannelClient{config: c.config}).Query()
	query.path = func(context.Context) (fromV *sql.Selector, _ error) {
		id := u.ID
		step := sqlgraph.NewStep(
			sqlgraph.From(user.Table, user.FieldID, id),
			sqlgraph.To(channel.Table, channel.FieldID),
			sqlgraph.Edge(sqlgraph.O2M, false, user.OwnerTable, user.OwnerColumn),
		)
		fromV = sqlgraph.Neighbors(u.driver.Dialect(), step)
		return fromV, nil
	}
	return query
}

// Hooks returns the client hooks.
func (c *UserClient) Hooks() []Hook {
	hooks := c.hooks.User
	return append(hooks[:len(hooks):len(hooks)], user.Hooks[:]...)
}

// Interceptors returns the client interceptors.
func (c *UserClient) Interceptors() []Interceptor {
	inters := c.inters.User
	return append(inters[:len(inters):len(inters)], user.Interceptors[:]...)
}

func (c *UserClient) mutate(ctx context.Context, m *UserMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&UserCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&UserUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&UserUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&UserDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown User mutation op: %q", m.Op())
	}
}

// UserNicknameClient is a client for the UserNickname schema.
type UserNicknameClient struct {
	config
}

// NewUserNicknameClient returns a client for the UserNickname from the given config.
func NewUserNicknameClient(c config) *UserNicknameClient {
	return &UserNicknameClient{config: c}
}

// Use adds a list of mutation hooks to the hooks stack.
// A call to `Use(f, g, h)` equals to `usernickname.Hooks(f(g(h())))`.
func (c *UserNicknameClient) Use(hooks ...Hook) {
	c.hooks.UserNickname = append(c.hooks.UserNickname, hooks...)
}

// Intercept adds a list of query interceptors to the interceptors stack.
// A call to `Intercept(f, g, h)` equals to `usernickname.Intercept(f(g(h())))`.
func (c *UserNicknameClient) Intercept(interceptors ...Interceptor) {
	c.inters.UserNickname = append(c.inters.UserNickname, interceptors...)
}

// Create returns a builder for creating a UserNickname entity.
func (c *UserNicknameClient) Create() *UserNicknameCreate {
	mutation := newUserNicknameMutation(c.config, OpCreate)
	return &UserNicknameCreate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// CreateBulk returns a builder for creating a bulk of UserNickname entities.
func (c *UserNicknameClient) CreateBulk(builders ...*UserNicknameCreate) *UserNicknameCreateBulk {
	return &UserNicknameCreateBulk{config: c.config, builders: builders}
}

// Update returns an update builder for UserNickname.
func (c *UserNicknameClient) Update() *UserNicknameUpdate {
	mutation := newUserNicknameMutation(c.config, OpUpdate)
	return &UserNicknameUpdate{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOne returns an update builder for the given entity.
func (c *UserNicknameClient) UpdateOne(un *UserNickname) *UserNicknameUpdateOne {
	mutation := newUserNicknameMutation(c.config, OpUpdateOne, withUserNickname(un))
	return &UserNicknameUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// UpdateOneID returns an update builder for the given id.
func (c *UserNicknameClient) UpdateOneID(id int64) *UserNicknameUpdateOne {
	mutation := newUserNicknameMutation(c.config, OpUpdateOne, withUserNicknameID(id))
	return &UserNicknameUpdateOne{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// Delete returns a delete builder for UserNickname.
func (c *UserNicknameClient) Delete() *UserNicknameDelete {
	mutation := newUserNicknameMutation(c.config, OpDelete)
	return &UserNicknameDelete{config: c.config, hooks: c.Hooks(), mutation: mutation}
}

// DeleteOne returns a builder for deleting the given entity.
func (c *UserNicknameClient) DeleteOne(un *UserNickname) *UserNicknameDeleteOne {
	return c.DeleteOneID(un.ID)
}

// DeleteOneID returns a builder for deleting the given entity by its id.
func (c *UserNicknameClient) DeleteOneID(id int64) *UserNicknameDeleteOne {
	builder := c.Delete().Where(usernickname.ID(id))
	builder.mutation.id = &id
	builder.mutation.op = OpDeleteOne
	return &UserNicknameDeleteOne{builder}
}

// Query returns a query builder for UserNickname.
func (c *UserNicknameClient) Query() *UserNicknameQuery {
	return &UserNicknameQuery{
		config: c.config,
		ctx:    &QueryContext{Type: TypeUserNickname},
		inters: c.Interceptors(),
	}
}

// Get returns a UserNickname entity by its id.
func (c *UserNicknameClient) Get(ctx context.Context, id int64) (*UserNickname, error) {
	return c.Query().Where(usernickname.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *UserNicknameClient) GetX(ctx context.Context, id int64) *UserNickname {
	obj, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return obj
}

// Hooks returns the client hooks.
func (c *UserNicknameClient) Hooks() []Hook {
	hooks := c.hooks.UserNickname
	return append(hooks[:len(hooks):len(hooks)], usernickname.Hooks[:]...)
}

// Interceptors returns the client interceptors.
func (c *UserNicknameClient) Interceptors() []Interceptor {
	inters := c.inters.UserNickname
	return append(inters[:len(inters):len(inters)], usernickname.Interceptors[:]...)
}

func (c *UserNicknameClient) mutate(ctx context.Context, m *UserNicknameMutation) (Value, error) {
	switch m.Op() {
	case OpCreate:
		return (&UserNicknameCreate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdate:
		return (&UserNicknameUpdate{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpUpdateOne:
		return (&UserNicknameUpdateOne{config: c.config, hooks: c.Hooks(), mutation: m}).Save(ctx)
	case OpDelete, OpDeleteOne:
		return (&UserNicknameDelete{config: c.config, hooks: c.Hooks(), mutation: m}).Exec(ctx)
	default:
		return nil, fmt.Errorf("ent: unknown UserNickname mutation op: %q", m.Op())
	}
}

// hooks and interceptors per client, for fast access.
type (
	hooks struct {
		Channel, ChannelRole, Chat, Room, User, UserNickname []ent.Hook
	}
	inters struct {
		Channel, ChannelRole, Chat, Room, User, UserNickname []ent.Interceptor
	}
)
