package dto 

// TransferCreditsRequest represents a peer-to-peer credit transfer request
type TransferCreditsRequest struct {
	RecipientID uint    `json:"recipient_id" binding:"required"`
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Message     string  `json:"message" binding:"max=500"`
}

// TransferCreditsResponse represents the response after a successful transfer
type TransferCreditsResponse struct {
	SenderID    uint    `json:"sender_id"`
	RecipientID uint    `json:"recipient_id"`
	Amount      float64 `json:"amount"`
	NewBalance  float64 `json:"new_balance"`
	Message     string  `json:"message"`
}