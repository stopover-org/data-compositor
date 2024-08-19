package models

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
	"gorm.io/gorm"
	"time"
)

func validateTaskStatus(status graphql.TaskStatus) error {
	switch status {
	case graphql.TaskStatusPending, graphql.TaskStatusProcessing, graphql.TaskStatusCompleted, graphql.TaskStatusFailed, graphql.TaskStatusTerminated:
		return nil
	default:
		return fmt.Errorf("invalid TaskStatus: %s", status)
	}
}

type Task struct {
	ID        uuid.UUID          `gorm:"type:uuid;primaryKey"`
	Status    graphql.TaskStatus `gorm:"default:PENDING;not null"`
	Retries   int                `gorm:"default:0;not null"`
	Artifacts []string           `gorm:"type:text[]"`

	AdapterType   graphql.AdapterType `gorm:"type:string;nut null"`
	Configuration json.RawMessage     `gorm:"type:jsonb;not null"`

	ScheduledAt *time.Time
	ExecutedAt  *time.Time

	SchedulingID uuid.UUID `gorm:"type:uuid;not null;index"`
	Scheduling   *Scheduling
}

func (task *Task) BeforeCreate(tx *gorm.DB) (err error) {
	if task.ID == uuid.Nil {
		task.ID = uuid.New()
	}

	if task.Artifacts == nil {
		task.Artifacts = []string{}
	}

	if task.Status == "" {
		task.Status = graphql.TaskStatusPending
	}

	if task.AdapterType == "" {
		task.AdapterType = task.Scheduling.AdapterType
	}

	if task.Configuration == nil {
		emptyConfig := make(map[string]interface{})
		emptyConfigJSON, _ := json.Marshal(emptyConfig)
		task.Configuration = emptyConfigJSON
	}

	return validateTaskStatus(task.Status)
}

func (task *Task) BeforeUpdate(tx *gorm.DB) (err error) {
	return validateTaskStatus(task.Status)
}
