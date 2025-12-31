package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/utils"
)

// AdminApproveSession handles POST /api/v1/admin/sessions/:id/approve
func (h *SessionHandler) AdminApproveSession(c *gin.Context) {
	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	session, err := h.sessionService.AdminApproveSession(uint(sessionID))
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session approved by admin", session)
}

// AdminRejectSession handles POST /api/v1/admin/sessions/:id/reject
func (h *SessionHandler) AdminRejectSession(c *gin.Context) {
	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	session, err := h.sessionService.AdminRejectSession(uint(sessionID))
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session rejected by admin", session)
}

// AdminCompleteSession handles POST /api/v1/admin/sessions/:id/complete
func (h *SessionHandler) AdminCompleteSession(c *gin.Context) {
	sessionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	session, err := h.sessionService.AdminCompleteSession(uint(sessionID))
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Session marked as completed by admin", session)
}
