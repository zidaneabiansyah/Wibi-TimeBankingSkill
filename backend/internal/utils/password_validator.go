package utils

import (
	"errors"
	"regexp"
	"strings"
)

// Password policy errors (additional to errors.go)
var (
	ErrPasswordNoUppercase   = errors.New("password must contain at least one uppercase letter")
	ErrPasswordNoLowercase   = errors.New("password must contain at least one lowercase letter")
	ErrPasswordNoNumber      = errors.New("password must contain at least one number")
	ErrPasswordNoSpecial     = errors.New("password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
	ErrPasswordTooCommon     = errors.New("password is too common, please choose a stronger password")
	ErrPasswordContainsEmail = errors.New("password cannot contain your email address")
)

// Common passwords list (top 100 most common)
var commonPasswords = map[string]bool{
	"password":     true,
	"123456":       true,
	"12345678":     true,
	"qwerty":       true,
	"abc123":       true,
	"monkey":       true,
	"1234567":      true,
	"letmein":      true,
	"trustno1":     true,
	"dragon":       true,
	"baseball":     true,
	"iloveyou":     true,
	"master":       true,
	"sunshine":     true,
	"ashley":       true,
	"bailey":       true,
	"passw0rd":     true,
	"shadow":       true,
	"123123":       true,
	"654321":       true,
	"superman":     true,
	"qazwsx":       true,
	"michael":      true,
	"football":     true,
	"password1":    true,
	"password123":  true,
	"welcome":      true,
	"welcome1":     true,
	"admin":        true,
	"admin123":     true,
	"login":        true,
	"starwars":     true,
	"princess":     true,
	"solo":         true,
	"qwerty123":    true,
	"121212":       true,
	"1qaz2wsx":     true,
	"zaq1zaq1":     true,
}

// PasswordPolicy defines the password requirements
type PasswordPolicy struct {
	MinLength        int
	RequireUppercase bool
	RequireLowercase bool
	RequireNumber    bool
	RequireSpecial   bool
	CheckCommon      bool
}

// DefaultPasswordPolicy returns the default strong password policy
func DefaultPasswordPolicy() PasswordPolicy {
	return PasswordPolicy{
		MinLength:        8,
		RequireUppercase: true,
		RequireLowercase: true,
		RequireNumber:    true,
		RequireSpecial:   true,
		CheckCommon:      true,
	}
}

// ValidatePassword validates a password against the security policy
// 
// Requirements:
//   - Minimum 8 characters
//   - At least one uppercase letter (A-Z)
//   - At least one lowercase letter (a-z)
//   - At least one number (0-9)
//   - At least one special character (!@#$%^&*(),.?":{}|<>)
//   - Not in common passwords list
//
// Parameters:
//   - password: The password to validate
//
// Returns:
//   - error: Validation error if password doesn't meet requirements, nil if valid
//
// Example:
//   err := ValidatePassword("Str0ng@Pass!")
//   // err == nil (valid)
//   
//   err := ValidatePassword("weak")
//   // err == ErrPasswordTooShort
func ValidatePassword(password string) error {
	return ValidatePasswordWithPolicy(password, DefaultPasswordPolicy())
}

// ValidatePasswordWithPolicy validates a password against a custom policy
func ValidatePasswordWithPolicy(password string, policy PasswordPolicy) error {
	// Check minimum length
	if len(password) < policy.MinLength {
		return ErrPasswordTooShort
	}

	// Check for uppercase letter
	if policy.RequireUppercase {
		if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
			return ErrPasswordNoUppercase
		}
	}

	// Check for lowercase letter
	if policy.RequireLowercase {
		if !regexp.MustCompile(`[a-z]`).MatchString(password) {
			return ErrPasswordNoLowercase
		}
	}

	// Check for number
	if policy.RequireNumber {
		if !regexp.MustCompile(`[0-9]`).MatchString(password) {
			return ErrPasswordNoNumber
		}
	}

	// Check for special character
	if policy.RequireSpecial {
		if !regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>\[\]\\;'/~\x60\-_=+]`).MatchString(password) {
			return ErrPasswordNoSpecial
		}
	}

	// Check against common passwords
	if policy.CheckCommon {
		if isCommonPassword(password) {
			return ErrPasswordTooCommon
		}
	}

	return nil
}

// ValidatePasswordWithEmail validates password and ensures it doesn't contain the email
func ValidatePasswordWithEmail(password, email string) error {
	// First run standard validation
	if err := ValidatePassword(password); err != nil {
		return err
	}

	// Check if password contains email or email username
	lowerPass := strings.ToLower(password)
	lowerEmail := strings.ToLower(email)
	
	// Check full email
	if strings.Contains(lowerPass, lowerEmail) {
		return ErrPasswordContainsEmail
	}
	
	// Check email username (before @)
	if atIndex := strings.Index(lowerEmail, "@"); atIndex > 0 {
		emailUsername := lowerEmail[:atIndex]
		if len(emailUsername) >= 3 && strings.Contains(lowerPass, emailUsername) {
			return ErrPasswordContainsEmail
		}
	}

	return nil
}

// isCommonPassword checks if password is in the common passwords list
func isCommonPassword(password string) bool {
	lowerPass := strings.ToLower(password)
	return commonPasswords[lowerPass]
}

// GetPasswordStrength returns a score from 0-100 indicating password strength
// 
// Scoring:
//   - Length: +10 per character (max 40)
//   - Uppercase: +15
//   - Lowercase: +15
//   - Numbers: +15
//   - Special chars: +15
//   - Not common: +20 (penalty if common: -20)
//
// Parameters:
//   - password: The password to score
//
// Returns:
//   - int: Strength score 0-100
//   - string: Strength label (weak, fair, good, strong)
func GetPasswordStrength(password string) (int, string) {
	score := 0

	// Length score (up to 40 points)
	lengthScore := len(password) * 5
	if lengthScore > 40 {
		lengthScore = 40
	}
	score += lengthScore

	// Character type scores
	if regexp.MustCompile(`[A-Z]`).MatchString(password) {
		score += 15
	}
	if regexp.MustCompile(`[a-z]`).MatchString(password) {
		score += 15
	}
	if regexp.MustCompile(`[0-9]`).MatchString(password) {
		score += 15
	}
	if regexp.MustCompile(`[!@#$%^&*(),.?":{}|<>]`).MatchString(password) {
		score += 15
	}

	// Penalty for common passwords
	if isCommonPassword(password) {
		score -= 40
	}

	// Ensure score is in valid range
	if score < 0 {
		score = 0
	}
	if score > 100 {
		score = 100
	}

	// Determine strength label
	var label string
	switch {
	case score < 30:
		label = "weak"
	case score < 50:
		label = "fair"
	case score < 70:
		label = "good"
	default:
		label = "strong"
	}

	return score, label
}
