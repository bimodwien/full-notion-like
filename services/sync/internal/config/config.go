package config

import "os"

type Config struct {
	Port      string
	WebOrigin string
	APIURL    string
}

func Load() Config {
	return Config{
		Port:      getEnv("PORT", "4000"),
		WebOrigin: getEnv("WEB_ORIGIN", "http://localhost:3000"),
		APIURL:    getEnv("API_URL", "http://localhost:3001"),
	}
}
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
