package kafka_service

import (
	"github.com/joho/godotenv"
	"github.com/segmentio/kafka-go"
	"log"
	"os"
	"sync"
)

var (
	kafkaWriter *kafka.Writer
	kafkaReader *kafka.Reader
	onceWriter  sync.Once
	onceReader  sync.Once
)

func WriterInstance() *kafka.Writer {
	onceWriter.Do(initKafkaWriter)
	return kafkaWriter
}

func ReaderInstance() *kafka.Reader {
	onceReader.Do(initKafkaReader)
	return kafkaReader
}

func initKafkaWriter() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	kafkaURL := getEnv("KAFKA_URL", "localhost:9092")
	kafkaTopic := getEnv("KAFKA_TOPIK", "data-compositor")

	kafkaWriter = &kafka.Writer{
		Addr:     kafka.TCP(kafkaURL),
		Topic:    kafkaTopic,
		Balancer: &kafka.LeastBytes{},
	}
}

func initKafkaReader() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	kafkaURL := getEnv("KAFKA_URL", "localhost:9092")
	kafkaTopic := getEnv("KAFKA_TOPIC", "data-compositor")
	groupID := getEnv("KAFKA_GROUP_ID", "my-consumer-group")

	kafkaReader = kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{kafkaURL},
		GroupID:  groupID,
		Topic:    kafkaTopic,
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
}

func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}
