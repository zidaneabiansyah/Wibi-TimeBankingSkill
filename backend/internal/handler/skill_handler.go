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

type SkillHandler struct {
	skillService *service.SkillService
}

func NewSkillHandler(skillService *service.SkillService) *SkillHandler {
	return &SkillHandler{
		skillService: skillService,
	}
}

// GetSkills handles GET /api/v1/skills
// @Summary List all skills with filters
// @Description Get a list of skills with pagination, search, category, rating, and location filters.
// @Tags skills
// @Accept json
// @Produce json
// @Param limit query int false "Limit (default 10)"
// @Param page query int false "Page (default 1)"
// @Param category query string false "Category filter"
// @Param search query string false "Search query"
// @Param day query int false "Available day filter (0-6)"
// @Param rating query number false "Minimum rating filter"
// @Param location query string false "Location filter"
// @Param sort query string false "Sort by (popular, rating, newest)"
// @Success 200 {object} utils.SuccessResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /skills [get]
func (h *SkillHandler) GetSkills(c *gin.Context) {
	// Parse query parameters
	limitStr := c.DefaultQuery("limit", "10")
	pageStr := c.DefaultQuery("page", "1")
	category := c.Query("category")
	search := c.Query("search")
	dayStr := c.Query("day")
	ratingStr := c.Query("rating")
	location := c.Query("location")
	sortBy := c.DefaultQuery("sort", "newest")

	var dayOfWeek *int
	if dayStr != "" {
		day, err := strconv.Atoi(dayStr)
		if err == nil && day >= 0 && day <= 6 {
			dayOfWeek = &day
		}
	}

	var minRating *float64
	if ratingStr != "" {
		r, err := strconv.ParseFloat(ratingStr, 64)
		if err == nil {
			minRating = &r
		}
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 || limit > 100 {
		limit = 10
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page <= 0 {
		page = 1
	}

	offset := (page - 1) * limit

	// Try to get from cache if no search/filter
	cache := utils.GetCache()
	if search == "" && category == "" && dayOfWeek == nil && minRating == nil && location == "" && sortBy == "newest" && page == 1 {
		if cached, found := cache.Get(utils.CacheKeySkills); found {
			utils.SendSuccess(c, http.StatusOK, "Skills retrieved from cache", cached)
			return
		}
	}

	// Get skills from service
	skills, total, err := h.skillService.GetAllSkills(limit, offset, category, search, dayOfWeek, minRating, location, sortBy)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Convert to response DTOs
	skillResponses := make([]dto.SkillResponse, len(skills))
	for i, skill := range skills {
		skillResponses[i] = dto.ToSkillResponse(&skill)
	}

	response := dto.SkillListResponse{
		Skills: skillResponses,
		Total:  total,
		Page:   page,
		Limit:  limit,
	}

	// Cache response if no search/filter and page 1
	if search == "" && category == "" && page == 1 {
		cache.Set(utils.CacheKeySkills, response)
	}

	utils.SendSuccess(c, http.StatusOK, "Skills retrieved successfully", response)
}

// GetSkillByID handles GET /api/v1/skills/:id
// @Summary Get skill by ID
// @Description Get detailed information about a specific skill.
// @Tags skills
// @Accept json
// @Produce json
// @Param id path int true "Skill ID"
// @Success 200 {object} utils.SuccessResponse
// @Failure 404 {object} utils.ErrorResponse
// @Router /skills/{id} [get]
func (h *SkillHandler) GetSkillByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	skill, err := h.skillService.GetSkillByID(uint(id))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	response := dto.ToSkillResponse(skill)
	utils.SendSuccess(c, http.StatusOK, "Skill retrieved successfully", response)
}

// GetRecommendedSkills handles GET /api/v1/skills/recommended
func (h *SkillHandler) GetRecommendedSkills(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 || limit > 20 {
		limit = 5
	}

	// Try to get from cache
	cache := utils.GetCache()
	cacheKey := utils.CacheKeySkills + ":recommended:" + strconv.Itoa(limit)
	if cached, found := cache.Get(cacheKey); found {
		utils.SendSuccess(c, http.StatusOK, "Recommendations retrieved from cache", cached)
		return
	}

	skills, err := h.skillService.GetRecommendedSkills(limit)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Convert to response DTOs
	skillResponses := make([]dto.SkillResponse, len(skills))
	for i, skill := range skills {
		skillResponses[i] = dto.ToSkillResponse(&skill)
	}

	// Cache recommendations
	cache.Set(cacheKey, skillResponses)

	utils.SendSuccess(c, http.StatusOK, "Recommendations retrieved successfully", skillResponses)
}

// GetSkillTeachers handles GET /api/v1/skills/:id/teachers
func (h *SkillHandler) GetSkillTeachers(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	teachers, err := h.skillService.GetSkillTeachers(uint(id))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Convert to response DTOs
	responses := make([]dto.UserSkillResponse, len(teachers))
	for i, t := range teachers {
		responses[i] = dto.ToUserSkillResponse(&t)
	}

	utils.SendSuccess(c, http.StatusOK, "Teachers retrieved successfully", responses)
}

// GetUserSkillByID handles GET /api/v1/skills/user-skills/:id
func (h *SkillHandler) GetUserSkillByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid user skill ID", err)
		return
	}

	userSkill, err := h.skillService.GetUserSkillByID(uint(id))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	response := dto.ToUserSkillResponse(userSkill)
	utils.SendSuccess(c, http.StatusOK, "User skill retrieved successfully", response)
}

// CreateSkill handles POST /api/v1/skills (admin only)
func (h *SkillHandler) CreateSkill(c *gin.Context) {
	var req dto.CreateSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	skill := &models.Skill{
		Name:        req.Name,
		Category:    models.SkillCategory(req.Category),
		Description: req.Description,
		Icon:        req.Icon,
	}

	err := h.skillService.CreateSkill(skill)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	response := dto.ToSkillResponse(skill)
	utils.SendSuccess(c, http.StatusCreated, "Skill created successfully", response)
}

// UpdateSkill handles PUT /api/v1/skills/:id (admin only)
func (h *SkillHandler) UpdateSkill(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	var req dto.UpdateSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	updates := &models.Skill{
		Name:        req.Name,
		Category:    models.SkillCategory(req.Category),
		Description: req.Description,
		Icon:        req.Icon,
	}

	err = h.skillService.UpdateSkill(uint(id), updates)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Get updated skill
	updatedSkill, _ := h.skillService.GetSkillByID(uint(id))
	response := dto.ToSkillResponse(updatedSkill)
	utils.SendSuccess(c, http.StatusOK, "Skill updated successfully", response)
}

// DeleteSkill handles DELETE /api/v1/skills/:id (admin only)
func (h *SkillHandler) DeleteSkill(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	err = h.skillService.DeleteSkill(uint(id))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Skill deleted successfully", nil)
}

// User Skills Handlers

// AddUserSkill handles POST /api/v1/user/skills
func (h *SkillHandler) AddUserSkill(c *gin.Context) {
	// Get user ID from JWT
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.CreateUserSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	userSkill := &models.UserSkill{
		SkillID:           req.SkillID,
		Level:             models.SkillLevel(req.Level),
		Description:       req.Description,
		YearsOfExperience: req.YearsOfExperience,
		ProofURL:          req.ProofURL,
		ProofType:         req.ProofType,
		HourlyRate:        req.HourlyRate,
		OnlineOnly:        req.OnlineOnly,
		OfflineOnly:       req.OfflineOnly,
		IsAvailable:       req.IsAvailable,
	}

	err := h.skillService.AddUserSkill(userID.(uint), userSkill)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Get created user skill with skill details
	createdSkill, _ := h.skillService.GetUserSkills(userID.(uint))
	var response dto.UserSkillResponse
	for _, us := range createdSkill {
		if us.SkillID == req.SkillID {
			response = dto.ToUserSkillResponse(&us)
			break
		}
	}

	utils.SendSuccess(c, http.StatusCreated, "Skill added successfully", response)
}

// GetUserSkills handles GET /api/v1/user/skills
func (h *SkillHandler) GetUserSkills(c *gin.Context) {
	// Get user ID from JWT
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	userSkills, err := h.skillService.GetUserSkills(userID.(uint))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Convert to response DTOs
	responses := make([]dto.UserSkillResponse, len(userSkills))
	for i, userSkill := range userSkills {
		responses[i] = dto.ToUserSkillResponse(&userSkill)
	}

	utils.SendSuccess(c, http.StatusOK, "User skills retrieved successfully", responses)
}

// UpdateUserSkill handles PUT /api/v1/user/skills/:skillId
func (h *SkillHandler) UpdateUserSkill(c *gin.Context) {
	// Get user ID from JWT
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	skillIDStr := c.Param("skillId")
	skillID, err := strconv.ParseUint(skillIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	var req dto.UpdateUserSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	updates := &models.UserSkill{
		Level:             models.SkillLevel(req.Level),
		Description:       req.Description,
		YearsOfExperience: req.YearsOfExperience,
		ProofURL:          req.ProofURL,
		ProofType:         req.ProofType,
		HourlyRate:        req.HourlyRate,
		OnlineOnly:        req.OnlineOnly,
		OfflineOnly:       req.OfflineOnly,
	}

	if req.IsAvailable != nil {
		updates.IsAvailable = *req.IsAvailable
	}

	err = h.skillService.UpdateUserSkill(userID.(uint), uint(skillID), updates)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Get updated user skill
	userSkills, _ := h.skillService.GetUserSkills(userID.(uint))
	var response dto.UserSkillResponse
	for _, us := range userSkills {
		if us.SkillID == uint(skillID) {
			response = dto.ToUserSkillResponse(&us)
			break
		}
	}

	utils.SendSuccess(c, http.StatusOK, "Skill updated successfully", response)
}

// DeleteUserSkill handles DELETE /api/v1/user/skills/:skillId
func (h *SkillHandler) DeleteUserSkill(c *gin.Context) {
	// Get user ID from JWT
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	skillIDStr := c.Param("skillId")
	skillID, err := strconv.ParseUint(skillIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	err = h.skillService.DeleteUserSkill(userID.(uint), uint(skillID))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Skill removed successfully", nil)
}

// Learning Skills Handlers

// AddLearningSkill handles POST /api/v1/user/learning-skills
func (h *SkillHandler) AddLearningSkill(c *gin.Context) {
	// Get user ID from JWT
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	var req dto.CreateLearningSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	learningSkill := &models.LearningSkill{
		SkillID:      req.SkillID,
		DesiredLevel: models.SkillLevel(req.DesiredLevel),
		Priority:     req.Priority,
		Notes:        req.Notes,
	}

	err := h.skillService.AddLearningSkill(userID.(uint), learningSkill)
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Get created learning skill with skill details
	createdSkills, _ := h.skillService.GetLearningSkills(userID.(uint))
	var response dto.LearningSkillResponse
	for _, ls := range createdSkills {
		if ls.SkillID == req.SkillID {
			response = dto.ToLearningSkillResponse(&ls)
			break
		}
	}

	utils.SendSuccess(c, http.StatusCreated, "Learning skill added successfully", response)
}

// GetLearningSkills handles GET /api/v1/user/learning-skills
func (h *SkillHandler) GetLearningSkills(c *gin.Context) {
	// Get user ID from JWT
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	learningSkills, err := h.skillService.GetLearningSkills(userID.(uint))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	// Convert to response DTOs
	responses := make([]dto.LearningSkillResponse, len(learningSkills))
	for i, learningSkill := range learningSkills {
		responses[i] = dto.ToLearningSkillResponse(&learningSkill)
	}

	utils.SendSuccess(c, http.StatusOK, "Learning skills retrieved successfully", responses)
}

// DeleteLearningSkill handles DELETE /api/v1/user/learning-skills/:skillId
func (h *SkillHandler) DeleteLearningSkill(c *gin.Context) {
	// Get user ID from JWT
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "User not authenticated", nil)
		return
	}

	skillIDStr := c.Param("skillId")
	skillID, err := strconv.ParseUint(skillIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	err = h.skillService.DeleteLearningSkill(userID.(uint), uint(skillID))
	if err != nil {
		utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Learning skill removed successfully", nil)
}
