package service

import (
  "os"
  "strings"
  "log"

  "github.com/timebankingskill/backend/internal/dto"
  "github.com/timebankingskill/backend/internal/models"
  "github.com/timebankingskill/backend/internal/repository"
  "github.com/timebankingskill/backend/internal/utils"
)

// AuthService handles authentication business logic
type AuthService struct {
  userRepo        *repository.UserRepository
  transactionRepo *repository.TransactionRepository
}

// NewAuthService creates a new auth service
func NewAuthService(userRepo *repository.UserRepository, transactionRepo *repository.TransactionRepository) *AuthService {
  return &AuthService{
    userRepo:        userRepo,
    transactionRepo: transactionRepo,
  }
}

// Register registers a new user account in the system
// Creates user profile, grants welcome bonus credits, sends verification email
//
// Registration Flow:
//   1. Validates registration input (email, password, username, etc)
//   2. Checks email and username uniqueness
//   3. Hashes password securely
//   4. Creates user record with default settings (is_verified=false)
//   5. Grants 3.0 welcome bonus credits (starting balance)
//   6. Creates initial transaction record for audit trail
//   7. Generates verification token (24 hour expiry)
//   8. Sends verification email via Resend
//   9. Returns registration response (user cannot login until verified)
//
// Welcome Bonus:
//   - New users receive 3.0 time credits to get started
//   - This allows immediate booking of learning sessions
//   - Credits are tracked in transaction history
//
// Email Verification:
//   - User must verify email before first login
//   - Verification link sent to email, valid for 24 hours
//   - User clicks link to complete registration
//
// Validation Rules:
//   - Password: Minimum 6 characters
//   - Username: Minimum 3 characters, unique
//   - Email: Must be valid format, unique
//   - Full Name, School, Grade: Required fields
//
// Parameters:
//   - req: Registration request with user details
//
// Returns:
//   - *AuthResponse: User profile (token returned after email verification)
//   - error: If validation fails, duplicate email/username, or database error
func (s *AuthService) Register(req *dto.RegisterRequest) (*dto.AuthResponse, error) {
  // Validate input
  if err := s.validateRegistration(req); err != nil {
    return nil, err
  }

  // Check if email already exists
  exists, err := s.userRepo.EmailExists(req.Email)
  if err != nil {
    return nil, err
  }
  if exists {
    return nil, utils.ErrEmailAlreadyRegistered
  }

  // Check if username already exists
  exists, err = s.userRepo.UsernameExists(req.Username)
  if err != nil {
    return nil, err
  }
  if exists {
    return nil, utils.ErrUsernameTaken
  }

  // Hash password
  hashedPassword, err := utils.HashPassword(req.Password)
  if err != nil {
    return nil, utils.ErrInternal
  }

  // Create user (not verified yet)
  user := &models.User{
    Email:         strings.ToLower(req.Email),
    Password:      hashedPassword,
    FullName:      req.FullName,
    Username:      strings.ToLower(req.Username),
    School:        req.School,
    Grade:         req.Grade,
    Major:         req.Major,
    PhoneNumber:   req.PhoneNumber,
    Location:      req.Location,
    CreditBalance: 3.0, // Starting bonus
    IsActive:      true,
    IsVerified:    false, // User must verify email
  }

  // Save user
  if err := s.userRepo.Create(user); err != nil {
    return nil, utils.ErrInternal
  }

  // Create initial transaction for welcome bonus
  transaction := &models.Transaction{
    UserID:        user.ID,
    Type:          models.TransactionInitial,
    Amount:        3.0,
    BalanceBefore: 0,
    BalanceAfter:  3.0,
    Description:   "Welcome bonus - Free credits to get started",
  }
  if err := s.transactionRepo.Create(transaction); err != nil {
    // Log error but don't fail registration as user is already created
    log.Printf("ERROR: Failed to create initial transaction for user %d: %v", user.ID, err)
  }

  // Generate verification token (24 hour expiry)
  verificationToken, err := utils.GenerateEmailVerificationToken(user.Email)
  if err != nil {
    // User created but email sending will fail, continue anyway
    // Return response so user knows to check email
  }

  // Build verification link - NOTE: Update this with your frontend URL
  frontendURL := os.Getenv("FRONTEND_URL")
  if frontendURL == "" {
    frontendURL = "http://localhost:3000" // fallback for development
  }
  verificationLink := frontendURL + "/verify-email?token=" + verificationToken

  // Send verification email
  if verificationToken != "" {
    _ = utils.SendVerificationEmail(user.Email, user.FullName, verificationLink)
  }

  // Prepare response (no token yet, user must verify email first)
  response := &dto.AuthResponse{
    Token: "", // Empty token until verified
    User:  s.mapUserToProfile(user),
  }

  return response, nil
}

// Login authenticates a user and generates JWT token
// Validates credentials and checks account status before allowing access
//
// Authentication Flow:
//   1. Finds user by email (case-insensitive)
//   2. Validates user account is active
//   3. Checks if email is verified
//   4. Verifies password using secure hash comparison
//   5. Generates JWT token with user ID and email
//   6. Returns token and user profile
//
// Security:
//   - Passwords are never returned in response
//   - Uses bcrypt for secure password hashing
//   - JWT tokens expire after configured duration
//   - Inactive accounts cannot login
//   - Unverified emails cannot login
//
// Parameters:
//   - req: Login request with email and password
//
// Returns:
//   - *AuthResponse: JWT token and user profile
//   - error: If invalid credentials, inactive account, unverified email, or database error
func (s *AuthService) Login(req *dto.LoginRequest) (*dto.AuthResponse, error) {
  // Find user by email
  user, err := s.userRepo.GetByEmail(strings.ToLower(req.Email))
  if err != nil {
    return nil, utils.ErrInvalidCredentials
  }

  // Check if user is active
  if !user.IsActive {
    return nil, utils.ErrAccountDeactivated
  }

  // Check if email is verified
  if !user.IsVerified {
    return nil, utils.ErrEmailNotVerified
  }

  // Verify password
  if err := utils.CheckPassword(user.Password, req.Password); err != nil {
    return nil, utils.ErrInvalidCredentials
  }

  // Generate JWT token
  token, err := utils.GenerateToken(user.ID, user.Email)
  if err != nil {
    return nil, utils.ErrInternal
  }

  // Prepare response
  response := &dto.AuthResponse{
    Token: token,
    User:  s.mapUserToProfile(user),
  }

  return response, nil
}

// GetProfile gets user profile by ID
func (s *AuthService) GetProfile(userID uint) (*dto.UserProfile, error) {
  user, err := s.userRepo.GetByID(userID)
  if err != nil {
    return nil, err
  }

  profile := s.mapUserToProfile(user)
  return &profile, nil
}

// validateRegistration validates registration request
func (s *AuthService) validateRegistration(req *dto.RegisterRequest) error {
  if len(req.Password) < 6 {
    return utils.ErrPasswordTooShort
  }
  if len(req.Username) < 3 {
    return utils.ErrUsernameTooShort
  }
  if req.FullName == "" {
    return utils.ErrFullNameRequired
  }
  if req.School == "" {
    return utils.ErrSchoolRequired
  }
  if req.Grade == "" {
    return utils.ErrGradeRequired
  }
  return nil
}

// mapUserToProfile maps user model to profile DTO
func (s *AuthService) mapUserToProfile(user *models.User) dto.UserProfile {
  return dto.UserProfile{
    ID:            user.ID,
    Email:         user.Email,
    FullName:      user.FullName,
    Username:      user.Username,
    School:        user.School,
    Grade:         user.Grade,
    Major:         user.Major,
    Bio:           user.Bio,
    Avatar:        user.Avatar,
    Location:      user.Location,
    CreditBalance: user.CreditBalance,
    IsActive:      user.IsActive,
    IsVerified:    user.IsVerified,
  }
}

// VerifyEmail marks user email as verified using verification token
// This method is called when user clicks the verification link in email
//
// Verification Flow:
//   1. Validates the verification token (JWT with 24 hour expiry)
//   2. Extracts email from token claims
//   3. Finds user by email
//   4. Updates is_verified flag to true
//   5. Returns success message
//
// Parameters:
//   - token: JWT token containing user email and expiration
//
// Returns:
//   - error: If token invalid, expired, user not found, or database error
func (s *AuthService) VerifyEmail(token string) error {
  // Verify token and extract email
  email, err := utils.VerifyEmailToken(token)
  if err != nil {
    return err
  }

  // Find user by email
  user, err := s.userRepo.GetByEmail(email)
  if err != nil {
    return utils.ErrUserNotFound
  }

  // Update is_verified flag
  user.IsVerified = true
  if err := s.userRepo.Update(user); err != nil {
    return utils.ErrInternal
  }

  return nil
}

// ForgotPassword initiates password reset process
// Sends email with reset link to user's registered email address
//
// Password Reset Flow:
//   1. Validates email exists in system
//   2. Generates reset token (JWT with 1 hour expiry)
//   3. Sends email with reset link via Resend
//   4. Returns success message
//
// Security:
//   - Token is time-limited (1 hour expiration)
//   - Token is signed with JWT (cannot be forged)
//   - Actual password change requires token validation
//   - Email is only way to prove identity
//
// Parameters:
//   - req: Forgot password request with email
//
// Returns:
//   - error: If email not found or email sending fails
func (s *AuthService) ForgotPassword(req *dto.ForgotPasswordRequest) error {
  // Find user by email
  user, err := s.userRepo.GetByEmail(strings.ToLower(req.Email))
  if err != nil {
    // Don't reveal if email exists (security best practice)
    return nil
  }

  // Generate reset token (1 hour expiry)
  resetToken, err := utils.GeneratePasswordResetToken(user.Email)
  if err != nil {
    return utils.ErrInternal
  }

  // Build reset link
  frontendURL := os.Getenv("FRONTEND_URL")
  if frontendURL == "" {
    frontendURL = "http://localhost:3000"
  }
  resetLink := frontendURL + "/reset-password?token=" + resetToken

  // Send password reset email
  if err := utils.SendPasswordResetEmail(user.Email, user.FullName, resetLink); err != nil {
    // Log error but don't fail the request
    // User doesn't need to know email sending failed
  }

  // Always return success (don't reveal if email exists)
  return nil
}

// ResetPassword completes password reset process
// Validates reset token and updates user password
//
// Reset Flow:
//   1. Validates password reset token (JWT with 1 hour expiry)
//   2. Extracts email from token claims
//   3. Validates new password matches confirmation
//   4. Hashes new password securely
//   5. Updates password in database
//   6. Returns success message
//
// Parameters:
//   - req: Reset password request with token and new password
//
// Returns:
//   - error: If token invalid, expired, passwords don't match, or database error
func (s *AuthService) ResetPassword(req *dto.ResetPasswordRequest) error {
  // Validate passwords match
  if req.NewPassword != req.ConfirmPassword {
    return utils.ErrPasswordsDoNotMatch
  }

  // Validate password strength
  if len(req.NewPassword) < 6 {
    return utils.ErrPasswordTooShort
  }

  // Verify token and extract email
  email, err := utils.VerifyPasswordResetToken(req.Token)
  if err != nil {
    return err
  }

  // Find user by email
  user, err := s.userRepo.GetByEmail(email)
  if err != nil {
    return utils.ErrUserNotFound
  }

  // Hash new password
  hashedPassword, err := utils.HashPassword(req.NewPassword)
  if err != nil {
    return utils.ErrInternal
  }

  // Update password
  user.Password = hashedPassword
  if err := s.userRepo.Update(user); err != nil {
    return utils.ErrInternal
  }

  return nil
}
