package jobs

import (
	"encoding/json"
	"fmt"
	viper "github.com/spf13/viper"
	"github.com/stopover-org/stopover/data-compositor/db/models"
	"github.com/stopover-org/stopover/data-compositor/internal/services"
	"os"
	"strings"
)

type Config struct {
	Adapters map[string]string `yaml:"adapters"`
}

func loadConfig() map[string]string {
	v := viper.New()
	v.SetConfigFile("adapters.yml")

	// Enable environment variable substitution
	v.AutomaticEnv()

	// Read the config file
	err := v.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error reading config file: %w", err))
	}

	adapters := v.GetStringMapString("adapters")

	capitalizedAdapters := make(map[string]string)
	for key, value := range adapters {
		capitalizedKey := strings.ToUpper(key)

		cleanURL := os.ExpandEnv(value)
		cleanURL = strings.TrimSuffix(cleanURL, "/")

		capitalizedAdapters[capitalizedKey] = cleanURL
	}

	return capitalizedAdapters
}

func (s *ExecuteTasksJob) Run() error {
	adapters := loadConfig()

	var tasks []models.Task
	err := s.db.Where("status = 'PENDING'").Find(&tasks).Error
	if err != nil {
		return err
	}

	for _, task := range tasks {
		var configuration map[string]interface{}

		err := json.Unmarshal(task.Configuration, &configuration)
		if err != nil {
			fmt.Println("Error unmarshaling task configuration:", err)
			continue
		}

		services.NewTaskService().PostUrl(task.ID, adapters[task.AdapterType.String()], configuration)
	}

	return nil
}
