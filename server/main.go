package main

import (
	"context"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
	"server/business"
	"server/ent"
	"server/ent/room"
	_ "server/ent/runtime"
)

func main() {
	client, err := ent.Open("mysql", "root:root@tcp(localhost:3306)/mictory?parseTime=True")
	if err != nil {
		log.Fatalf("failed opening connection to mysql: %v", err)
	}
	defer client.Close()
	// Run the auto migration tool.
	ctx := context.Background()
	if err := client.Schema.Create(ctx); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}

	only := client.Room.Query().Where(room.ID(1)).OnlyX(ctx)

	c := only.QueryChannel().OnlyX(ctx)
	println(only.Name)
	println(c.Name)

	business.GlobalSocketServer = business.NewSocketServer()
	business.GlobalSocketServer.Start()

	app := fiber.New()
	app.Use(cors.New())
	_ = app.Listen(":8024")
}
