package models

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
	"gorm.io/gorm"
	"time"
)

func validateSchedulingStatus(status graphql.SchedulingStatus) error {
	switch status {
	case graphql.SchedulingStatusActive, graphql.SchedulingStatusInactive:
		return nil
	default:
		return fmt.Errorf("invalid SchedulingStatus: %s", status)
	}
}

func validateAdapterType(adapterType graphql.AdapterType) error {
	switch adapterType {
	case graphql.AdapterTypeViatorEventScrapper:
		return nil
	default:
		return fmt.Errorf("invalid AdapterType: %s", adapterType)
	}
}

type Scheduling struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name             string    `gorm:"not null"`
	NextScheduleTime *time.Time
	RetentionPeriod  int                      `gorm:"default:86400;not null"`
	MaxRetries       int                      `gorm:"default:3;not null"`
	Status           graphql.SchedulingStatus `gorm:"default:INACTIVE;not null"`
	AdapterType      graphql.AdapterType      `gorm:"not null"`

	Configuration json.RawMessage `gorm:"type:jsonb;not null"`

	Tasks []Task `gorm:"foreignKey:SchedulingID"`
}

func (scheduling *Scheduling) BeforeCreate(tx *gorm.DB) (err error) {
	if scheduling.ID == uuid.Nil {
		scheduling.ID = uuid.New()
	}

	err = validateAdapterType(scheduling.AdapterType)
	if err != nil {
		return err
	}

	return validateSchedulingStatus(scheduling.Status)
}

func (scheduling *Scheduling) BeforeUpdate(tx *gorm.DB) (err error) {
	err = validateAdapterType(scheduling.AdapterType)
	if err != nil {
		return err
	}

	return validateSchedulingStatus(scheduling.Status)
}
