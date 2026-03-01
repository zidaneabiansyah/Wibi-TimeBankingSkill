package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/utils"
)

// ExportAnalytics handles report export requests
// POST /api/v1/analytics/export
func (h *AnalyticsHandler) ExportAnalytics(c *gin.Context) {
	var req dto.ExportAnalyticsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request format", err)
		return
	}

	// Validate format
	if req.Format != "csv" && req.Format != "pdf" {
		utils.SendError(c, http.StatusBadRequest, "Unsupported format. Use 'csv' or 'pdf'", nil)
		return
	}

	content, filename, err := h.service.ExportAnalytics(req)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to generate report", err)
		return
	}

	// Set headers for file download
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "application/octet-stream")
	switch req.Format {
	case "pdf":
		c.Header("Content-Type", "application/pdf")
	case "csv":
		c.Header("Content-Type", "text/csv")
	}

	c.Data(http.StatusOK, c.Writer.Header().Get("Content-Type"), content)
}
