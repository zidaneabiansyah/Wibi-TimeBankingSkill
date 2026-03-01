package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// EndorsementHandler handles donation HTTP requests
type EndorsementHandler struct {
	endorsementService *service.EndorsementService
}

// NewEndorsementHandler creates a new endorsement handler
func NewEndorsementHandler(endorsementService *service.EndorsementService) *EndorsementHandler {
	return &EndorsementHandler{endorsementService: endorsementService}
}

// GetAllDonations returns all donations (public, no auth required)
func (h *EndorsementHandler) GetAllDonations(c *gin.Context) {
	limit := 10
	offset := 0

	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}
	if o := c.Query("offset"); o != "" {
		if parsed, err := strconv.Atoi(o); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	donations, total, err := h.endorsementService.GetAllDonations(limit, offset)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch donations", err)
		return
	}

	// Mask donor info for anonymous donations
	type DonationResponse struct {
		ID          uint        `json:"id"`
		DonorID     interface{} `json:"donor_id"`
		Donor       interface{} `json:"donor"`
		Amount      float64     `json:"amount"`
		Message     string      `json:"message"`
		IsAnonymous bool        `json:"is_anonymous"`
		CreatedAt   interface{} `json:"created_at"`
	}

	resp := make([]DonationResponse, 0, len(donations))
	for _, d := range donations {
		entry := DonationResponse{
			ID:          d.ID,
			Amount:      d.Amount,
			Message:     d.Message,
			IsAnonymous: d.IsAnonymous,
			CreatedAt:   d.CreatedAt,
		}
		if d.IsAnonymous {
			entry.DonorID = nil
			entry.Donor = nil
		} else {
			entry.DonorID = d.DonorID
			entry.Donor = d.Donor
		}
		resp = append(resp, entry)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Donations fetched successfully",
		"data": gin.H{
			"endorsements": resp,
			"total":        total,
			"limit":        limit,
			"offset":       offset,
		},
	})
}

// GetTotalDonationAmount returns the total donation amount in Rupiah
func (h *EndorsementHandler) GetTotalDonationAmount(c *gin.Context) {
	total, err := h.endorsementService.GetTotalAmount()
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to get total", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Total fetched", gin.H{
		"total_amount": total,
	})
}

// CreateEndorsement creates a new donation (requires auth)
func (h *EndorsementHandler) CreateEndorsement(c *gin.Context) {
	donorID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req dto.CreateEndorsementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request", err)
		return
	}

	donation, err := h.endorsementService.CreateEndorsement(donorID.(uint), &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	utils.SendSuccess(c, http.StatusCreated, "Donation created successfully", donation)
}

// DeleteEndorsement deletes a donation (requires auth, self only)
func (h *EndorsementHandler) DeleteEndorsement(c *gin.Context) {
	donorID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	donationID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid donation ID", err)
		return
	}

	if err := h.endorsementService.DeleteEndorsement(uint(donationID), donorID.(uint)); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Donation deleted successfully", nil)
}

// GetEndorsementsForUser - kept for backward compat, returns all donations
func (h *EndorsementHandler) GetEndorsementsForUser(c *gin.Context) {
	h.GetAllDonations(c)
}

// GetEndorsementsForSkill - kept for backward compat
func (h *EndorsementHandler) GetEndorsementsForSkill(c *gin.Context) {
	h.GetAllDonations(c)
}

// GetEndorsementCount - kept for backward compat
func (h *EndorsementHandler) GetEndorsementCount(c *gin.Context) {
	h.GetAllDonations(c)
}

// GetTopEndorsedSkills - returns top donors by total amount
func (h *EndorsementHandler) GetTopEndorsedSkills(c *gin.Context) {
	limit := 5
	if l := c.Query("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}

	donors, err := h.endorsementService.GetTopEndorsedSkills(limit)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch top donors", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Top donors fetched successfully", donors)
}

// GetUserReputation - kept for backward compat
func (h *EndorsementHandler) GetUserReputation(c *gin.Context) {
	total, err := h.endorsementService.GetTotalAmount()
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed", err)
		return
	}
	utils.SendSuccess(c, http.StatusOK, "Total fetched", gin.H{"total_amount": total})
}
