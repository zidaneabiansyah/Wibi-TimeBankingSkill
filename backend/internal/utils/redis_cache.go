package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

// CacheInterface defines the contract for cache implementations
// Allows swapping between in-memory and Redis cache
type CacheInterface interface {
	Set(key string, value interface{}) error
	SetWithTTL(key string, value interface{}, ttl time.Duration) error
	Get(key string) (interface{}, bool)
	GetJSON(key string, v interface{}) error
	Delete(key string) error
	Clear() error
	Size() int
	Ping() error
}

// RedisCache implements CacheInterface using Redis
// Provides distributed caching for multi-instance deployments
//
// Benefits over in-memory cache:
//   - Shared cache across multiple app instances
//   - Persistent across restarts
//   - Better scalability for high traffic
//   - Built-in TTL management by Redis
//
// Configuration via environment variables:
//   - REDIS_URL: Redis connection URL (default: localhost:6379)
//   - REDIS_PASSWORD: Redis password (optional)
//   - REDIS_DB: Redis database number (default: 0)
type RedisCache struct {
	client     *redis.Client
	defaultTTL time.Duration
	prefix     string // Key prefix for namespacing
	ctx        context.Context
}

// RedisConfig holds Redis connection configuration
type RedisConfig struct {
	URL      string
	Password string
	DB       int
	Prefix   string
}

// GetRedisConfigFromEnv reads Redis config from environment variables
func GetRedisConfigFromEnv() RedisConfig {
	url := os.Getenv("REDIS_URL")
	if url == "" {
		url = "localhost:6379"
	}

	password := os.Getenv("REDIS_PASSWORD")

	db := 0
	if dbStr := os.Getenv("REDIS_DB"); dbStr != "" {
		fmt.Sscanf(dbStr, "%d", &db)
	}

	prefix := os.Getenv("REDIS_PREFIX")
	if prefix == "" {
		prefix = "wibi:"
	}

	return RedisConfig{
		URL:      url,
		Password: password,
		DB:       db,
		Prefix:   prefix,
	}
}

// NewRedisCache creates a new Redis cache instance
//
// Parameters:
//   - config: Redis connection configuration
//   - defaultTTL: Default TTL for cache entries
//
// Returns:
//   - *RedisCache: Redis cache instance
//   - error: Connection error if Redis is unavailable
//
// Example:
//
//	config := GetRedisConfigFromEnv()
//	cache, err := NewRedisCache(config, 5*time.Minute)
//	if err != nil {
//	    // Fall back to in-memory cache
//	    log.Println("Redis unavailable, using in-memory cache")
//	}
func NewRedisCache(config RedisConfig, defaultTTL time.Duration) (*RedisCache, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     config.URL,
		Password: config.Password,
		DB:       config.DB,
	})

	ctx := context.Background()

	// Test connection
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("redis connection failed: %w", err)
	}

	return &RedisCache{
		client:     client,
		defaultTTL: defaultTTL,
		prefix:     config.Prefix,
		ctx:        ctx,
	}, nil
}

// prefixKey adds namespace prefix to key
func (r *RedisCache) prefixKey(key string) string {
	return r.prefix + key
}

// Set stores a value in Redis with default TTL
func (r *RedisCache) Set(key string, value interface{}) error {
	return r.SetWithTTL(key, value, r.defaultTTL)
}

// SetWithTTL stores a value in Redis with custom TTL
func (r *RedisCache) SetWithTTL(key string, value interface{}, ttl time.Duration) error {
	// Serialize value to JSON
	jsonData, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal value: %w", err)
	}

	return r.client.Set(r.ctx, r.prefixKey(key), jsonData, ttl).Err()
}

// Get retrieves a value from Redis
func (r *RedisCache) Get(key string) (interface{}, bool) {
	val, err := r.client.Get(r.ctx, r.prefixKey(key)).Result()
	if err == redis.Nil {
		return nil, false // Key doesn't exist
	}
	if err != nil {
		return nil, false // Error occurred
	}

	// Deserialize JSON
	var result interface{}
	if err := json.Unmarshal([]byte(val), &result); err != nil {
		return nil, false
	}

	return result, true
}

// GetJSON retrieves and unmarshals JSON from Redis into target struct
func (r *RedisCache) GetJSON(key string, v interface{}) error {
	val, err := r.client.Get(r.ctx, r.prefixKey(key)).Result()
	if err == redis.Nil {
		return fmt.Errorf("key not found: %s", key)
	}
	if err != nil {
		return fmt.Errorf("redis get error: %w", err)
	}

	return json.Unmarshal([]byte(val), v)
}

// Delete removes a key from Redis
func (r *RedisCache) Delete(key string) error {
	return r.client.Del(r.ctx, r.prefixKey(key)).Err()
}

// Clear removes all keys with this cache's prefix
// WARNING: Use carefully in production!
func (r *RedisCache) Clear() error {
	iter := r.client.Scan(r.ctx, 0, r.prefix+"*", 0).Iterator()
	for iter.Next(r.ctx) {
		if err := r.client.Del(r.ctx, iter.Val()).Err(); err != nil {
			return err
		}
	}
	return iter.Err()
}

// Size returns approximate number of keys with this prefix
func (r *RedisCache) Size() int {
	var count int
	iter := r.client.Scan(r.ctx, 0, r.prefix+"*", 0).Iterator()
	for iter.Next(r.ctx) {
		count++
	}
	return count
}

// Ping checks Redis connection health
func (r *RedisCache) Ping() error {
	return r.client.Ping(r.ctx).Err()
}

// Close closes the Redis connection
func (r *RedisCache) Close() error {
	return r.client.Close()
}

// ========================================
// Cache Factory - Auto-selects best cache
// ========================================

// CacheType represents the type of cache backend
type CacheType string

const (
	CacheTypeMemory CacheType = "memory"
	CacheTypeRedis  CacheType = "redis"
)

// SmartCache wraps either in-memory or Redis cache
// Provides automatic fallback to in-memory if Redis unavailable
type SmartCache struct {
	backend   CacheInterface
	cacheType CacheType
}

// NewSmartCache creates a cache with automatic backend selection
//
// Priority:
//  1. Redis (if REDIS_URL is set and connection succeeds)
//  2. In-memory (fallback)
//
// This allows seamless operation in both development (no Redis)
// and production (with Redis) environments.
func NewSmartCache(defaultTTL time.Duration) *SmartCache {
	// Try Redis first if URL is configured
	if os.Getenv("REDIS_URL") != "" {
		config := GetRedisConfigFromEnv()
		redisCache, err := NewRedisCache(config, defaultTTL)
		if err == nil {
			GetLogger().Info("Using Redis cache backend: %s", config.URL)
			return &SmartCache{
				backend:   redisCache,
				cacheType: CacheTypeRedis,
			}
		}
		GetLogger().Warn("Redis connection failed, falling back to in-memory: %v", err)
	}

	// Fall back to in-memory cache
	GetLogger().Info("Using in-memory cache backend")
	return &SmartCache{
		backend:   &MemoryCacheAdapter{cache: NewCache(defaultTTL)},
		cacheType: CacheTypeMemory,
	}
}

// GetBackendType returns the active cache backend type
func (s *SmartCache) GetBackendType() CacheType {
	return s.cacheType
}

// Implement CacheInterface by delegating to backend
func (s *SmartCache) Set(key string, value interface{}) error {
	return s.backend.Set(key, value)
}

func (s *SmartCache) SetWithTTL(key string, value interface{}, ttl time.Duration) error {
	return s.backend.SetWithTTL(key, value, ttl)
}

func (s *SmartCache) Get(key string) (interface{}, bool) {
	return s.backend.Get(key)
}

func (s *SmartCache) GetJSON(key string, v interface{}) error {
	return s.backend.GetJSON(key, v)
}

func (s *SmartCache) Delete(key string) error {
	return s.backend.Delete(key)
}

func (s *SmartCache) Clear() error {
	return s.backend.Clear()
}

func (s *SmartCache) Size() int {
	return s.backend.Size()
}

func (s *SmartCache) Ping() error {
	return s.backend.Ping()
}

// ========================================
// Memory Cache Adapter (wraps existing Cache)
// ========================================

// MemoryCacheAdapter wraps the existing Cache to implement CacheInterface
type MemoryCacheAdapter struct {
	cache *Cache
}

func (m *MemoryCacheAdapter) Set(key string, value interface{}) error {
	m.cache.Set(key, value)
	return nil
}

func (m *MemoryCacheAdapter) SetWithTTL(key string, value interface{}, ttl time.Duration) error {
	m.cache.SetWithTTL(key, value, ttl)
	return nil
}

func (m *MemoryCacheAdapter) Get(key string) (interface{}, bool) {
	return m.cache.Get(key)
}

func (m *MemoryCacheAdapter) GetJSON(key string, v interface{}) error {
	if !m.cache.GetJSON(key, v) {
		return fmt.Errorf("key not found or unmarshal failed: %s", key)
	}
	return nil
}

func (m *MemoryCacheAdapter) Delete(key string) error {
	m.cache.Delete(key)
	return nil
}

func (m *MemoryCacheAdapter) Clear() error {
	m.cache.Clear()
	return nil
}

func (m *MemoryCacheAdapter) Size() int {
	return m.cache.Size()
}

func (m *MemoryCacheAdapter) Ping() error {
	return nil // In-memory always available
}

// ========================================
// Global SmartCache Instance
// ========================================

var smartCache *SmartCache

// InitSmartCache initializes the global smart cache
// Call this during application startup
func InitSmartCache(defaultTTL time.Duration) {
	smartCache = NewSmartCache(defaultTTL)
}

// GetSmartCache returns the global smart cache instance
// Falls back to creating one if not initialized
func GetSmartCache() *SmartCache {
	if smartCache == nil {
		smartCache = NewSmartCache(5 * time.Minute)
	}
	return smartCache
}
