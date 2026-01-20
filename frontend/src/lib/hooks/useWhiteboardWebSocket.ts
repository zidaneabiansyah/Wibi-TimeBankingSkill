import { useEffect, useRef, useCallback } from 'react';
import { useWhiteboardStore } from '@/stores/whiteboard.store';

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
    const isConnectingRef = useRef(false);
    const isCleanedUpRef = useRef(false);
    
    // Store callbacks in refs to avoid dependency issues
    const onUpdateRef = useRef(onUpdate);
    const onClearRef = useRef(onClear);
    
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    const { addStroke, clearStrokes } = useWhiteboardStore();

    // Keep callback refs in sync
    useEffect(() => {
        onUpdateRef.current = onUpdate;
        onClearRef.current = onClear;
    }, [onUpdate, onClear]);

    // Main connection effect - only depends on sessionId and enabled
    useEffect(() => {
        if (!enabled || !sessionId) return;
        
        // Prevent multiple connections
        if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }
        
        isConnectingRef.current = true;
        isCleanedUpRef.current = false;

        const connect = () => {
            if (isCleanedUpRef.current) return;
            
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('❌ No token found for whiteboard WebSocket');
                    isConnectingRef.current = false;
                    return;
                }
                
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
                const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
                
                const baseWsUrl = apiUrl.startsWith('http') 
                    ? apiUrl.replace(/^http/, 'ws') 
                    : `${wsProtocol}://${window.location.host}${apiUrl}`;
                
                const wsUrl = `${baseWsUrl}/ws/whiteboard/${sessionId}?token=${encodeURIComponent(token)}`;

                console.log('🔌 Connecting to Whiteboard WS:', wsUrl.split('?')[0]);
                const ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    console.log('✅ Whiteboard WebSocket connected to session', sessionId);
                    reconnectAttemptsRef.current = 0;
                    isConnectingRef.current = false;
                };

                ws.onmessage = (event) => {
                    if (isCleanedUpRef.current) return;
                    
                    try {
                        const message: WhiteboardMessage = JSON.parse(event.data);

                        switch (message.type) {
                            case 'update':
                                if (message.data && onUpdateRef.current) {
                                    onUpdateRef.current(message.data);
                                }
                                break;
                            case 'clear':
                                if (onClearRef.current) onClearRef.current();
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

                ws.onerror = () => {
                    // Only log as warning since this often happens during navigation or React Strict Mode remount
                    if (!isCleanedUpRef.current) {
                        console.warn('⚠️ Whiteboard WebSocket error - ReadyState:', ws.readyState);
                    }
                    isConnectingRef.current = false;
                };

                ws.onclose = (event) => {
                    console.log('⚠️ Whiteboard WebSocket disconnected:', {
                        code: event.code,
                        reason: event.reason || 'No reason provided',
                        wasClean: event.wasClean
                    });
                    
                    wsRef.current = null;
                    isConnectingRef.current = false;

                    // Only attempt to reconnect if not cleaned up
                    if (!isCleanedUpRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
                        reconnectAttemptsRef.current++;
                        console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
                        reconnectTimeoutRef.current = setTimeout(() => {
                            connect();
                        }, reconnectDelay);
                    } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                        console.error('Max reconnection attempts reached');
                    }
                };

                wsRef.current = ws;
            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                isConnectingRef.current = false;
            }
        };

        connect();

        // Cleanup function
        return () => {
            console.log('🧹 Cleaning up Whiteboard WebSocket');
            isCleanedUpRef.current = true;
            isConnectingRef.current = false;
            
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [enabled, sessionId]); // Only depend on stable values

    // Send update event (tldraw delta)
    const sendUpdate = useCallback((data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
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
        if (wsRef.current?.readyState === WebSocket.OPEN) {
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
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message: WhiteboardMessage = {
                type: 'cursor',
                session_id: sessionId,
                user_id: 0,
                user_name: '',
                cursor: { x, y },
                timestamp: Date.now(),
            };
            wsRef.current.send(JSON.stringify(message));
        }
    }, [sessionId]);

    // Get connection status
    const isConnected = wsRef.current?.readyState === WebSocket.OPEN;

    return {
        isConnected,
        sendUpdate,
        sendClear,
        sendCursor,
    };
}
