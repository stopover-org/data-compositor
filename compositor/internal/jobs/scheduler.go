package jobs

import (
	"github.com/segmentio/kafka-go"
	"gorm.io/gorm"
	"time"

	"github.com/go-co-op/gocron"
)

func SetupScheduler(db *gorm.DB, kafkaWriter *kafka.Writer) *gocron.Scheduler {
	// Create a new scheduler
	s := gocron.NewScheduler(time.UTC)

	// Define jobs
	scheduleTasksJob := NewScheduleTasksJob(db, kafkaWriter)
	_, _ = s.Every(1).Minute().Do(scheduleTasksJob.Run)

	// Start the scheduler
	s.StartAsync()

	return s
}
