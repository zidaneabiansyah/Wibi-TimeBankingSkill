package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// NotificationHandler handles HTTP requests for notifications
type NotificationHandler struct {
	notificationService *service.NotificationService
}

// NewNotificationHandler creates a new notification handler
func NewNotificationHandler(notificationService *service.NotificationService) *NotificationHandler {
	return &NotificationHandler{
		notificationService: notificationService,
	}
}

// GetNotifications retrieves paginated notifications for the current user
// GET /api/v1/notifications
// Query params:
//   - limit: Number of notifications (default: 10, max: 100)
//   - offset: Pagination offset (default: 0)
func (h *NotificationHandler) GetNotifications(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Parse query params
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	// Get notifications
	notifications, total, err := h.notificationService.GetNotifications(userID, limit, offset)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch notifications", err)
		return
	}

	// Map to response DTOs
	response := []dto.NotificationResponse{}
	for _, n := range notifications {
		response = append(response, dto.MapNotificationToResponse(&n))
	}

	utils.SendSuccess(c, http.StatusOK, "Notifications retrieved successfully", gin.H{
		"notifications": response,
		"total":         total,
		"limit":         limit,
		"offset":        offset,
	})
}

// GetUnreadNotifications retrieves unread notifications for the current user
// GET /api/v1/notifications/unread
// Query params:
//   - limit: Number of notifications (default: 10, max: 100)
//   - offset: Pagination offset (default: 0)
func (h *NotificationHandler) GetUnreadNotifications(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Parse query params
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	// Get unread notifications
	notifications, total, err := h.notificationService.GetUnreadNotifications(userID, limit, offset)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch unread notifications", err)
		return
	}

	// Map to response DTOs
	response := []dto.NotificationResponse{}
	for _, n := range notifications {
		response = append(response, dto.MapNotificationToResponse(&n))
	}

	utils.SendSuccess(c, http.StatusOK, "Unread notifications retrieved successfully", gin.H{
		"notifications": response,
		"total":         total,
		"limit":         limit,
		"offset":        offset,
	})
}

// GetUnreadCount retrieves the count of unread notifications
// GET /api/v1/notifications/unread/count
// Returns the unread count for use in notification bell badge
func (h *NotificationHandler) GetUnreadCount(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Get unread count
	count, err := h.notificationService.GetUnreadCount(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch unread count", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Unread count retrieved successfully", gin.H{
		"unread_count": count,
	})
}

// MarkAsRead marks a notification as read
// PUT /api/v1/notifications/:id/read
// Parameters:
//   - id: Notification ID (in URL path)
func (h *NotificationHandler) MarkAsRead(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Parse notification ID
	notificationID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid notification ID", err)
		return
	}

	// Mark as read
	if err := h.notificationService.MarkAsRead(uint(notificationID), userID); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Notification marked as read", nil)
}

// MarkAllAsRead marks all notifications for the user as read
// PUT /api/v1/notifications/read-all
func (h *NotificationHandler) MarkAllAsRead(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Mark all as read
	if err := h.notificationService.MarkAllAsRead(userID); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to mark all as read", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "All notifications marked as read", nil)
}

// DeleteNotification deletes a notification
// DELETE /api/v1/notifications/:id
// Parameters:
//   - id: Notification ID (in URL path)
func (h *NotificationHandler) DeleteNotification(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Parse notification ID
	notificationID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid notification ID", err)
		return
	}

	// Delete notification
	if err := h.notificationService.DeleteNotification(uint(notificationID), userID); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Notification deleted successfully", nil)
}

// GetNotificationsByType retrieves notifications of a specific type
// GET /api/v1/notifications/type/:type
// Parameters:
//   - type: Notification type (session, credit, achievement, review, social)
// Query params:
//   - limit: Number of notifications (default: 10, max: 100)
//   - offset: Pagination offset (default: 0)
func (h *NotificationHandler) GetNotificationsByType(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// Parse notification type
	notificationType := models.NotificationType(c.Param("type"))

	// Parse query params
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	// Get notifications by type
	notifications, total, err := h.notificationService.GetNotificationsByType(
		userID,
		notificationType,
		limit,
		offset,
	)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch notifications", err)
		return
	}

	// Map to response DTOs
	response := []dto.NotificationResponse{}
	for _, n := range notifications {
		response = append(response, dto.MapNotificationToResponse(&n))
	}

	utils.SendSuccess(c, http.StatusOK, "Notifications retrieved successfully", gin.H{
		"notifications": response,
		"total":         total,
		"limit":         limit,
		"offset":        offset,
	})
}

// UpdatePreferences updates user notification preferences (stub)
// PUT /api/v1/notifications/preferences
func (h *NotificationHandler) UpdatePreferences(c *gin.Context) {
	userID := c.GetUint("user_id")
	if userID == 0 {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	// For now, this is a stub that just returns success
	// Actual implementation would save preferences to DB
	var req dto.UpdateNotificationPreferencesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request", err)
		return
	}

	// TODO: Implement actual preference saving when model is ready
	utils.SendSuccess(c, http.StatusOK, "Preferences saved successfully", nil)
}
