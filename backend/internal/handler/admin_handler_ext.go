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

// GetAllTransactions gets all transactions (admin only)
// GET /api/v1/admin/transactions
func (h *AdminHandler) GetAllTransactions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	typeFilter := c.Query("type")

	transactions, total, err := h.adminService.GetAllTransactions(page, limit, typeFilter, search)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch transactions", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Transactions retrieved successfully", gin.H{
		"data":  transactions,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetAllSkills gets all skills (admin only)
// GET /api/v1/admin/skills
func (h *AdminHandler) GetAllSkills(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	category := c.Query("category")

	skills, total, err := h.adminService.GetAllSkills(page, limit, category, search)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch skills", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Skills retrieved successfully", gin.H{
		"data":  skills,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetAllReports gets all reports
// GET /api/v1/admin/reports
func (h *AdminHandler) GetAllReports(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")
	status := c.Query("status")

	reports, total, err := h.adminService.GetAllReports(page, limit, status, search)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch reports", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Reports retrieved successfully", gin.H{
		"data":  reports,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// GetAllForumThreads gets all forum threads (admin)
// GET /api/v1/admin/forum/threads
func (h *AdminHandler) GetAllForumThreads(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")

	threads, total, err := h.adminService.GetAllForumThreads(page, limit, search)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch threads", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Threads retrieved successfully", gin.H{
		"data":  threads,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// SuspendUser suspends a user
// POST /api/v1/admin/users/:id/suspend
func (h *AdminHandler) SuspendUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	if err := h.adminService.SuspendUser(uint(id)); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to suspend user", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "User suspended successfully", nil)
}

// ActivateUser activates a user
// POST /api/v1/admin/users/:id/activate
func (h *AdminHandler) ActivateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	if err := h.adminService.ActivateUser(uint(id)); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to activate user", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "User activated successfully", nil)
}
