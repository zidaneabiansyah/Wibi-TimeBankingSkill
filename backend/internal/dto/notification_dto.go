package dto

import (
	"encoding/json"
	"time"

	"github.com/timebankingskill/backend/internal/models"
)

// NotificationResponse represents a notification in API responses
type NotificationResponse struct {
	ID        uint            `json:"id"`
	UserID    uint            `json:"user_id"`
	Type      string          `json:"type"`
	Title     string          `json:"title"`
	Message   string          `json:"message"`
	Data      json.RawMessage `json:"data"`
	IsRead    bool            `json:"is_read"`
	ReadAt    *time.Time      `json:"read_at"`
	CreatedAt string          `json:"created_at"`
	UpdatedAt string          `json:"updated_at"`
}

// MapNotificationToResponse converts a Notification model to NotificationResponse DTO
func MapNotificationToResponse(notification *models.Notification) NotificationResponse {
	return NotificationResponse{
		ID:        notification.ID,
		UserID:    notification.UserID,
		Type:      string(notification.Type),
		Title:     notification.Title,
		Message:   notification.Message,
		Data:      notification.Data,
		IsRead:    notification.IsRead,
		ReadAt:    notification.ReadAt,
		CreatedAt: notification.CreatedAt.Format(time.RFC3339),
		UpdatedAt: notification.UpdatedAt.Format(time.RFC3339),
	}
}

// MapNotificationsToResponse converts a slice of Notification models to NotificationResponse DTOs
func MapNotificationsToResponse(notifications []models.Notification) []NotificationResponse {
	response := make([]NotificationResponse, len(notifications))
	for i, notification := range notifications {
		response[i] = MapNotificationToResponse(&notification)
	}
	return response
}
