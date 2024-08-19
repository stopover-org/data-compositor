package services

import (
	"github.com/google/uuid"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	"github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
)

type SchedulingService interface {
	CreateScheduling(createdFields graphql.SchedulingInput) (*models.Scheduling, error)
	UpdateScheduling(scheduleId uuid.UUID, updatedFields graphql.UpdateSchedulingInput) (*models.Scheduling, error)
	ToggleScheduling(scheduleId uuid.UUID) (*models.Scheduling, error)
	RemoveScheduling(scheduleId uuid.UUID) (*models.Scheduling, error)
	ScheduleNow(scheduleId uuid.UUID) (*models.Task, *models.Scheduling, error)

	GetScheduling(scheduleId uuid.UUID) (*models.Scheduling, error)
	GetSchedulings(input graphql.SchedulingFilterInput, first int, after string, last int, before string) ([]models.Scheduling, *graphql.PageInfo, error)
}
