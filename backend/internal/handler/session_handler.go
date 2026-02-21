package handler

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/pkg/errors"
	"github.com/timebankingskill/backend/pkg/response"
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
func (h *SessionHandler) BookSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	var req dto.CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("BookSession: Binding error - User %d, Error: %v", userID, err)
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	session, err := h.sessionService.BookSession(userID, &req)
	if err != nil {
		log.Printf("BookSession: Service error - User %d, Error: %v", userID, err)
		response.Error(c, err)
		return
	}

	response.Created(c, "Session booked successfully", session)
}

// GetSession handles GET /api/v1/sessions/:id
func (h *SessionHandler) GetSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	session, err := h.sessionService.GetSession(userID, uint(sessionID))
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session retrieved successfully", session)
}

// GetUserSessions handles GET /api/v1/sessions
func (h *SessionHandler) GetUserSessions(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
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
		response.Error(c, err)
		return
	}

	response.OK(c, "Sessions retrieved successfully", sessions)
}

// GetUpcomingSessions handles GET /api/v1/sessions/upcoming
func (h *SessionHandler) GetUpcomingSessions(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	if limit <= 0 || limit > 20 {
		limit = 5
	}

	sessions, err := h.sessionService.GetUpcomingSessions(userID, limit)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Upcoming sessions retrieved successfully", sessions)
}

// GetPendingRequests handles GET /api/v1/sessions/pending
func (h *SessionHandler) GetPendingRequests(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessions, err := h.sessionService.GetPendingRequests(userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Pending requests retrieved successfully", sessions)
}

// ApproveSession handles POST /api/v1/sessions/:id/approve
func (h *SessionHandler) ApproveSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	var req dto.ApproveSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req = dto.ApproveSessionRequest{}
	}

	session, err := h.sessionService.ApproveSession(userID, uint(sessionID), &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session approved successfully", session)
}

// RejectSession handles POST /api/v1/sessions/:id/reject
func (h *SessionHandler) RejectSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	var req dto.RejectSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	session, err := h.sessionService.RejectSession(userID, uint(sessionID), &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session rejected", session)
}

// CheckIn handles POST /api/v1/sessions/:id/checkin
func (h *SessionHandler) CheckIn(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	session, err := h.sessionService.CheckIn(userID, uint(sessionID))
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Checked in successfully", session)
}

// StartSession handles POST /api/v1/sessions/:id/start
func (h *SessionHandler) StartSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	session, err := h.sessionService.StartSession(userID, uint(sessionID))
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session started", session)
}

// ConfirmCompletion handles POST /api/v1/sessions/:id/complete
func (h *SessionHandler) ConfirmCompletion(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	var req dto.CompleteSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req = dto.CompleteSessionRequest{}
	}

	session, err := h.sessionService.ConfirmCompletion(userID, uint(sessionID), &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session completed successfully", session)
}

// CancelSession handles POST /api/v1/sessions/:id/cancel
func (h *SessionHandler) CancelSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	var req dto.CancelSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	session, err := h.sessionService.CancelSession(userID, uint(sessionID), &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session cancelled", session)
}

// DisputeSession handles POST /api/v1/sessions/:id/dispute
func (h *SessionHandler) DisputeSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	var req dto.CancelSessionRequest // Re-use the same structure for reason
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	session, err := h.sessionService.DisputeSession(userID, uint(sessionID), &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session disputed and put under review", session)
}

// AdminResolveSession handles POST /api/v1/admin/sessions/:id/resolve
func (h *SessionHandler) AdminResolveSession(c *gin.Context) {
	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid session ID")
		return
	}

	resolution := c.Query("resolution") // "refund" or "payout"
	if resolution == "" {
		response.ValidationError(c, "Resolution query parameter is required")
		return
	}

	session, err := h.sessionService.AdminResolveSession(uint(sessionID), resolution)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Session dispute resolved: "+resolution, session)
}
