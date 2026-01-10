import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/stores/notification.store';
import { useAuthStore } from '@/stores/auth.store';
import type { Notification } from '@/types';
import { toast } from 'sonner';

/**
 * Hook for managing WebSocket connection to notification server
 * Automatically connects/disconnects and handles incoming notifications
 *
 * Features:
 * - Auto-reconnect on disconnect
 * - Exponential backoff for reconnection
 * - Proper cleanup on unmount
 * - Real-time notification updates
 */
export function useNotificationWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const isIntentionalDisconnectRef = useRef(false); // Track intentional disconnects
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000; // 1 second

    const { user } = useAuthStore();
    const {
        addNotification,
        setConnected,
        setUnreadCount,
    } = useNotificationStore();

    /**
     * Calculate reconnect delay with exponential backoff
     * Delay increases: 1s, 2s, 4s, 8s, 16s
     */
    const getReconnectDelay = () => {
        return baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
    };

    /**
     * Connect to WebSocket server
     */
    const connect = () => {
        if (!user || wsRef.current) {
            return;
        }

        // Reset intentional disconnect flag
        isIntentionalDisconnectRef.current = false;

        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No token found for WebSocket connection');
            return;
        }

        try {
            // Get the API URL from environment, defaulting to localhost:8080
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
            const baseUrl = apiUrl.replace('/api/v1', '').replace('http://', '').replace('https://', '');
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            // Add token as query parameter for WebSocket auth
            const wsUrl = `${protocol}//${baseUrl}/api/v1/ws/notifications?token=${token}`;

            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                setConnected(true);
                reconnectAttemptsRef.current = 0;
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const notification: Notification = JSON.parse(event.data);
                    addNotification(notification);

                    // Show toast for new notifications
                    toast.success(notification.title, {
                        description: notification.message,
                    });
                } catch (error) {
                    console.error('Failed to parse notification:', error);
                }
            };

            wsRef.current.onerror = () => {
                setConnected(false);
            };

            wsRef.current.onclose = () => {
                setConnected(false);
                wsRef.current = null;

                // Only attempt to reconnect if not intentional disconnect
                if (!isIntentionalDisconnectRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    const delay = getReconnectDelay();

                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttemptsRef.current += 1;
                        connect();
                    }, delay);
                } else if (!isIntentionalDisconnectRef.current && reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    console.error('❌ Max reconnection attempts reached');
                }
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            setConnected(false);
        }
    };

    /**
     * Disconnect from WebSocket server
     */
    const disconnect = () => {
        // Mark as intentional disconnect to suppress error logs
        isIntentionalDisconnectRef.current = true;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setConnected(false);
    };

    /**
     * Effect: Connect on mount, disconnect on unmount
     * Also handle page visibility/bfcache events
     */
    useEffect(() => {
        const handlePageHide = () => {
            // Disconnect when page is hidden (e.g. going to bfcache)
            disconnect();
        };

        const handlePageShow = (event: PageTransitionEvent) => {
            // Reconnect if we're coming from bfcache (persisted is true)
            // or if we just need to refresh connection
            if (user) {
                connect();
            }
        };

        if (user) {
            connect();
        }

        window.addEventListener('pagehide', handlePageHide);
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            window.removeEventListener('pagehide', handlePageHide);
            window.removeEventListener('pageshow', handlePageShow);
            disconnect();
        };
    }, [user]);

    return {
        isConnected: wsRef.current?.readyState === WebSocket.OPEN,
        connect,
        disconnect,
    };
}

