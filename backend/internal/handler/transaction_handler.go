package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/repository"
)

// TransactionHandler handles transaction-related HTTP requests
type TransactionHandler struct {
	transactionRepo *repository.TransactionRepository
}

// NewTransactionHandler creates a new transaction handler
func NewTransactionHandler(transactionRepo *repository.TransactionRepository) *TransactionHandler {
	return &TransactionHandler{
		transactionRepo: transactionRepo,
	}
}

// GetUserTransactions gets transaction history for the authenticated user
// GET /api/v1/user/transactions
func (h *TransactionHandler) GetUserTransactions(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized",
		})
		return
	}

	// Get pagination parameters
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	// Get transactions
	transactions, total, err := h.transactionRepo.GetUserTransactionHistory(userID.(uint), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch transactions",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Transactions retrieved successfully",
		"data": gin.H{
			"transactions": transactions,
			"total":        total,
			"limit":        limit,
			"offset":       offset,
		},
	})
}

// GetTransactionByID gets a specific transaction by ID
// GET /api/v1/user/transactions/:id
func (h *TransactionHandler) GetTransactionByID(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized",
		})
		return
	}

	// Get transaction ID from URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid transaction ID",
		})
		return
	}

	// Get transaction
	transaction, err := h.transactionRepo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Transaction not found",
		})
		return
	}

	// Verify transaction belongs to user
	if transaction.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "Access denied",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Transaction retrieved successfully",
		"data":    transaction,
	})
}
