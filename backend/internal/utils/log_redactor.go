package utils

import (
	"regexp"
	"strings"
)

// SensitiveFields defines field names that should be redacted in logs
// These patterns are case-insensitive and match partial names
var SensitiveFields = []string{
	"password",
	"token",
	"secret",
	"api_key",
	"apikey",
	"authorization",
	"bearer",
	"credit_card",
	"creditcard",
	"cvv",
	"ssn",
	"social_security",
	"pin",
	"otp",
	"verification_code",
	"reset_token",
	"refresh_token",
	"access_token",
	"jwt",
	"cookie",
	"session_id",
	"private_key",
	"privatekey",
}

// RedactionPatterns defines regex patterns for sensitive data
var RedactionPatterns = map[string]*regexp.Regexp{
	// Email pattern - partial redaction
	"email": regexp.MustCompile(`([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})`),

	// Phone number patterns
	"phone": regexp.MustCompile(`(\+?[0-9]{1,4})?[-.\s]?\(?[0-9]{2,4}\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}`),

	// Credit card patterns (basic)
	"credit_card": regexp.MustCompile(`[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}`),

	// JWT token pattern
	"jwt": regexp.MustCompile(`eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*`),

	// UUID pattern (for tokens/session IDs)
	"uuid": regexp.MustCompile(`[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}`),

	// IP Address (partial redaction for privacy)
	"ip": regexp.MustCompile(`\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b`),
}

// RedactedValue is the placeholder for redacted content
const RedactedValue = "[REDACTED]"

// LogRedactor handles sensitive data redaction in logs
//
// Purpose:
//   - Prevent accidental logging of passwords, tokens, PII
//   - Comply with data protection regulations (GDPR, etc.)
//   - Reduce security risk from log exposure
//
// Usage:
//
//	redactor := NewLogRedactor()
//	safeLog := redactor.Redact("User password=secret123 logged in")
//	// Output: "User password=[REDACTED] logged in"
type LogRedactor struct {
	sensitiveFields   []string
	fieldPattern      *regexp.Regexp
	customPatterns    map[string]*regexp.Regexp
	redactEmails      bool
	redactPhones      bool
	redactIPs         bool
	partialRedaction  bool // Show partial data (e.g., last 4 chars)
}

// LogRedactorConfig configures redaction behavior
type LogRedactorConfig struct {
	RedactEmails     bool
	RedactPhones     bool
	RedactIPs        bool
	PartialRedaction bool // If true, show partial data instead of full redaction
	CustomFields     []string
}

// DefaultLogRedactorConfig returns default configuration
func DefaultLogRedactorConfig() LogRedactorConfig {
	return LogRedactorConfig{
		RedactEmails:     true,
		RedactPhones:     true,
		RedactIPs:        false, // Often needed for debugging
		PartialRedaction: true,
		CustomFields:     nil,
	}
}

// NewLogRedactor creates a new log redactor with default config
func NewLogRedactor() *LogRedactor {
	return NewLogRedactorWithConfig(DefaultLogRedactorConfig())
}

// NewLogRedactorWithConfig creates a log redactor with custom config
func NewLogRedactorWithConfig(config LogRedactorConfig) *LogRedactor {
	// Combine default and custom sensitive fields
	allFields := append(SensitiveFields, config.CustomFields...)

	// Build regex pattern for field=value matching
	// Matches: field=value, field="value", field: value, "field": "value"
	fieldPatternStr := `(?i)["']?(` + strings.Join(allFields, "|") + `)["']?\s*[:=]\s*["']?([^"'\s,}\]]+)["']?`
	fieldPattern := regexp.MustCompile(fieldPatternStr)

	return &LogRedactor{
		sensitiveFields:  allFields,
		fieldPattern:     fieldPattern,
		customPatterns:   RedactionPatterns,
		redactEmails:     config.RedactEmails,
		redactPhones:     config.RedactPhones,
		redactIPs:        config.RedactIPs,
		partialRedaction: config.PartialRedaction,
	}
}

// Redact removes or masks sensitive data from a log message
//
// Redaction includes:
//   - Field=value patterns (password=xxx → password=[REDACTED])
//   - Email addresses (partial: john@example.com → j***@example.com)
//   - Phone numbers (full redaction)
//   - JWT tokens (full redaction)
//   - Credit card numbers (show last 4: ****-****-****-1234)
//
// Parameters:
//   - message: The log message to redact
//
// Returns:
//   - string: Redacted message safe for logging
func (r *LogRedactor) Redact(message string) string {
	result := message

	// 1. Redact field=value patterns
	result = r.fieldPattern.ReplaceAllStringFunc(result, func(match string) string {
		// Extract field name and replace value
		parts := r.fieldPattern.FindStringSubmatch(match)
		if len(parts) >= 3 {
			fieldName := parts[1]
			return fieldName + "=" + RedactedValue
		}
		return match
	})

	// 2. Redact JWT tokens
	result = r.customPatterns["jwt"].ReplaceAllString(result, RedactedValue)

	// 3. Redact credit cards (show last 4 if partial redaction enabled)
	if r.partialRedaction {
		result = r.customPatterns["credit_card"].ReplaceAllStringFunc(result, func(match string) string {
			clean := strings.ReplaceAll(strings.ReplaceAll(match, "-", ""), " ", "")
			if len(clean) >= 4 {
				return "****-****-****-" + clean[len(clean)-4:]
			}
			return RedactedValue
		})
	} else {
		result = r.customPatterns["credit_card"].ReplaceAllString(result, RedactedValue)
	}

	// 4. Redact emails (partial: show first char and domain)
	if r.redactEmails {
		result = r.customPatterns["email"].ReplaceAllStringFunc(result, func(match string) string {
			if r.partialRedaction {
				parts := strings.Split(match, "@")
				if len(parts) == 2 && len(parts[0]) > 0 {
					return string(parts[0][0]) + "***@" + parts[1]
				}
			}
			return RedactedValue
		})
	}

	// 5. Redact phone numbers
	if r.redactPhones {
		result = r.customPatterns["phone"].ReplaceAllString(result, RedactedValue)
	}

	// 6. Redact IPs (partial: show first octet)
	if r.redactIPs {
		if r.partialRedaction {
			result = r.customPatterns["ip"].ReplaceAllStringFunc(result, func(match string) string {
				parts := strings.Split(match, ".")
				if len(parts) == 4 {
					return parts[0] + ".xxx.xxx.xxx"
				}
				return RedactedValue
			})
		} else {
			result = r.customPatterns["ip"].ReplaceAllString(result, RedactedValue)
		}
	}

	return result
}

// RedactMap redacts sensitive values from a map
// Useful for redacting structured log data
func (r *LogRedactor) RedactMap(data map[string]interface{}) map[string]interface{} {
	result := make(map[string]interface{})

	for key, value := range data {
		// Check if key is sensitive
		if r.isSensitiveField(key) {
			result[key] = RedactedValue
			continue
		}

		// Recursively handle nested maps
		if nestedMap, ok := value.(map[string]interface{}); ok {
			result[key] = r.RedactMap(nestedMap)
			continue
		}

		// Redact string values
		if strValue, ok := value.(string); ok {
			result[key] = r.Redact(strValue)
			continue
		}

		result[key] = value
	}

	return result
}

// isSensitiveField checks if a field name is sensitive
func (r *LogRedactor) isSensitiveField(fieldName string) bool {
	lowerField := strings.ToLower(fieldName)
	for _, sensitive := range r.sensitiveFields {
		if strings.Contains(lowerField, strings.ToLower(sensitive)) {
			return true
		}
	}
	return false
}

// ========================================
// Global Redactor Instance
// ========================================

var globalRedactor = NewLogRedactor()

// RedactLog redacts sensitive data from a log message using global redactor
//
// Example:
//
//	log.Println(RedactLog("User login: email=test@mail.com password=secret123"))
//	// Output: "User login: email=t***@mail.com password=[REDACTED]"
func RedactLog(message string) string {
	return globalRedactor.Redact(message)
}

// RedactLogMap redacts sensitive data from a map using global redactor
func RedactLogMap(data map[string]interface{}) map[string]interface{} {
	return globalRedactor.RedactMap(data)
}

// SetGlobalRedactor sets a custom global redactor
func SetGlobalRedactor(redactor *LogRedactor) {
	globalRedactor = redactor
}
