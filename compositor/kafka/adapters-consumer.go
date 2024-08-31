package kafka_service

import (
	"context"
	"encoding/json"
	"github.com/araddon/dateparse"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/segmentio/kafka-go"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	graphql "github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
	"gorm.io/gorm"
	"log"
	"time"
)

func StartKafkaConsumer(kafkaReader *kafka.Reader, db *gorm.DB) {
	for {
		m, err := kafkaReader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Error reading message from Kafka: %v", err)
			return
		}

		var data map[string]interface{}
		err = json.Unmarshal(m.Value, &data)

		if err != nil {
			log.Printf("Error unmarshalling JSON: %v", err)
			return
		}

		switch string(m.Key) {
		case "update_task":
			err := updateTaskConsumer(db, data)
			if err != nil {
				log.Printf("Error updating task: %v", err)
				return
			}
		case "schedule_task":
			err := scheduleNewTaskConsumer(db, data)
			if err != nil {
				log.Printf("Error creating task: %v", err)
				return
			}
		}

		log.Printf("Message received: key = %s, value = %s, partition = %d, offset = %d\n",
			string(m.Key), string(m.Value), m.Partition, m.Offset)
	}
}

func scheduleNewTaskConsumer(db *gorm.DB, data map[string]interface{}) error {
	taskId, err := uuid.Parse(data["task_id"].(string))
	if err != nil {
		log.Panicf("Error parsing task id: %v", err)
	}

	existingTask := &models.Task{}

	if err := db.Preload("Scheduling").First(existingTask, "id = ?", taskId).Error; err != nil {
		log.Printf("Error finding task: %v", err)
		return err
	}

	task := &models.Task{
		Status: graphql.TaskStatusPending,
	}

	if data["adapter_type"] != nil {
		task.AdapterType = graphql.AdapterType(data["adapter_type"].(string))
	} else {
		task.AdapterType = graphql.AdapterTypeCommonAdapter
	}

	if data["configuration"] != nil {
		configuration, err := json.Marshal(data["configuration"])
		if err != nil {
			return err
		}

		task.Configuration = configuration
	}

	task.SchedulingID = existingTask.SchedulingID

	now := time.Now()
	task.ScheduledAt = &now

	if err := db.Save(task).Error; err != nil {
		return nil
	}

	return nil
}

func updateTaskConsumer(db *gorm.DB, data map[string]interface{}) error {
	taskId, err := uuid.Parse(data["task_id"].(string))
	if err != nil {
		log.Panicf("Error parsing task id: %v", err)
	}

	task := &models.Task{}

	if err := db.Preload("Scheduling").First(task, "id = ?", taskId).Error; err != nil {
		log.Printf("Error finding task: %v", err)
		return err
	}

	taskUpdates := map[string]interface{}{}

	if data["status"] != nil {
		taskUpdates["Status"] = data["status"]
	}

	if data["executed_at"] != nil {
		if taskUpdates["ExecutedAt"], err = dateparse.ParseAny(data["executed_at"].(string)); err != nil {
			log.Printf("Error parsing task executed_at: %v", err)
			return err
		}
	}

	if data["status"] == graphql.TaskStatusFailed.String() || data["status"] == graphql.TaskStatusCompleted.String() {
		taskUpdates["Retries"] = task.Retries + 1
	}

	if data["artifacts"] != nil {
		taskUpdates["Artifacts"] = pq.Array(data["artifacts"])
	}

	if data["error"] != nil {
		errorObj, err := json.Marshal(data["error"])
		if err != nil {
			return err
		}

		task.Error = errorObj
	}

	if err := db.Model(task).Updates(taskUpdates).Error; err != nil {
		log.Printf("failed to update task status for task %s: %v", taskId, err)
		return err
	}

	if task.Scheduling.RetentionPeriod > 0 {
		now := time.Now()
		if err := db.Model(task.Scheduling).Update("NextScheduleTime", now.Add(time.Duration(task.Scheduling.RetentionPeriod)*time.Second)).Error; err != nil {
			log.Printf("failed to update task next_schedule_time: %v", err)
			return err
		}
	}

	log.Print("Task was updated")

	return nil
}
