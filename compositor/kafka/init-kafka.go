package kafka

import (
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"github.com/segmentio/kafka-go"
)

var (
	kafkaWriter *kafka.Writer
	once        sync.Once
)

func Instance() *kafka.Writer {
	once.Do(initKafkaWriter)
	return kafkaWriter
}

func initKafkaWriter() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	kafkaURL := getEnv("KAFKA_URL", "localhost:9092")
	kafkaTopic := getEnv("", "data-compositor")

	kafkaWriter = &kafka.Writer{
		Addr:     kafka.TCP(kafkaURL),
		Topic:    kafkaTopic,
		Balancer: &kafka.LeastBytes{},
	}
}

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}
