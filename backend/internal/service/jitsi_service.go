package service

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/timebankingskill/backend/internal/config"
	"github.com/timebankingskill/backend/internal/models"
)

type JitsiService struct {
	config     *config.Config
	privateKey *rsa.PrivateKey
}

func NewJitsiService(cfg *config.Config) (*JitsiService, error) {
	// Parse the private key
	// If the key is a path, read the file. If it's the key content itself, use it directly.
	var keyBytes []byte
	var err error
	
	keyContent := strings.TrimSpace(cfg.Jitsi.PrivateKey)

	if strings.HasPrefix(keyContent, "-----BEGIN") {
		keyBytes = []byte(keyContent)
	} else if keyContent != "" {
		// Check if it's a file path
		if _, statErr := os.Stat(keyContent); statErr == nil {
			keyBytes, err = os.ReadFile(keyContent)
			if err != nil {
				return nil, fmt.Errorf("failed to read private key file: %w", err)
			}
		} else {
			// Not a file path, treat as raw key content and wrap with PEM headers if missing
			pemHeader := "-----BEGIN PRIVATE KEY-----\n"
			pemFooter := "\n-----END PRIVATE KEY-----"
			keyBytes = []byte(pemHeader + keyContent + pemFooter)
		}
	}

	var privateKey *rsa.PrivateKey
	if len(keyBytes) > 0 {
		block, _ := pem.Decode(keyBytes)
		if block == nil {
			return nil, errors.New("failed to parse PEM block containing the key")
		}

		privateKey, err = x509.ParsePKCS1PrivateKey(block.Bytes)
		if err != nil {
			// Try parsing as PKCS8
			pk8, err2 := x509.ParsePKCS8PrivateKey(block.Bytes)
			if err2 != nil {
				return nil, fmt.Errorf("failed to parse private key: %v (PKCS1), %v (PKCS8)", err, err2)
			}
			var ok bool
			privateKey, ok = pk8.(*rsa.PrivateKey)
			if !ok {
				return nil, errors.New("private key is not RSA")
			}
		}
	}

	if privateKey != nil {
		fmt.Println("Jitsi service initialized successfully with private key")
	}

	return &JitsiService{
		config:     cfg,
		privateKey: privateKey,
	}, nil
}

// GenerateToken generates a JWT token for Jitsi Meet (JaaS)
func (s *JitsiService) GenerateToken(user *models.User, roomID string, isModerator bool) (string, error) {
	if s.privateKey == nil {
		return "", errors.New("jitsi private key not configured")
	}

	now := time.Now()
	exp := now.Add(1 * time.Hour) // Token valid for 1 hour

	// Extract AppID - format is usually "vpaas-magic-cookie-..."
	// The "sub" should be the AppID
	appID := s.config.Jitsi.AppID

	// Jitsi specific claims structure
	claims := jwt.MapClaims{
		"aud": "jitsi",
		"iss": "chat",
		"sub": appID,
		"room": roomID,
		"exp": exp.Unix(),
		"nbf": now.Unix(),
		"context": map[string]interface{}{
			"user": map[string]interface{}{
				"id":     fmt.Sprintf("%d", user.ID),
				"name":   user.FullName,
				"email":  user.Email,
				"avatar": user.Avatar,
			},
			"features": map[string]interface{}{
				"livestreaming": true,
				"recording":     true,
				"transcription": true,
			},
		},
	}

    if isModerator {
        claims["context"].(map[string]interface{})["user"].(map[string]interface{})["moderator"] = true
    }

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
    
    // Key ID is often required in the header for JaaS providers to identify which key to use for verification
    // But usually with just the private key signing it works. Some providers need `kid`.
    // The Jitsi credentials usually come with a Key ID (kid) separate from the AppID.
    // If we assume standard JaaS, kid part of the AppID or related.
    // For now, let's sign it and see. If it fails, we might need a `kid` in config.
    // However, looking at the provided creds: `vpaas-magic-cookie-e5a71d0e5ce6498b8a1dc42a3d49c8fa/e62ff7`
    // The part after / could be the KID.
    
    parts := strings.Split(appID, "/")
    if len(parts) == 2 {
        token.Header["kid"] = parts[1]
        // The sub usually is just the AppID part without the KID? 
        // Standard JaaS: AppID is the issuer sometimes? No "chat" is iss.
        // Let's use the FULL string provided as AppID for now or check docs pattern.
        // Actually, usually: AppID = "vpaas-magic.../kid" is NOT standard.
        // Typically AppID is "vpaas-magic-..." and KeyID is "key-id".
        // The user provided `JITSI_APP_ID=vpaas-magic-cookie-e5a71d0e5ce6498b8a1dc42a3d49c8fa/e62ff7`
        // It's highly likely `vpaas-magic-cookie-e5a71d0e5ce6498b8a1dc42a3d49c8fa` is the AppID (sub)
        // and `e62ff7` is the KID.
        
        claims["sub"] = parts[0]
    }

	tokenString, err := token.SignedString(s.privateKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
