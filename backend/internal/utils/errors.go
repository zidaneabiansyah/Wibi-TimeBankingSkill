package utils

import "errors"

var (
	// Auth Errors
	ErrUnauthorized = errors.New("unauthorized access")
	ErrInvalidToken = errors.New("invalid or expired token")

	// User Errors
	ErrUserNotFound = errors.New("user not found")
	ErrInsufficientCredits = errors.New("insufficient available credit balance")

	// Skill Errors
	ErrSkillNotFound = errors.New("skill not found")
	ErrSkillNotAvailable = errors.New("this skill is currently not available for booking")
	ErrUserSkillNotFound = errors.New("user skill not found")

	// Session Errors
	ErrSessionNotFound = errors.New("session not found")
	ErrSessionConflict = errors.New("you already have an active session request for this skill")
	ErrSelfBooking = errors.New("you cannot book a session with yourself")
	ErrInvalidSchedule = errors.New("scheduled time must be in the future")
	ErrNotAuthorized = errors.New("you are not authorized to perform this action")
	ErrInvalidStatus = errors.New("session is not in a valid state for this action")
	ErrAlreadyCheckedIn = errors.New("you have already checked in")
	ErrCantCheckInYet   = errors.New("session cannot be checked in yet")
	ErrAlreadyCompleted = errors.New("session is already completed")
	ErrInternal         = errors.New("internal server error")
	ErrInvalidResolution = errors.New("invalid resolution (must be 'refund' or 'payout')")

	// Validation Errors
	ErrSkillNameRequired     = errors.New("skill name is required")
	ErrSkillCategoryRequired = errors.New("skill category is required")
	ErrSkillLevelRequired    = errors.New("skill level is required")
	ErrInvalidHourlyRate     = errors.New("hourly rate must be non-negative")
	ErrDuplicateSkill        = errors.New("user already has this skill")
	ErrDuplicateWishlist     = errors.New("skill already in learning wishlist")

	ErrUsernameTaken    = errors.New("username already taken")
	ErrInvalidPassword  = errors.New("invalid current password")
	ErrPasswordTooShort = errors.New("password must be at least 6 characters")

	ErrEmailAlreadyRegistered = errors.New("email already registered")
	ErrInvalidCredentials      = errors.New("invalid email or password")
	ErrAccountDeactivated     = errors.New("account is deactivated")
	ErrEmailNotVerified       = errors.New("please verify your email before logging in")
	ErrPasswordsDoNotMatch    = errors.New("passwords do not match")
	ErrUsernameTooShort       = errors.New("username must be at least 3 characters")
	ErrFullNameRequired       = errors.New("full name is required")
	ErrSchoolRequired         = errors.New("school is required")
	ErrGradeRequired          = errors.New("grade is required")
)
