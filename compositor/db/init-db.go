package db

import (
	"context"
	"fmt"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"sync"
	"time"

	"github.com/jackc/pgx/v4"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/stopover-org/stopover/data-compositor/db/models"
)

var (
	db   *gorm.DB
	once sync.Once
)

func Instance() *gorm.DB {
	once.Do(func() {
		initDB()
	})
	return db
}

func initDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	customLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Info,
			Colorful:      true,
		},
	)

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_PORT"),
	)

	dbName := os.Getenv("DB_NAME")

	// Check if the database exists, create if not
	if err := checkAndCreateDatabase(dsn, dbName); err != nil {
		log.Fatalf("Error checking or creating database: %v", err)
	}

	// Connect to the database
	dsn = fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		dbName,
		os.Getenv("DB_PORT"),
	)

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: customLogger})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	// Migrate the schema
	err = db.AutoMigrate(&models.Task{}, &models.Scheduling{})
	if err != nil {
		log.Fatalf("Error migrating schema: %v", err)
	}
}

func checkAndCreateDatabase(dsn, dbName string) error {
	ctx := context.Background()

	conn, err := pgx.Connect(ctx, dsn)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}
	defer conn.Close(ctx)

	// Check if the database exists
	var exists bool
	err = conn.QueryRow(ctx, "SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = $1)", dbName).Scan(&exists)
	if err != nil {
		return fmt.Errorf("unable to check if database exists: %v", err)
	}

	if !exists {
		// Quote the database name to handle special characters
		_, err = conn.Exec(ctx, fmt.Sprintf(`CREATE DATABASE "%s"`, dbName))
		if err != nil {
			return fmt.Errorf("unable to create database: %v", err)
		}
		log.Printf("Database %s created successfully", dbName)
	}

	return nil
}
