package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

// NotificationService handles all notification business logic
// Manages notification creation, retrieval, and broadcasting to users
// Uses WebSocket connections to send real-time notifications
type NotificationService struct {
	notificationRepo *repository.NotificationRepository
	userRepo         *repository.UserRepository

	// WebSocket connection management
	// clients maps userID to their WebSocket connections
	// mutex protects concurrent access to clients map
	clients map[uint][]chan *models.Notification
	mutex   sync.RWMutex
}

// NewNotificationService creates a new notification service instance
func NewNotificationService(
	notificationRepo *repository.NotificationRepository,
	userRepo *repository.UserRepository,
) *NotificationService {
	return &NotificationService{
		notificationRepo: notificationRepo,
		userRepo:         userRepo,
		clients:          make(map[uint][]chan *models.Notification),
	}
}

// CreateNotification creates a new notification and broadcasts it if user is online
// This is the main method called by other services when events occur
//
// Parameters:
//   - userID: User who will receive the notification
//   - notificationType: Type of notification (session, credit, achievement, review, social)
//   - title: Short title of the notification
//   - message: Detailed message
//   - data: Flexible JSON payload with event-specific data
//
// Returns:
//   - *Notification: Created notification object
//   - error: If user not found or database error
//
// Side Effects:
//   - Saves notification to database
//   - Broadcasts to user via WebSocket if online
//   - Triggers toast notification on frontend
//
// Example:
//   notification, err := notificationService.CreateNotification(
//     teacherID,
//     models.NotificationTypeSession,
//     "New Session Request",
//     "Budi wants to learn React.js",
//     map[string]interface{}{"sessionID": 123, "studentName": "Budi"},
//   )
func (s *NotificationService) CreateNotification(
	userID uint,
	notificationType models.NotificationType,
	title string,
	message string,
	data map[string]interface{},
) (*models.Notification, error) {
	// Verify user exists
	_, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Convert data map to JSON
	var jsonData json.RawMessage
	if data != nil {
		jsonBytes, err := json.Marshal(data)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal notification data: %w", err)
		}
		jsonData = json.RawMessage(jsonBytes)
	}

	// Create notification object
	notification := &models.Notification{
		UserID:    userID,
		Type:      notificationType,
		Title:     title,
		Message:   message,
		Data:      jsonData,
		IsRead:    false,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Save to database
	if err := s.notificationRepo.Create(notification); err != nil {
		return nil, fmt.Errorf("failed to create notification: %w", err)
	}

	// Reload notification with relationships
	notification, err = s.notificationRepo.GetByID(notification.ID)
	if err != nil {
		return nil, err
	}

	// Broadcast to user if they're online (WebSocket connected)
	s.BroadcastToUser(userID, notification)

	return notification, nil
}

// GetNotifications retrieves paginated notifications for a user
// Parameters:
//   - userID: User ID
//   - limit: Number of notifications to fetch (max 100)
//   - offset: Pagination offset
// Returns:
//   - []Notification: List of notifications
//   - int64: Total count
//   - error: If database error
func (s *NotificationService) GetNotifications(userID uint, limit int, offset int) ([]models.Notification, int64, error) {
	// Validate pagination params
	if limit <= 0 || limit > 100 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	return s.notificationRepo.GetByUserID(userID, limit, offset)
}

// GetUnreadNotifications retrieves unread notifications for a user
// Parameters:
//   - userID: User ID
//   - limit: Number of notifications to fetch (max 100)
//   - offset: Pagination offset
// Returns:
//   - []Notification: List of unread notifications
//   - int64: Total count of unread
//   - error: If database error
func (s *NotificationService) GetUnreadNotifications(userID uint, limit int, offset int) ([]models.Notification, int64, error) {
	// Validate pagination params
	if limit <= 0 || limit > 100 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	return s.notificationRepo.GetUnreadByUserID(userID, limit, offset)
}

// GetUnreadCount returns the count of unread notifications for a user
// Used by frontend to show badge count on notification bell
// Parameters:
//   - userID: User ID
// Returns:
//   - int64: Count of unread notifications
//   - error: If database error
func (s *NotificationService) GetUnreadCount(userID uint) (int64, error) {
	return s.notificationRepo.GetUnreadCount(userID)
}

// MarkAsRead marks a specific notification as read
// Parameters:
//   - notificationID: Notification ID
//   - userID: User ID (for authorization)
// Returns:
//   - error: If notification not found or user not authorized
func (s *NotificationService) MarkAsRead(notificationID uint, userID uint) error {
	// Verify notification belongs to user
	notification, err := s.notificationRepo.GetByID(notificationID)
	if err != nil {
		return errors.New("notification not found")
	}

	if notification.UserID != userID {
		return errors.New("unauthorized: notification does not belong to user")
	}

	return s.notificationRepo.MarkAsRead(notificationID)
}

// MarkAllAsRead marks all notifications for a user as read
// Parameters:
//   - userID: User ID
// Returns:
//   - error: If database error
func (s *NotificationService) MarkAllAsRead(userID uint) error {
	return s.notificationRepo.MarkAllAsRead(userID)
}

// DeleteNotification deletes a notification
// Parameters:
//   - notificationID: Notification ID
//   - userID: User ID (for authorization)
// Returns:
//   - error: If notification not found or user not authorized
func (s *NotificationService) DeleteNotification(notificationID uint, userID uint) error {
	// Verify notification belongs to user
	notification, err := s.notificationRepo.GetByID(notificationID)
	if err != nil {
		return errors.New("notification not found")
	}

	if notification.UserID != userID {
		return errors.New("unauthorized: notification does not belong to user")
	}

	return s.notificationRepo.Delete(notificationID)
}

// RegisterClient registers a WebSocket client for a user
// Called when user connects via WebSocket
// Parameters:
//   - userID: User ID
//   - ch: Channel to send notifications to
func (s *NotificationService) RegisterClient(userID uint, ch chan *models.Notification) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	s.clients[userID] = append(s.clients[userID], ch)
}

// UnregisterClient unregisters a WebSocket client for a user
// Called when user disconnects from WebSocket
// Parameters:
//   - userID: User ID
//   - ch: Channel to remove
func (s *NotificationService) UnregisterClient(userID uint, ch chan *models.Notification) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	clients := s.clients[userID]
	for i, client := range clients {
		if client == ch {
			// Remove client from slice
			s.clients[userID] = append(clients[:i], clients[i+1:]...)
			close(ch)
			break
		}
	}

	// Clean up empty user entry
	if len(s.clients[userID]) == 0 {
		delete(s.clients, userID)
	}
}

// BroadcastToUser sends a notification to all WebSocket connections of a user
// If user is offline, notification is already saved in database
// Parameters:
//   - userID: User ID
//   - notification: Notification to broadcast
func (s *NotificationService) BroadcastToUser(userID uint, notification *models.Notification) {
	s.mutex.RLock()
	clients := s.clients[userID]
	s.mutex.RUnlock()

	// Send to all connected clients for this user
	for _, ch := range clients {
		select {
		case ch <- notification:
		case <-time.After(1 * time.Second):
			// Timeout: client might be slow or disconnected
			// Don't block, just skip
		}
	}
}

// BroadcastToUsers sends a notification to multiple users
// Useful for notifications that affect multiple users
// Parameters:
//   - userIDs: List of user IDs
//   - notification: Notification to broadcast
func (s *NotificationService) BroadcastToUsers(userIDs []uint, notification *models.Notification) {
	for _, userID := range userIDs {
		s.BroadcastToUser(userID, notification)
	}
}

// GetNotificationsByType retrieves notifications of a specific type for a user
// Parameters:
//   - userID: User ID
//   - notificationType: Type to filter
//   - limit: Number to fetch
//   - offset: Pagination offset
// Returns:
//   - []Notification: List of notifications
//   - int64: Total count
//   - error: If database error
func (s *NotificationService) GetNotificationsByType(
	userID uint,
	notificationType models.NotificationType,
	limit int,
	offset int,
) ([]models.Notification, int64, error) {
	// Validate pagination params
	if limit <= 0 || limit > 100 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	return s.notificationRepo.GetByType(userID, notificationType, limit, offset)
}
