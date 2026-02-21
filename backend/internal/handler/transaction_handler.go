package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/pkg/errors"
	"github.com/timebankingskill/backend/pkg/response"
)

// TransactionHandler handles transaction-related HTTP requests
type TransactionHandler struct {
	transactionService *service.TransactionService
}

// NewTransactionHandler creates a new transaction handler
func NewTransactionHandler(transactionService *service.TransactionService) *TransactionHandler {
	return &TransactionHandler{
		transactionService: transactionService,
	}
}

// GetUserTransactions retrieves transaction history for the authenticated user
func (h *TransactionHandler) GetUserTransactions(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	transactions, total, err := h.transactionService.GetUserTransactionHistory(userID.(uint), limit, offset)
	if err != nil {
		response.Error(c, err)
		return
	}

	res := gin.H{
		"transactions": transactions,
		"total":        total,
		"limit":        limit,
		"offset":       offset,
	}

	response.OK(c, "Transactions retrieved successfully", res)
}

// GetTransactionByID retrieves a specific transaction by ID
func (h *TransactionHandler) GetTransactionByID(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid transaction ID")
		return
	}

	transaction, err := h.transactionService.GetTransaction(uint(id))
	if err != nil {
		response.Error(c, err)
		return
	}

	if transaction.UserID != userID.(uint) {
		response.Error(c, errors.ErrForbidden)
		return
	}

	response.OK(c, "Transaction retrieved successfully", transaction)
}

// TransferCredits handles peer-to-peer credit transfers
func (h *TransactionHandler) TransferCredits(c *gin.Context) {
	senderID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	var req dto.TransferCreditsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request body: "+err.Error())
		return
	}

	if req.Amount <= 0 {
		response.ValidationError(c, "Transfer amount must be positive")
		return
	}

	err := h.transactionService.DirectTransfer(
		senderID.(uint),
		req.RecipientID,
		req.Amount,
		req.Message,
	)

	if err != nil {
		errMsg := err.Error()
		
		if len(errMsg) >= 20 && errMsg[:20] == "insufficient credits" {
			response.Error(c, errors.ErrBadRequest.WithDetails(errMsg))
			return
		}
		if errMsg == "recipient not found" || errMsg == "recipient account is not active" {
			response.Error(c, errors.ErrNotFound.WithDetails(errMsg))
			return
		}
		if errMsg == "cannot transfer credits to yourself" {
			response.Error(c, errors.ErrBadRequest.WithDetails(errMsg))
			return
		}
		
		response.Error(c, err)
		return
	}

	newBalance, _ := h.transactionService.GetUserBalance(senderID.(uint))

	res := dto.TransferCreditsResponse{
		SenderID:    senderID.(uint),
		RecipientID: req.RecipientID,
		Amount:      req.Amount,
		NewBalance:  newBalance,
		Message:     "Credits transferred successfully",
	}

	response.OK(c, "Credits transferred successfully", res)
}