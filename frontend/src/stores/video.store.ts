'use client';

import { create } from 'zustand';
import { VideoSessionResponse } from '@/types';

interface VideoStore {
    // State
    currentSession: VideoSessionResponse | null;
    videoHistory: VideoSessionResponse[];
    isLoading: boolean;
    error: string | null;
    jitsiToken: string | null;
    jitsiUrl: string | null;

    // Actions
    setCurrentSession: (session: VideoSessionResponse | null) => void;
    setVideoHistory: (history: VideoSessionResponse[]) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setJitsiToken: (token: string) => void;
    setJitsiUrl: (url: string) => void;
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
    jitsiToken: null,
    jitsiUrl: null,

    // Actions
    setCurrentSession: (session) => set({ currentSession: session }),
    setVideoHistory: (history) => set({ videoHistory: history }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setJitsiToken: (token) => set({ jitsiToken: token }),
    setJitsiUrl: (url) => set({ jitsiUrl: url }),
    addToHistory: (session) =>
        set((state) => ({
            videoHistory: [session, ...state.videoHistory],
        })),
    clearCurrentSession: () => set({ currentSession: null, jitsiToken: null, jitsiUrl: null }),
    clearError: () => set({ error: null }),
}));
