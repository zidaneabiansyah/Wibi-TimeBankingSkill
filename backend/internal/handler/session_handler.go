package handler

import (
	"log"
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
// @Summary Book a new session
// @Description Book a new session as a student for a specific teacher's skill.
// @Tags sessions
// @Accept json
// @Produce json
// @Security Bearer
// @Param request body dto.CreateSessionRequest true "Booking request"
// @Success 201 {object} utils.SuccessResponse
// @Failure 401 {object} utils.ErrorResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /sessions [post]
func (h *SessionHandler) BookSession(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req dto.CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("BookSession: Binding error - User %d, Error: %v", userID, err)
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	// Debug logging
	log.Printf("BookSession: User %d - UserSkillID: %d, Title: %s, Duration: %.2f, Mode: %s, ScheduledAt: %v", 
		userID, req.UserSkillID, req.Title, req.Duration, req.Mode, req.ScheduledAt)

	session, err := h.sessionService.BookSession(userID, &req)
	if err != nil {
		log.Printf("BookSession: Service error - User %d, Error: %v", userID, err)
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session retrieved successfully", session)
}

// GetUserSessions handles GET /api/v1/sessions
// @Summary List user's sessions
// @Description Get a filtered list of sessions for the authenticated user.
// @Tags sessions
// @Accept json
// @Produce json
// @Security Bearer
// @Param role query string false "Role (teacher/student)"
// @Param status query string false "Filter by status"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} utils.SuccessResponse
// @Failure 401 {object} utils.ErrorResponse
// @Router /sessions [get]
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session rejected", session)
}

// CheckIn handles POST /api/v1/sessions/:id/checkin
// Allows a participant to check in for a session
// When both parties check in, session automatically starts
func (h *SessionHandler) CheckIn(c *gin.Context) {
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

	session, err := h.sessionService.CheckIn(userID, uint(sessionID))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Checked in successfully", session)
}

// StartSession handles POST /api/v1/sessions/:id/start
// Marks a session as started (legacy fallback, prefer CheckIn flow)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session cancelled", session)
}

// DisputeSession handles POST /api/v1/sessions/:id/dispute
func (h *SessionHandler) DisputeSession(c *gin.Context) {
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

	var req dto.CancelSessionRequest // Re-use the same structure for reason
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	session, err := h.sessionService.DisputeSession(userID, uint(sessionID), &req)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session disputed and put under review", session)
}

// AdminResolveSession handles POST /api/v1/admin/sessions/:id/resolve
func (h *SessionHandler) AdminResolveSession(c *gin.Context) {
	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	resolution := c.Query("resolution") // "refund" or "payout"
	if resolution == "" {
		utils.SendError(c, http.StatusBadRequest, "Resolution query parameter is required", nil)
		return
	}

	session, err := h.sessionService.AdminResolveSession(uint(sessionID), resolution)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session dispute resolved: "+resolution, session)
}
