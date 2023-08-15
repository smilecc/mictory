package storage

import (
	"context"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"os"
	ent2 "server/ent"
)

var DbClient *ent2.Client
var AppSecret string

// InitStorage 初始化存储
func InitStorage() {
	dbDriver := GetEnv("DB_DRIVER", "sqlite3")
	dbDataSource := GetEnv("DB_DATASOURCE", "file:data.db?cache=shared&_fk=1")

	client, err := ent2.Open(dbDriver, dbDataSource)
	if err != nil {
		log.Fatalf("failed opening connection to mysql: %v", err)
	}

	DbClient = client

	// Run the auto migration tool.
	ctx := context.Background()
	if err := client.Schema.Create(ctx); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}
}

func GetEnv(k string, defaultValue string) string {
	v := os.Getenv(k)
	if len(v) == 0 {
		return defaultValue
	}

	return v
}

func RollbackTx(tx *ent2.Tx, err error) error {
	if txErr := tx.Rollback(); txErr != nil {
		err = fmt.Errorf("%w: %v", err, txErr)
	}
	return err
}
