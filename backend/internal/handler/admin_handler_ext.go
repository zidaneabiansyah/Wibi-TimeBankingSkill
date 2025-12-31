package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/utils"
)

// GetAllUsers gets all users (admin only)
// GET /api/v1/admin/users
func (h *AdminHandler) GetAllUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	filter := c.Query("filter") // status filter

	users, total, err := h.adminService.GetAllUsers(page, limit, search, filter)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch users", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Users retrieved successfully", gin.H{
		"data":  users,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetAllSessions gets all sessions (admin only)
// GET /api/v1/admin/sessions
func (h *AdminHandler) GetAllSessions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	filter := c.Query("filter") // status filter

	sessions, total, err := h.adminService.GetAllSessions(page, limit, search, filter)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch sessions", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Sessions retrieved successfully", gin.H{
		"data":  sessions,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}
