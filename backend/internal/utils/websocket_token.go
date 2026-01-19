package utils

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"sync"
	"time"
)

// WebSocketToken represents a short-lived token for WebSocket connections
// These tokens are single-use and expire quickly (5 minutes default)
//
// Security Benefits:
//   - Tokens expire quickly, limiting exposure window
//   - Not stored in browser history (obtained via authenticated API call)
//   - Single-use prevents replay attacks
//   - Session-specific (can only be used for intended session)
//
// Flow:
//  1. Client requests WS token via authenticated POST /api/v1/sessions/:id/ws-token
//  2. Server generates short-lived token, stores in memory
//  3. Client connects to WebSocket with token in query param
//  4. Server validates token, marks as used, establishes connection
type WebSocketToken struct {
	Token     string
	UserID    uint
	SessionID uint
	ExpiresAt time.Time
	Used      bool
	CreatedAt time.Time
}

// WebSocketTokenStore manages short-lived WebSocket tokens
// Uses in-memory storage with automatic cleanup
type WebSocketTokenStore struct {
	tokens  map[string]*WebSocketToken
	mu      sync.RWMutex
	ttl     time.Duration
	cleanup *time.Ticker
}

// Global WebSocket token store
var wsTokenStore *WebSocketTokenStore
var wsTokenStoreOnce sync.Once

// GetWSTokenStore returns the global WebSocket token store
func GetWSTokenStore() *WebSocketTokenStore {
	wsTokenStoreOnce.Do(func() {
		wsTokenStore = NewWebSocketTokenStore(5 * time.Minute)
	})
	return wsTokenStore
}

// NewWebSocketTokenStore creates a new token store with specified TTL
func NewWebSocketTokenStore(ttl time.Duration) *WebSocketTokenStore {
	store := &WebSocketTokenStore{
		tokens:  make(map[string]*WebSocketToken),
		ttl:     ttl,
		cleanup: time.NewTicker(1 * time.Minute),
	}

	// Start cleanup goroutine
	go store.cleanupExpired()

	return store
}

// GenerateWSToken creates a new short-lived WebSocket token
//
// Parameters:
//   - userID: The authenticated user's ID
//   - sessionID: The session ID the token is valid for
//
// Returns:
//   - string: The generated token
//   - error: If token generation fails
//
// Example:
//
//	token, err := GetWSTokenStore().GenerateWSToken(userID, sessionID)
//	// Return token to client, valid for 5 minutes
func (s *WebSocketTokenStore) GenerateWSToken(userID, sessionID uint) (string, error) {
	// Generate 32-byte random token
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(tokenBytes)

	s.mu.Lock()
	defer s.mu.Unlock()

	s.tokens[token] = &WebSocketToken{
		Token:     token,
		UserID:    userID,
		SessionID: sessionID,
		ExpiresAt: time.Now().Add(s.ttl),
		Used:      false,
		CreatedAt: time.Now(),
	}

	return token, nil
}

// ValidateWSToken validates and consumes a WebSocket token
// Tokens can only be used once (single-use)
//
// Parameters:
//   - token: The token to validate
//   - sessionID: The session ID to validate against
//
// Returns:
//   - userID: The user ID associated with the token
//   - error: If token is invalid, expired, or already used
//
// Example:
//
//	userID, err := GetWSTokenStore().ValidateWSToken(token, sessionID)
//	if err != nil {
//	    return // Token invalid
//	}
//	// Proceed with WebSocket connection for userID
func (s *WebSocketTokenStore) ValidateWSToken(token string, sessionID uint) (uint, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	wsToken, exists := s.tokens[token]
	if !exists {
		return 0, errors.New("invalid token")
	}

	// Check if expired
	if time.Now().After(wsToken.ExpiresAt) {
		delete(s.tokens, token)
		return 0, errors.New("token expired")
	}

	// Check if already used (single-use)
	if wsToken.Used {
		return 0, errors.New("token already used")
	}

	// Check if session ID matches
	if wsToken.SessionID != sessionID {
		return 0, errors.New("token not valid for this session")
	}

	// Mark as used
	wsToken.Used = true

	// Delete immediately after use for security
	delete(s.tokens, token)

	return wsToken.UserID, nil
}

// RevokeWSToken revokes a specific token
func (s *WebSocketTokenStore) RevokeWSToken(token string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.tokens, token)
}

// RevokeUserTokens revokes all tokens for a specific user
// Use when user logs out or changes password
func (s *WebSocketTokenStore) RevokeUserTokens(userID uint) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for token, wsToken := range s.tokens {
		if wsToken.UserID == userID {
			delete(s.tokens, token)
		}
	}
}

// cleanupExpired removes expired tokens periodically
func (s *WebSocketTokenStore) cleanupExpired() {
	for range s.cleanup.C {
		s.mu.Lock()
		now := time.Now()
		for token, wsToken := range s.tokens {
			if now.After(wsToken.ExpiresAt) {
				delete(s.tokens, token)
			}
		}
		s.mu.Unlock()
	}
}

// Stop stops the cleanup goroutine
func (s *WebSocketTokenStore) Stop() {
	s.cleanup.Stop()
}

// Stats returns token store statistics (for monitoring)
func (s *WebSocketTokenStore) Stats() map[string]int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	active := 0
	used := 0
	expired := 0
	now := time.Now()

	for _, wsToken := range s.tokens {
		if now.After(wsToken.ExpiresAt) {
			expired++
		} else if wsToken.Used {
			used++
		} else {
			active++
		}
	}

	return map[string]int{
		"active":  active,
		"used":    used,
		"expired": expired,
		"total":   len(s.tokens),
	}
}
