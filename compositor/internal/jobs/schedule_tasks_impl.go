package jobs

import (
	"github.com/google/uuid"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	graphql "github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
	"github.com/stopover-org/stopover/data-compositor/internal/services"
	"time"
)

func (s *ScheduleTasksJob) Run() error {
	var schedulings []models.Scheduling
	now := time.Now()
	err := s.db.Where("status = ? AND next_schedule_time < ? AND retention_period > 0", graphql.SchedulingStatusActive, now).Find(&schedulings).Error
	if err != nil {
		return err
	}

	var ids []uuid.UUID

	for _, scheduling := range schedulings {
		task, _, err := services.NewSchedulingService().ScheduleNow(scheduling.ID)
		if err != nil {
			return err
		}

		ids = append(ids, task.ID)
	}

	return nil
}
