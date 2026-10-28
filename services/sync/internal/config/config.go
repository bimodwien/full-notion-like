package config

import "os"

type Config struct {
	Port      string
	WebOrigin string
}

func Load() Config {
	return Config{
		Port:      getEnv("PORT", "4000"),
		WebOrigin: getEnv("WEB_ORIGIN", "http://localhost:3000"),
	}
}
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
