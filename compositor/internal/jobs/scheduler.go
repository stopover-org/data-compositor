package jobs

import (
	"github.com/segmentio/kafka-go"
	"gorm.io/gorm"
	"log"
	"time"

	"github.com/go-co-op/gocron"
)

func SetupScheduler(db *gorm.DB, kafkaWriter *kafka.Writer) *gocron.Scheduler {
	s := gocron.NewScheduler(time.UTC)

	scheduleTasksJob := NewScheduleTasksJob(db, kafkaWriter)
	_, err := s.Every(1).Minute().Do(scheduleTasksJob.Run)
	if err != nil {
		log.Panic(err)
	}

	executeTasksJob := NewExecuteTasksJob(db, kafkaWriter)
	_, err = s.Every(1).Minute().Do(executeTasksJob.Run)
	if err != nil {
		log.Panic(err)
	}

	// Start the scheduler
	s.StartAsync()

	return s
}
