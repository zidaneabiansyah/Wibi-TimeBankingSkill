import { useEffect, useRef, useCallback } from 'react';
import { useWhiteboardStore } from '@/stores/whiteboard.store';
import type { DrawingStroke } from '@/types';

interface WhiteboardMessage {
    type: 'update' | 'clear' | 'user_join' | 'user_leave' | 'cursor';
    session_id: number;
    user_id: number;
    user_name: string;
    data?: any; // tldraw record/delta
    cursor?: { x: number; y: number };
    timestamp: number;
}

interface UseWhiteboardWebSocketProps {
    sessionId: number;
    enabled?: boolean;
    onUpdate?: (data: any) => void;
    onClear?: () => void;
}

/**
 * Hook for WebSocket connection to whiteboard
 * Handles real-time drawing synchronization
 */
export function useWhiteboardWebSocket({ 
    sessionId, 
    enabled = true,
    onUpdate,
    onClear
}: UseWhiteboardWebSocketProps) {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000; // 3 seconds

    const { addStroke, clearStrokes } = useWhiteboardStore();

    // Connect to WebSocket
    const connect = useCallback(function connectWebSocket() {
        if (!enabled || !sessionId) return;

        try {
            const token = localStorage.getItem('token');
            const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8080/api/v1'}/ws/whiteboard/${sessionId}?token=${token}`;

            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('✅ WebSocket connected to whiteboard session', sessionId);
                reconnectAttemptsRef.current = 0;
            };

            ws.onmessage = (event) => {
                try {
                    const message: WhiteboardMessage = JSON.parse(event.data);

                    switch (message.type) {
                        case 'update':
                            if (message.data && onUpdate) {
                                onUpdate(message.data);
                            }
                            break;
                        case 'clear':
                            if (onClear) onClear();
                            break;

                        case 'user_join':
                            console.log(`👤 ${message.user_name} joined the whiteboard`);
                            break;

                        case 'user_leave':
                            console.log(`👤 ${message.user_name} left the whiteboard`);
                            break;

                        case 'cursor':
                            // Handle cursor position (for future implementation)
                            break;

                        default:
                            console.warn('Unknown message type:', message.type);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('❌ WebSocket disconnected');
                wsRef.current = null;

                // Attempt to reconnect
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectDelay);
                } else {
                    console.error('Max reconnection attempts reached');
                }
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
        }
    }, [sessionId, enabled, onUpdate, onClear]);

    // Send update event (tldraw delta)
    const sendUpdate = useCallback((data: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const message: Partial<WhiteboardMessage> = {
                type: 'update',
                session_id: sessionId,
                data,
                timestamp: Date.now(),
            };
            wsRef.current.send(JSON.stringify(message));
        }
    }, [sessionId]);

    // Send clear event
    const sendClear = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const message: Partial<WhiteboardMessage> = {
                type: 'clear',
                session_id: sessionId,
                timestamp: Date.now(),
            };
            wsRef.current.send(JSON.stringify(message));
        }
    }, [sessionId]);

    // Send cursor position
    const sendCursor = useCallback((x: number, y: number) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const message: WhiteboardMessage = {
                type: 'cursor',
                session_id: sessionId,
                user_id: 0,
                user_name: '',
                cursor: { x, y },
                timestamp: Date.now(),
            };

            try {
                wsRef.current.send(JSON.stringify(message));
            } catch (error) {
                console.error('Failed to send cursor:', error);
            }
        }
    }, [sessionId]);

    // Get connection status
    const isConnected = wsRef.current?.readyState === WebSocket.OPEN;

    // Connect on mount, disconnect on unmount
    useEffect(() => {
        if (enabled) {
            connect();
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [enabled, connect]);

    return {
        isConnected,
        sendUpdate,
        sendClear,
        sendCursor,
    };
}
