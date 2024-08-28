package kafka_service

import (
	"context"
	"encoding/json"
	"github.com/araddon/dateparse"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/segmentio/kafka-go"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	"gorm.io/gorm"
	"log"
	"strings"
	"time"
)

func StartKafkaConsumer(kafkaReader *kafka.Reader, db *gorm.DB) {
	for {
		m, err := kafkaReader.ReadMessage(context.Background())
		if err != nil {
			log.Panicf("Error reading message from Kafka: %v", err)
		}

		var data map[string]interface{}
		err = json.Unmarshal(m.Value, &data)

		if err != nil {
			log.Panicf("Error unmarshalling JSON: %v", err)
		}

		taskId, err := uuid.Parse(data["task_id"].(string))
		if err != nil {
			log.Panicf("Error parsing task id: %v", err)
		}

		task := &models.Task{}

		if err := db.Preload("Scheduling").First(task, "id = ?", taskId).Error; err != nil {
			log.Panicf("Error finding task: %v", err)
		}

		taskUpdates := map[string]interface{}{}

		if data["status"] != nil {
			taskUpdates["Status"] = data["status"]
		}

		if data["executed_at"] != nil {
			if taskUpdates["ExecutedAt"], err = dateparse.ParseAny(data["executed_at"].(string)); err != nil {
				log.Panicf("Error parsing task executed_at: %v", err)
			}
		}

		if data["retries"] != nil {
			taskUpdates["Retries"] = data["retries"]
		}

		if data["artifacts"] != nil {
			taskUpdates["Artifacts"] = pq.Array(data["artifacts"])
		}

		if err := db.Model(task).Updates(taskUpdates).Error; err != nil {
			log.Fatalf("failed to update task status for task %s: %v", taskId, err)
		}

		if task.Scheduling.RetentionPeriod > 0 {
			now := time.Now()
			if err := db.Model(task.Scheduling).Update("NextScheduleTime", now.Add(time.Duration(task.Scheduling.RetentionPeriod)*time.Minute)).Error; err != nil {
				log.Fatalf("failed to update task next_schedule_time: %v", err)
			}
		}

		log.Printf("Message received: key = %s, value = %s, partition = %d, offset = %d\n",
			string(m.Key), string(m.Value), m.Partition, m.Offset)
	}
}

func escapeQuotes(input string) string {
	return strings.ReplaceAll(input, `"`, `\"`)
}
