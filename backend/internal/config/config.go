package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	Environment    string
	BrevoAPIKey    string
	BrevoFromEmail string
	BrevoFromName  string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() (*Config, error) {
	cfg := &Config{
		Port:        getEnv("PORT", "8081"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5435/seedfundin?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "default-supa-secret-jwt-key-for-dev"),
		Environment:    getEnv("ENVIRONMENT", "development"),
		BrevoAPIKey:    getEnv("BREVO_API_KEY", ""),
		BrevoFromEmail: getEnv("BREVO_FROM_EMAIL", "hello@seedfundin.com"),
		BrevoFromName:  getEnv("BREVO_FROM_NAME", "Seedfundin Marketplace"),
	}

	if cfg.Port == "" {
		return nil, fmt.Errorf("PORT configuration cannot be empty")
	}
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL configuration cannot be empty")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if valStr, ok := os.LookupEnv(key); ok && valStr != "" {
		if val, err := strconv.Atoi(valStr); err == nil {
			return val
		}
	}
	return fallback
}
