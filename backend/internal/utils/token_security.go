package utils

import (
	"crypto/sha256"
	"encoding/hex"
)

// HashToken creates a SHA256 hash of a token for secure storage
// We store hashes instead of actual tokens to prevent token theft from DB
//
// Parameters:
//   - token: The token string to hash
//
// Returns:
//   - string: Hex-encoded SHA256 hash
//
// Example:
//
//	hash := HashToken("eyJhbGciOiJIUzI1NiIs...")
//	// Store hash in database, not the actual token
func HashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}
