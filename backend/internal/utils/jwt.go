package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// ErrJWTSecretRequired is returned when JWT_SECRET environment variable is not set
var ErrJWTSecretRequired = errors.New("JWT_SECRET environment variable is required")

// ErrJWTSecretTooShort is returned when JWT_SECRET is less than 32 characters
var ErrJWTSecretTooShort = errors.New("JWT_SECRET must be at least 32 characters")

// JWTClaims represents the claims in JWT token
type JWTClaims struct {
	UserID       uint   `json:"user_id"`
	Email        string `json:"email"`
	TokenVersion int    `json:"token_version"` // For session invalidation
	jwt.RegisteredClaims
}

// getJWTSecret retrieves and validates the JWT secret from environment
func getJWTSecret() (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", ErrJWTSecretRequired
	}
	if len(secret) < 32 {
		return "", ErrJWTSecretTooShort
	}
	return secret, nil
}

// GenerateToken generates a new JWT token for a user
// Deprecated: Use GenerateTokenWithVersion for new code
func GenerateToken(userID uint, email string) (string, error) {
	return GenerateTokenWithVersion(userID, email, 0)
}

// GenerateTokenWithVersion generates a JWT token with token version for invalidation support
// When user changes password, increment TokenVersion to invalidate all old tokens
func GenerateTokenWithVersion(userID uint, email string, tokenVersion int) (string, error) {
	secret, err := getJWTSecret()
	if err != nil {
		return "", err
	}

	// Create claims with token version
	claims := JWTClaims{
		UserID:       userID,
		Email:        email,
		TokenVersion: tokenVersion,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign token
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken validates a JWT token and returns claims
func ValidateToken(tokenString string) (*JWTClaims, error) {
	secret, err := getJWTSecret()
	if err != nil {
		return nil, err
	}

  // Parse token
  token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
    // Validate signing method
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
      return nil, errors.New("invalid signing method")
    }
    return []byte(secret), nil
  })

  if err != nil {
    return nil, err
  }

  // Extract claims
  if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
    return claims, nil
  }

  return nil, errors.New("invalid token")
}
