package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/stopover-org/stopover/data-compositor/db"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	graph "github.com/stopover-org/stopover/data-compositor/internal/graphql"
	"github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
	"gorm.io/gorm"
	"time"
)

type schedulingServiceImpl struct {
	db *gorm.DB
}

func NewSchedulingService() SchedulingService {
	return &schedulingServiceImpl{
		db: db.Instance(),
	}
}

func (s *schedulingServiceImpl) CreateScheduling(createdFields graphql.SchedulingInput) (*models.Scheduling, error) {
	var configuration map[string]interface{}
	if err := json.Unmarshal([]byte(createdFields.Configuration), &configuration); err != nil {
		return nil, err
	}

	configJSON, err := json.Marshal(configuration)
	if err != nil {
		return nil, err
	}

	scheduling := &models.Scheduling{
		Name:          createdFields.Name,
		Status:        graphql.SchedulingStatusInactive,
		AdapterType:   createdFields.AdapterType,
		Configuration: configJSON,
	}

	if createdFields.RetentionPeriod != nil {
		retentionPeriod := *createdFields.RetentionPeriod
		if retentionPeriod < 60 {
			retentionPeriod = 60
			createdFields.RetentionPeriod = &retentionPeriod
		}

		scheduling.RetentionPeriod = *createdFields.RetentionPeriod
	}

	if createdFields.MaxRetries != nil {
		scheduling.MaxRetries = *createdFields.MaxRetries
	}

	if err := s.db.Create(scheduling).Error; err != nil {
		return nil, err
	}

	return scheduling, nil
}

func (s *schedulingServiceImpl) UpdateScheduling(id uuid.UUID, updatedFields graphql.UpdateSchedulingInput) (*models.Scheduling, error) {
	scheduling := &models.Scheduling{
		ID: id,
	}

	if updatedFields.Configuration != nil {
		var configuration map[string]interface{}
		if err := json.Unmarshal([]byte(*updatedFields.Configuration), &configuration); err != nil {
			return nil, err
		}

		configJSON, err := json.Marshal(configuration)
		if err != nil {
			return nil, err
		}

		scheduling.Configuration = configJSON
	}

	if updatedFields.AdapterType != nil {
		scheduling.AdapterType = *updatedFields.AdapterType
	}

	if updatedFields.RetentionPeriod != nil {
		scheduling.RetentionPeriod = *updatedFields.RetentionPeriod
	}

	if updatedFields.MaxRetries != nil {
		scheduling.MaxRetries = *updatedFields.MaxRetries
	}

	if updatedFields.Name != nil {
		scheduling.Name = *updatedFields.Name
	}

	if err := s.db.First(scheduling, "id = ?", id).Error; err != nil {
		return nil, err
	}

	if err := s.db.Model(scheduling).Updates(updatedFields).Error; err != nil {

		return nil, err
	}

	return scheduling, nil
}

func (s *schedulingServiceImpl) ToggleScheduling(id uuid.UUID) (*models.Scheduling, error) {
	scheduling := &models.Scheduling{}

	if err := s.db.First(scheduling, "id = ?", id).Error; err != nil {
		return nil, err
	}

	if scheduling.Status == graphql.SchedulingStatusActive {
		scheduling.Status = graphql.SchedulingStatusInactive
		scheduling.NextScheduleTime = nil
	} else {
		scheduling.Status = graphql.SchedulingStatusActive

		if scheduling.RetentionPeriod != 0 {
			now := time.Now()
			scheduling.NextScheduleTime = &now
		}
	}
	if err := s.db.Save(scheduling).Error; err != nil {
		return nil, err
	}

	return scheduling, nil
}

func (s *schedulingServiceImpl) RemoveScheduling(id uuid.UUID) (*models.Scheduling, error) {
	scheduling := &models.Scheduling{}

	if scheduling.Status == graphql.SchedulingStatusActive {
		return nil, errors.New("Active scheduling cannot be removed")
	}

	if err := s.db.First(scheduling, "id = ?", id).Error; err != nil {
		return nil, err
	}

	if err := s.db.Delete(scheduling).Error; err != nil {
		return nil, err
	}

	return scheduling, nil
}

func (s *schedulingServiceImpl) ScheduleNow(id uuid.UUID) (*models.Task, *models.Scheduling, error) {
	scheduling := &models.Scheduling{}
	task := &models.Task{
		Retries:       0,
		Status:        graphql.TaskStatusPending,
		Artifacts:     []string{},
		Configuration: json.RawMessage([]byte("{}")), // Default empty JSON
	}

	if err := s.db.First(scheduling, "id = ? AND status = ?", id, graphql.SchedulingStatusActive).Error; err != nil {
		return task, scheduling, err
	}

	if err := s.db.Where("scheduling_id = ?", id).Where("status = ? OR status = ?", graphql.TaskStatusPending, graphql.TaskStatusProcessing).First(task).Error; err == nil {
		fmt.Sprintf(
			"scheduling %s was already scheduled", scheduling.ID.String(),
		)

		return task, scheduling, errors.New("already scheduled")
	} else {
		fmt.Print(err)
	}

	now := time.Now()

	task.Scheduling = scheduling
	task.SchedulingID = scheduling.ID
	task.ScheduledAt = &now
	task.AdapterType = scheduling.AdapterType
	task.Configuration = scheduling.Configuration

	if err := s.db.Create(task).Error; err != nil {
		return task, scheduling, err
	}

	if scheduling.RetentionPeriod > 0 {
		nextSchedulingTime := scheduling.NextScheduleTime.Add(time.Duration(scheduling.RetentionPeriod) * time.Second)
		scheduling.NextScheduleTime = &nextSchedulingTime

		if err := s.db.Save(scheduling).Error; err != nil {
			return task, scheduling, err
		}
	}

	return task, scheduling, nil
}

func (s *schedulingServiceImpl) GetScheduling(id uuid.UUID) (*models.Scheduling, error) {
	scheduling := &models.Scheduling{}

	if err := s.db.First(scheduling, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return scheduling, nil
}

func (s *schedulingServiceImpl) GetSchedulings(input graphql.SchedulingFilterInput, first int, after string, last int, before string) ([]models.Scheduling, *graphql.PageInfo, error) {
	var schedulings []models.Scheduling
	query := s.db.Model(&models.Scheduling{})

	// Handle pagination (limit and offset)
	if first > 0 {
		query = query.Limit(first)
	} else if last > 0 {
		query = query.Limit(last).Order("id DESC")
	}

	if after != "" {
		decodedAfter := graph.DecodeCursor(&after)
		query = query.Where("id > ?", decodedAfter)
	}

	if before != "" {
		decodedBefore := graph.DecodeCursor(&before)
		query = query.Where("id < ?", decodedBefore)
	}

	// Order the results (assuming ordering by ID as an example)
	query = query.Order("id ASC")

	// Execute the query
	if err := query.Find(&schedulings).Error; err != nil {
		return nil, nil, err
	}

	pageInfo := &graphql.PageInfo{}

	if len(schedulings) > 0 {
		// Start and end cursors
		startCursor := graph.EncodeCursor(schedulings[0].ID)
		endCursor := graph.EncodeCursor(schedulings[len(schedulings)-1].ID)
		pageInfo.StartCursor = &startCursor
		pageInfo.EndCursor = &endCursor

		// HasNextPage: check if there are more tasks after the last task
		hasNextPageQuery := s.db.Model(&models.Task{}).Where("id > ?", schedulings[len(schedulings)-1].ID)
		var nextPageTask models.Task
		pageInfo.HasNextPage = hasNextPageQuery.Select("id").Order("id ASC").Limit(1).Find(&nextPageTask).RowsAffected > 0

		// HasPreviousPage: check if there are more tasks before the first task
		hasPreviousPageQuery := s.db.Model(&models.Task{}).Where("id < ?", schedulings[0].ID)
		var previousPageTask models.Task
		pageInfo.HasPreviousPage = hasPreviousPageQuery.Select("id").Order("id DESC").Limit(1).Find(&previousPageTask).RowsAffected > 0
	}

	// Total count of tasks matching the filter
	var totalCount int64
	countQuery := s.db.Model(&models.Task{})
	countQuery.Count(&totalCount)
	totalCountInt := int(totalCount)
	pageInfo.TotalCount = &totalCountInt

	return schedulings, pageInfo, nil
}
