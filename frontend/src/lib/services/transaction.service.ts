import { apiClient } from "@/lib/api";
import type { Transaction } from "@/types";

export interface TransactionHistoryResponse {
    transactions: Transaction[];
    total: number;
    limit: number;
    offset: number;
}

export interface TransferCreditsRequest {
    recipient_id: number;
    amount: number;
    message?: string;
}

export interface TransferCreditsResponse {
    sender_id: number;
    recipient_id: number;
    amount: number;
    new_balance: number;
    message: string;
}

/**
 * Transaction service for handling credit transactions
 */
export const transactionService = {
    /**
     * Get user's transaction history with pagination
     * @param limit - Number of transactions per page (default: 10)
     * @param offset - Pagination offset (default: 0)
     */
    getTransactionHistory: async (
        limit = 10,
        offset = 0
    ): Promise<TransactionHistoryResponse> => {
        return apiClient.get<TransactionHistoryResponse>(
            `/user/transactions?limit=${limit}&offset=${offset}`
        );
    },

    /**
     * Get a specific transaction by ID
     * @param id - Transaction ID
     */
    getTransaction: async (id: number): Promise<Transaction> => {
        return apiClient.get<Transaction>(`/user/transactions/${id}`);
    },

    /**
     * Transfer credits to another user
     * @param recipientId - User ID to transfer credits to
     * @param amount - Amount of credits to transfer
     * @param message - Optional message to recipient
     */
    transferCredits: async (
        recipientId: number,
        amount: number,
        message?: string
    ): Promise<TransferCreditsResponse> => {
        return apiClient.post<TransferCreditsResponse>('/user/transfer', {
            recipient_id: recipientId,
            amount,
            message,
        });
    },

    /**
     * Format transaction type for display
     */
    formatTransactionType: (type: string): string => {
        const typeMap: Record<string, string> = {
            earned: "Earned",
            spent: "Spent",
            bonus: "Bonus",
            refund: "Refunded",
            penalty: "Penalty",
            initial: "Welcome Bonus",
            hold: "On Hold",
        };
        return typeMap[type] || type;
    },

    /**
     * Get color for transaction type
     */
    getTransactionTypeColor: (type: string): string => {
        switch (type) {
            case "earned":
            case "initial":
            case "bonus":
            case "refund":
                return "text-green-600 dark:text-green-400";
            case "spent":
            case "hold":
            case "penalty":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-gray-600 dark:text-gray-400";
        }
    },

    /**
     * Get icon for transaction type
     */
    getTransactionTypeIcon: (type: string): string => {
        switch (type) {
            case "earned":
                return "📈";
            case "spent":
                return "📉";
            case "bonus":
                return "🎁";
            case "refund":
                return "↩️";
            case "penalty":
                return "⚠️";
            case "initial":
                return "🎉";
            case "hold":
                return "⏸️";
            default:
                return "💳";
        }
    },

    /**
     * Format amount for display
     */
    formatAmount: (amount: number): string => {
        const sign = amount > 0 ? "+" : "";
        return `${sign}${amount.toFixed(1)}`;
    },
};
