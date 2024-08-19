package graph

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	"github.com/stopover-org/stopover/data-compositor/internal/graphql/graph/model"
	"time"
)

// Edge represents a generic edge in a GraphQL connection.
type Edge[T any] struct {
	Node   *T
	Cursor string
}

// NewEdge creates a new Edge with a given node and cursor, where T can be any type.
func NewEdge[T any](node *T, id uuid.UUID) *Edge[T] {
	return &Edge[T]{
		Node:   node,
		Cursor: EncodeCursor(id),
	}
}

func formatToISO8601(t *time.Time) *string {
	if t == nil {
		return nil
	}
	formattedTime := t.Format(time.RFC3339)
	return &formattedTime
}

func TasksToGraphqlConnection(tasks []models.Task, pageInfo *graphql.PageInfo) (*graphql.TaskConnection, error) {
	edges := make([]*graphql.TaskEdge, len(tasks))

	for i, task := range tasks {
		// Convert each task to its GraphQL equivalent
		gqlTask, err := TaskToGraphql(&task)
		if err != nil {
			return nil, err
		}

		// Create an edge for the task
		edges[i] = &graphql.TaskEdge{
			Node:   gqlTask,
			Cursor: EncodeCursor(task.ID),
		}
	}

	return &graphql.TaskConnection{
		Edges:    edges,
		PageInfo: pageInfo,
	}, nil
}

func SchedulingsToGraphqlConnection(schedulings []models.Scheduling, pageInfo *graphql.PageInfo) (*graphql.SchedulingConnection, error) {
	edges := make([]*graphql.SchedulingEdge, len(schedulings))

	for i, scheduling := range schedulings {
		gqlTask, err := SchedulingToGraphql(&scheduling)
		if err != nil {
			return nil, err
		}

		// Create an edge for the task
		edges[i] = &graphql.SchedulingEdge{
			Node:   gqlTask,
			Cursor: EncodeCursor(scheduling.ID),
		}
	}

	return &graphql.SchedulingConnection{
		Edges:    edges,
		PageInfo: pageInfo,
	}, nil
}

func SchedulingToGraphql(scheduling *models.Scheduling) (*graphql.Scheduling, error) {
	configuration, err := json.Marshal(scheduling.Configuration)
	if err != nil {
		return nil, err
	}

	return &graphql.Scheduling{
		ID:               scheduling.ID.String(),
		NextScheduleTime: formatToISO8601(scheduling.NextScheduleTime),
		RetentionPeriod:  scheduling.RetentionPeriod,
		MaxRetries:       scheduling.MaxRetries,
		Status:           scheduling.Status,
		AdapterType:      scheduling.AdapterType,
		Configuration:    string(configuration),
		Name:             scheduling.Name,
	}, nil
}

func TaskToGraphql(task *models.Task) (*graphql.Task, error) {
	configuration, err := json.Marshal(task.Configuration)
	if err != nil {
		return nil, err
	}

	if task.Scheduling == nil {
		task.Scheduling = &models.Scheduling{}
	}

	scheduling, err := SchedulingToGraphql(task.Scheduling)
	if err != nil {
		return nil, err
	}

	return &graphql.Task{
		ID:            task.ID.String(),
		Status:        task.Status,
		Retries:       task.Retries,
		Artifacts:     task.Artifacts,
		AdapterType:   task.AdapterType,
		Configuration: string(configuration),
		SchedulingID:  task.SchedulingID.String(),
		Scheduling:    scheduling,
	}, nil
}
