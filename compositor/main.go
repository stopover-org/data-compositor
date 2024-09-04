package main

import (
	"context"
	"errors"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4/middleware"
	"github.com/stopover-org/stopover/data-compositor/db"
	"github.com/stopover-org/stopover/data-compositor/internal/jobs"
	"github.com/stopover-org/stopover/data-compositor/internal/middlewares"
	"github.com/stopover-org/stopover/data-compositor/internal/services"
	"github.com/stopover-org/stopover/data-compositor/kafka"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/stopover-org/stopover/data-compositor/internal/graphql/graph"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	log.Println("Starting job scheduler")

	oidcIssuer := os.Getenv("OIDC_ISSUER")
	oidcClientID := os.Getenv("OIDC_CLIENT_ID")
	corsDomains := os.Getenv("CORS_DOMAINS")

	dbInstance := db.Instance()
	kafkaWriterInstance := kafka_service.WriterInstance()
	kafkaReaderInstance := kafka_service.ReaderInstance()

	jobs.SetupScheduler(dbInstance, kafkaWriterInstance)

	go kafka_service.StartKafkaConsumer(kafkaReaderInstance, dbInstance)

	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{corsDomains}, // Add your allowed domains here
		AllowMethods: []string{"*"},
		AllowHeaders: []string{"*"},
	}))
	e.Use(middleware.Logger())
	e.Use(middlewares.OIDCAuthMiddleware(oidcIssuer, oidcClientID))
	e.Use(middleware.Recover())

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		TaskService:       services.NewTaskService(),
		SchedulingService: services.NewSchedulingService(),
	}}))

	e.POST("/graphql", func(c echo.Context) error {
		srv.ServeHTTP(c.Response(), c.Request())
		return nil
	})

	e.GET("/playground", func(c echo.Context) error {
		playground.Handler("GraphQL playground", "/graphql").ServeHTTP(c.Response(), c.Request())
		return nil
	})

	go func() {
		if err := e.Start(":3321"); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	if err := kafkaReaderInstance.Close(); err != nil {
		log.Fatalf("Failed to close Kafka reader: %v", err)
	}
	if err := kafkaWriterInstance.Close(); err != nil {
		log.Fatalf("Failed to close Kafka writer: %v", err)
	}

	log.Println("Server shut down gracefully")
}
