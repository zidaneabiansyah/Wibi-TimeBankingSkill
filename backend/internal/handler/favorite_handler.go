package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

type FavoriteHandler struct {
	service service.FavoriteService
}

func NewFavoriteHandler(service service.FavoriteService) *FavoriteHandler {
	return &FavoriteHandler{service: service}
}

// AddFavorite godoc
// @Summary Add a teacher to favorites
// @Tags favorites
// @Security Bearer
// @Param teacher_id body uint true "Teacher ID"
// @Success 200 {object} utils.SuccessResponse
// @Router /api/v1/favorites [post]
func (h *FavoriteHandler) AddFavorite(c *gin.Context) {
	var input struct {
		TeacherID uint `json:"teacher_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid input", err)
		return
	}

	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	if userID == input.TeacherID {
		utils.SendError(c, http.StatusBadRequest, "You cannot favorite yourself", nil)
		return
	}

	if err := h.service.AddFavorite(userID, input.TeacherID); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to add favorite", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Added to favorites", nil)
}

// RemoveFavorite godoc
// @Summary Remove a teacher from favorites
// @Tags favorites
// @Security Bearer
// @Param id path uint true "Teacher ID"
// @Success 200 {object} utils.SuccessResponse
// @Router /api/v1/favorites/{id} [delete]
func (h *FavoriteHandler) RemoveFavorite(c *gin.Context) {
	teacherIDStr := c.Param("id")
	teacherID, err := strconv.ParseUint(teacherIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid teacher ID", err)
		return
	}

	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	if err := h.service.RemoveFavorite(userID, uint(teacherID)); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to remove favorite", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Removed from favorites", nil)
}

// GetFavorites godoc
// @Summary Get user's favorite teachers
// @Tags favorites
// @Security Bearer
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} utils.SuccessResponse
// @Router /api/v1/favorites [get]
func (h *FavoriteHandler) GetFavorites(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	favorites, total, err := h.service.GetFavorites(userID, limit, offset)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to get favorites", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Favorites retrieved", gin.H{
		"favorites": favorites,
		"total":     total,
		"limit":     limit,
		"offset":    offset,
	})
}

// CheckFavorite godoc
// @Summary Check if a teacher is favorited
// @Tags favorites
// @Security Bearer
// @Param id path uint true "Teacher ID"
// @Success 200 {object} utils.SuccessResponse
// @Router /api/v1/favorites/check/{id} [get]
func (h *FavoriteHandler) CheckFavorite(c *gin.Context) {
	teacherIDStr := c.Param("id")
	teacherID, err := strconv.ParseUint(teacherIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid teacher ID", err)
		return
	}

	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	isFavorite, err := h.service.IsFavorite(userID, uint(teacherID))
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to check favorite status", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Status checked", gin.H{
		"is_favorite": isFavorite,
	})
}
