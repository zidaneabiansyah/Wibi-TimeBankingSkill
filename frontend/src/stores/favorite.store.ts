import { create } from 'zustand';
import { favoriteService } from '@/lib/services/favorite.service';
import type { Favorite } from '@/types';
import { toast } from 'sonner';

interface FavoriteState {
    favorites: Favorite[];
    total: number;
    isLoading: boolean;
    error: string | null;

    fetchFavorites: (limit?: number, offset?: number) => Promise<void>;
    addFavorite: (teacherId: number) => Promise<void>;
    removeFavorite: (teacherId: number) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
    favorites: [],
    total: 0,
    isLoading: false,
    error: null,

    fetchFavorites: async (limit = 10, offset = 0) => {
        set({ isLoading: true, error: null });
        try {
            const response = await favoriteService.getFavorites(limit, offset);
            if (response.success && response.data) {
                set({ 
                    favorites: offset === 0 ? response.data.favorites : [...get().favorites, ...response.data.favorites], 
                    total: response.data.total 
                });
            } else {
                set({ error: response.message });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch favorites' });
        } finally {
            set({ isLoading: false });
        }
    },

    addFavorite: async (teacherId: number) => {
        try {
            const response = await favoriteService.addFavorite(teacherId);
            if (response.success) {
                toast.success('Added to favorites');
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add favorite');
        }
    },

    removeFavorite: async (teacherId: number) => {
        try {
            const response = await favoriteService.removeFavorite(teacherId);
            if (response.success) {
                set({ 
                    favorites: get().favorites.filter(f => f.teacher_id !== teacherId),
                    total: get().total - 1 
                });
                toast.success('Removed from favorites');
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to remove favorite');
        }
    },
}));
