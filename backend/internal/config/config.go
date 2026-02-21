package config

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CORSConfig
	Supabase SupabaseConfig
}

// ServerConfig holds server-related configuration
type ServerConfig struct {
	Port           string
	GinMode        string
	TrustedProxies string // Comma-separated list of trusted proxy IPs
	RunMigrations  bool   // Whether to run DB migrations on startup
	SeedData       bool   // Whether to run DB seeders on startup
}

// DatabaseConfig holds database connection configuration
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// JWTConfig holds JWT authentication configuration
type JWTConfig struct {
	Secret string
	Expiry time.Duration
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
}

// SupabaseConfig holds Supabase configuration
type SupabaseConfig struct {
	URL string
	Key string
}


// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if exists (ignore error in production)
	_ = godotenv.Load()

	// Parse JWT expiry duration
	jwtExpiry, err := time.ParseDuration(getEnv("JWT_EXPIRY", "24h"))
	if err != nil {
		jwtExpiry = 24 * time.Hour
	}

	config := &Config{
		Server: ServerConfig{
			Port:           getEnv("PORT", ""),
			GinMode:        getEnv("GIN_MODE", ""),
			TrustedProxies: getEnv("TRUSTED_PROXIES", ""),
			RunMigrations:  getEnvAsBool("RUN_MIGRATIONS", false),
			SeedData:       getEnvAsBool("SEED_DATA", false),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", ""),
			Port:     getEnv("DB_PORT", ""),
			User:     getEnv("DB_USER", ""),
			Password: getEnv("DB_PASSWORD", ""),
			DBName:   getEnv("DB_NAME", ""),
			SSLMode:  getEnv("DB_SSLMODE", ""),
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", ""),
			Expiry: jwtExpiry,
		},
		CORS: CORSConfig{
			AllowedOrigins: parseAllowedOrigins(getEnv("ALLOWED_ORIGINS", "http://localhost:3000")),
		},
		Supabase: SupabaseConfig{
			URL: getEnv("SUPABASE_URL", ""),
			Key: getEnv("SUPABASE_KEY", ""),
		},
	}

	// Validate required fields
	if config.Database.Password == "" {
		return nil, fmt.Errorf("DB_PASSWORD is required")
	}
	
	// Enforce JWT_SECRET validation - must be set and not default
	if config.JWT.Secret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}
	if config.JWT.Secret == "your-secret-key" || len(config.JWT.Secret) < 32 {
		return nil, fmt.Errorf("JWT_SECRET must be at least 32 characters long and not use default value")
	}

	return config, nil
}

// getEnv gets environment variable with fallback default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// getEnvAsBool gets environment variable as a boolean with fallback
func getEnvAsBool(key string, defaultValue bool) bool {
	val := os.Getenv(key)
	if val == "" {
		return defaultValue
	}
	return strings.ToLower(val) == "true" || val == "1"
}

// parseAllowedOrigins parses comma-separated origins from environment variable
func parseAllowedOrigins(originsStr string) []string {
	if originsStr == "" {
		return []string{"http://localhost:3000"}
	}

	origins := strings.Split(originsStr, ",")
	var parsed []string
	for _, origin := range origins {
		origin = strings.TrimSpace(origin)
		if origin != "" {
			parsed = append(parsed, origin)
		}
	}

	if len(parsed) == 0 {
		return []string{"http://localhost:3000"}
	}

	return parsed
}

// GetDSN returns database connection string
func (c *DatabaseConfig) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode,
	)
}
