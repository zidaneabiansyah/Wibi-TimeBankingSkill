package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// getUserID extracts user ID from context set by auth middleware.
// Returns the user ID and a boolean indicating if it was found.
func getUserID(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, false
	}
	return userID.(uint), true
}

// SessionHandler handles session-related HTTP requests
type SessionHandler struct {
	sessionService *service.SessionService
}

// NewSessionHandler creates a new session handler
func NewSessionHandler(sessionService *service.SessionService) *SessionHandler {
	return &SessionHandler{sessionService: sessionService}
}

// BookSession handles POST /api/v1/sessions
// Creates a new session request from student to teacher
func (h *SessionHandler) BookSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req dto.CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	session, err := h.sessionService.BookSession(userID, &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusCreated, "Session booked successfully", session)
}

// GetSession handles GET /api/v1/sessions/:id
// Retrieves a specific session by ID
func (h *SessionHandler) GetSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	session, err := h.sessionService.GetSession(userID, uint(sessionID))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Session not found", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session retrieved successfully", session)
}

// GetUserSessions handles GET /api/v1/sessions
// Retrieves all sessions for the authenticated user with optional filtering
func (h *SessionHandler) GetUserSessions(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Parse query params
	role := c.DefaultQuery("role", "")     // "teacher", "student", or empty for all
	status := c.DefaultQuery("status", "") // filter by status
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	if limit <= 0 || limit > 50 {
		limit = 10
	}

	sessions, err := h.sessionService.GetUserSessions(userID, role, status, limit, offset)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch sessions", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Sessions retrieved successfully", sessions)
}

// GetUpcomingSessions handles GET /api/v1/sessions/upcoming
// Retrieves upcoming sessions for the authenticated user
func (h *SessionHandler) GetUpcomingSessions(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if limit <= 0 || limit > 20 {
		limit = 5
	}

	sessions, err := h.sessionService.GetUpcomingSessions(userID, limit)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch upcoming sessions", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Upcoming sessions retrieved successfully", sessions)
}

// GetPendingRequests handles GET /api/v1/sessions/pending
// Retrieves pending session requests for the authenticated teacher
func (h *SessionHandler) GetPendingRequests(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	sessions, err := h.sessionService.GetPendingRequests(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch pending requests", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Pending requests retrieved successfully", sessions)
}

// ApproveSession handles POST /api/v1/sessions/:id/approve
// Teacher approves a pending session request
func (h *SessionHandler) ApproveSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	var req dto.ApproveSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		// Allow empty body
		req = dto.ApproveSessionRequest{}
	}

	session, err := h.sessionService.ApproveSession(userID, uint(sessionID), &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session approved successfully", session)
}

// RejectSession handles POST /api/v1/sessions/:id/reject
// Teacher rejects a pending session request
func (h *SessionHandler) RejectSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	var req dto.RejectSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	session, err := h.sessionService.RejectSession(userID, uint(sessionID), &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session rejected", session)
}

// StartSession handles POST /api/v1/sessions/:id/start
// Marks a session as started (check-in for both participants)
func (h *SessionHandler) StartSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	session, err := h.sessionService.StartSession(userID, uint(sessionID))
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session started", session)
}

// ConfirmCompletion handles POST /api/v1/sessions/:id/complete
// Marks a session as completed and releases credits to teacher
func (h *SessionHandler) ConfirmCompletion(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	var req dto.CompleteSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req = dto.CompleteSessionRequest{}
	}

	session, err := h.sessionService.ConfirmCompletion(userID, uint(sessionID), &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session completed successfully", session)
}

// CancelSession handles POST /api/v1/sessions/:id/cancel
// Cancels a session and refunds credits to student
func (h *SessionHandler) CancelSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	var req dto.CancelSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	session, err := h.sessionService.CancelSession(userID, uint(sessionID), &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session cancelled", session)
}
