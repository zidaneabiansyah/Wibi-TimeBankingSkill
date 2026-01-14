package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

type TemplateHandler struct {
	service service.TemplateService
}

func NewTemplateHandler(service service.TemplateService) *TemplateHandler {
	return &TemplateHandler{service: service}
}

// CreateTemplate godoc
// @Summary Create a session template
// @Tags templates
// @Security Bearer
// @Param template body models.SessionTemplate true "Template"
// @Success 201 {object} utils.SuccessResponse
// @Router /api/v1/templates [post]
func (h *TemplateHandler) CreateTemplate(c *gin.Context) {
	var template models.SessionTemplate
	if err := c.ShouldBindJSON(&template); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid input", err)
		return
	}

	userID := c.MustGet("userID").(uint)
	template.UserID = userID

	if err := h.service.CreateTemplate(&template); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to create template", err)
		return
	}

	utils.SendSuccess(c, http.StatusCreated, "Template created successfully", template)
}

// GetUserTemplates godoc
// @Summary Get all user's session templates
// @Tags templates
// @Security Bearer
// @Success 200 {object} utils.SuccessResponse
// @Router /api/v1/templates [get]
func (h *TemplateHandler) GetUserTemplates(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	templates, err := h.service.GetUserTemplates(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to get templates", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Templates retrieved", templates)
}

// UpdateTemplate godoc
// @Summary Update a session template
// @Tags templates
// @Security Bearer
// @Param id path uint true "Template ID"
// @Param template body models.SessionTemplate true "Template"
// @Success 200 {object} utils.SuccessResponse
// @Router /api/v1/templates/{id} [put]
func (h *TemplateHandler) UpdateTemplate(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)

	var input models.SessionTemplate
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid input", err)
		return
	}

	userID := c.MustGet("userID").(uint)
	
	existing, err := h.service.GetTemplateByID(uint(id))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Template not found", err)
		return
	}

	if existing.UserID != userID {
		utils.SendError(c, http.StatusForbidden, "Unauthorized", nil)
		return
	}

	input.ID = uint(id)
	input.UserID = userID

	if err := h.service.UpdateTemplate(&input); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to update template", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Template updated successfully", input)
}

// DeleteTemplate godoc
// @Summary Delete a session template
// @Tags templates
// @Security Bearer
// @Param id path uint true "Template ID"
// @Success 200 {object} utils.SuccessResponse
// @Router /api/v1/templates/{id} [delete]
func (h *TemplateHandler) DeleteTemplate(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.ParseUint(idStr, 10, 32)
	userID := c.MustGet("userID").(uint)

	if err := h.service.DeleteTemplate(uint(id), userID); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to delete template", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Template deleted successfully", nil)
}
