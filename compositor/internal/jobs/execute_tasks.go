package jobs

import (
	"github.com/segmentio/kafka-go"
	"gorm.io/gorm"
)

type ExecuteTasksJob struct {
	db          *gorm.DB
	kafkaWriter *kafka.Writer
}

func NewExecuteTasksJob(db *gorm.DB, kafkaWriter *kafka.Writer) *ExecuteTasksJob {
	return &ExecuteTasksJob{
		db:          db,
		kafkaWriter: kafkaWriter,
	}
}
