package utils

import (
  "github.com/gin-gonic/gin"
)

// SuccessResponse represents a successful API response
type SuccessResponse struct {
  Success bool        `json:"success"`
  Message string      `json:"message"`
  Data    interface{} `json:"data,omitempty"`
}

// ErrorResponse represents an error API response
type ErrorResponse struct {
  Success bool   `json:"success"`
  Message string `json:"message"`
  Error   string `json:"error,omitempty"`
}

// SendSuccess sends a success response
func SendSuccess(c *gin.Context, statusCode int, message string, data interface{}) {
  c.JSON(statusCode, SuccessResponse{
    Success: true,
    Message: message,
    Data:    data,
  })
}

// SendError sends an error response
func SendError(c *gin.Context, statusCode int, message string, err error) {
  response := ErrorResponse{
    Success: false,
    Message: message,
  }

  if err != nil {
    response.Error = err.Error()
  }

  c.JSON(statusCode, response)
}
