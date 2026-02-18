import { create } from 'zustand';
import { transactionService, type TransferCreditsResponse } from '@/lib/services/transaction.service';
import type { Transaction } from '@/types';

interface TransactionHistoryResponse {
    transactions: Transaction[];
    total: number;
    limit: number;
    offset: number;
}

interface TransactionState {
    // State
    transactions: Transaction[];
    total: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchTransactions: (limit?: number, offset?: number) => Promise<void>;
    transferCredits: (recipientId: number, amount: number, message?: string) => Promise<TransferCreditsResponse>;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    transactions: [],
    total: 0,
    isLoading: false,
    error: null,
};

/**
 * Transaction store for managing credit transaction history
 */
export const useTransactionStore = create<TransactionState>((set) => ({
    ...initialState,

    /**
     * Fetch transaction history with pagination
     */
    fetchTransactions: async (limit = 10, offset = 0) => {
        set({ isLoading: true, error: null });
        try {
            const response = await transactionService.getTransactionHistory(limit, offset);
            set({
                transactions: response.transactions,
                total: response.total,
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to fetch transactions';
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    /**
     * Transfer credits to another user
     */
    transferCredits: async (recipientId: number, amount: number, message?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await transactionService.transferCredits(recipientId, amount, message);
            set({ isLoading: false });
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to transfer credits';
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    /**
     * Clear error message
     */
    clearError: () => set({ error: null }),

    /**
     * Reset to initial state
     */
    reset: () => set(initialState),
}));

export default useTransactionStore;
