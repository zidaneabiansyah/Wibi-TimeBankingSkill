'use client';

import { create } from 'zustand';
import type { DrawingStroke, Whiteboard } from '@/types';

interface WhiteboardStore {
    // State
    whiteboard: Whiteboard | null;
    strokes: DrawingStroke[];
    isLoading: boolean;
    error: string | null;
    currentTool: 'pen' | 'eraser' | 'line' | 'rect' | 'circle' | 'text';
    currentColor: string;
    currentThickness: number;
    undoStack: DrawingStroke[][];
    redoStack: DrawingStroke[][];

    // Actions
    setWhiteboard: (whiteboard: Whiteboard | null) => void;
    setStrokes: (strokes: DrawingStroke[]) => void;
    addStroke: (stroke: DrawingStroke) => void;
    removeStroke: (strokeId: string) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCurrentTool: (tool: 'pen' | 'eraser' | 'line' | 'rect' | 'circle' | 'text') => void;
    setCurrentColor: (color: string) => void;
    setCurrentThickness: (thickness: number) => void;
    clearStrokes: () => void;
    undo: () => void;
    redo: () => void;
    clearError: () => void;
}

export const useWhiteboardStore = create<WhiteboardStore>((set) => ({
    // Initial state
    whiteboard: null,
    strokes: [],
    isLoading: false,
    error: null,
    currentTool: 'pen',
    currentColor: '#000000',
    currentThickness: 2,
    undoStack: [],
    redoStack: [],

    // Actions
    setWhiteboard: (whiteboard) => set({ whiteboard }),
    setStrokes: (strokes) => set({ strokes }),
    addStroke: (stroke) =>
        set((state) => ({
            strokes: [...state.strokes, stroke],
            undoStack: [...state.undoStack, state.strokes],
            redoStack: [],
        })),
    removeStroke: (strokeId) =>
        set((state) => ({
            strokes: state.strokes.filter((s) => s.id !== strokeId),
        })),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setCurrentTool: (tool) => set({ currentTool: tool }),
    setCurrentColor: (color) => set({ currentColor: color }),
    setCurrentThickness: (thickness) => set({ currentThickness: thickness }),
    clearStrokes: () =>
        set((state) => ({
            strokes: [],
            undoStack: [...state.undoStack, state.strokes],
            redoStack: [],
        })),
    undo: () =>
        set((state) => {
            if (state.undoStack.length === 0) return state;
            const newUndoStack = [...state.undoStack];
            const previousStrokes = newUndoStack.pop() || [];
            return {
                strokes: previousStrokes,
                undoStack: newUndoStack,
                redoStack: [...state.redoStack, state.strokes],
            };
        }),
    redo: () =>
        set((state) => {
            if (state.redoStack.length === 0) return state;
            const newRedoStack = [...state.redoStack];
            const nextStrokes = newRedoStack.pop() || [];
            return {
                strokes: nextStrokes,
                redoStack: newRedoStack,
                undoStack: [...state.undoStack, state.strokes],
            };
        }),
    clearError: () => set({ error: null }),
}));
