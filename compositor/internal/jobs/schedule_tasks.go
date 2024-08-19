package jobs

import (
	"github.com/segmentio/kafka-go"
	"gorm.io/gorm"
)

type ScheduleTasksJob struct {
	db          *gorm.DB
	kafkaWriter *kafka.Writer
}

func NewScheduleTasksJob(db *gorm.DB, kafkaWriter *kafka.Writer) *ScheduleTasksJob {
	return &ScheduleTasksJob{
		db:          db,
		kafkaWriter: kafkaWriter,
	}
}
