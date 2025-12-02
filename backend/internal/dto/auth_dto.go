package dto

// RegisterRequest represents registration request
type RegisterRequest struct {
  Email       string `json:"email" binding:"required,email"`
  Password    string `json:"password" binding:"required,min=6"`
  FullName    string `json:"full_name" binding:"required"`
  Username    string `json:"username" binding:"required,min=3"`
  School      string `json:"school" binding:"required"`
  Grade       string `json:"grade" binding:"required"`
  Major       string `json:"major"`
  PhoneNumber string `json:"phone_number"`
}

// LoginRequest represents login request
type LoginRequest struct {
  Email    string `json:"email" binding:"required,email"`
  Password string `json:"password" binding:"required"`
}

// AuthResponse represents authentication response
type AuthResponse struct {
  Token string      `json:"token"`
  User  UserProfile `json:"user"`
}

// UserProfile represents user profile data
type UserProfile struct {
  ID            uint    `json:"id"`
  Email         string  `json:"email"`
  FullName      string  `json:"full_name"`
  Username      string  `json:"username"`
  School        string  `json:"school"`
  Grade         string  `json:"grade"`
  Major         string  `json:"major"`
  Bio           string  `json:"bio"`
  Avatar        string  `json:"avatar"`
  Location      string  `json:"location"`
  CreditBalance float64 `json:"credit_balance"`
  IsActive      bool    `json:"is_active"`
  IsVerified    bool    `json:"is_verified"`
}
