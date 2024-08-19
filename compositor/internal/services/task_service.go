package services

import (
	"github.com/google/uuid"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	"github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
)

type TaskService interface {
	ExecTask(id uuid.UUID) (*models.Task, error)
	RetryTask(id uuid.UUID) (*models.Task, error)

	GetTask(id uuid.UUID) (*models.Task, error)
	GetTasks(input graphql.TaskFilterInput, first int, after string, last int, before string) ([]models.Task, *graphql.PageInfo, error)

	PostUrl(id uuid.UUID, url string, configuration map[string]interface{})
}
