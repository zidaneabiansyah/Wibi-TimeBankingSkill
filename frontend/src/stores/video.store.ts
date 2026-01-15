'use client';

import { create } from 'zustand';
import { VideoSessionResponse } from '@/types';

interface VideoStore {
    // State
    currentSession: VideoSessionResponse | null;
    videoHistory: VideoSessionResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions
    setCurrentSession: (session: VideoSessionResponse | null) => void;
    setVideoHistory: (history: VideoSessionResponse[]) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addToHistory: (session: VideoSessionResponse) => void;
    clearCurrentSession: () => void;
    clearError: () => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
    // Initial state
    currentSession: null,
    videoHistory: [],
    isLoading: false,
    error: null,

    // Actions
    setCurrentSession: (session) => set({ currentSession: session }),
    setVideoHistory: (history) => set({ videoHistory: history }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    addToHistory: (session) =>
        set((state) => ({
            videoHistory: [session, ...state.videoHistory],
        })),
    clearCurrentSession: () => set({ currentSession: null }),
    clearError: () => set({ error: null }),
}));
