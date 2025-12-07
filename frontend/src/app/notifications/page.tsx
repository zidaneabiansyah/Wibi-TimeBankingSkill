'use client';

import { useEffect, useState } from 'react';
import { Loader2, Trash2, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';
import { notificationService } from '@/lib/services/notification.service';
import { useNotificationWebSocket } from '@/lib/hooks/useNotificationWebSocket';
import { NotificationItem } from '@/components/notification/NotificationItem';
import { toast } from 'sonner';

/**
 * NotificationCenter Page
 * Full notification management page with filtering and actions
 */
export default function NotificationsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);

    const {
        notifications,
        unreadCount,
        setNotifications,
        markAsRead,
        removeNotification,
        markAllAsRead,
    } = useNotificationStore();

    const { isConnected } = useNotificationWebSocket();

    /**
     * Fetch notifications on mount and when filter changes
     */
    useEffect(() => {
        fetchNotifications();
    }, [filter, offset]);

    /**
     * Fetch notifications based on filter
     */
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            let data;
            if (filter === 'unread') {
                data = await notificationService.getUnreadNotifications(limit, offset);
            } else {
                data = await notificationService.getNotifications(limit, offset);
            }
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle marking notification as read
     */
    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            markAsRead(id);
        } catch (error) {
            console.error('Failed to mark as read:', error);
            toast.error('Failed to update notification');
        }
    };

    /**
     * Handle deleting notification
     */
    const handleDelete = async (id: number) => {
        try {
            await notificationService.deleteNotification(id);
            removeNotification(id);
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Failed to delete:', error);
            toast.error('Failed to delete notification');
        }
    };

    /**
     * Handle marking all as read
     */
    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            markAllAsRead();
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            toast.error('Failed to update notifications');
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            {/* Main Container - Centered */}
            <div className="w-full max-w-3xl mx-auto">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center justify-center mb-8 gap-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
                        Notifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Stay updated with your activities and interactions
                    </p>

                    {/* Connection Status */}
                    <div className="flex items-center justify-center gap-2">
                        <span
                            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isConnected ? 'Connected' : 'Connecting...'}
                        </span>
                    </div>
                </div>

                {/* Controls Section - Centered */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    {/* Filter Buttons */}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => {
                                setFilter('all');
                                setOffset(0);
                            }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => {
                                setFilter('unread');
                                setOffset(0);
                            }}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'unread'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {/* Mark All as Read Button */}
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all font-medium"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark All as Read
                        </button>
                    )}
                </div>

                {/* Notifications List - Centered */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <Trash2 className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400 text-center">
                                {filter === 'unread'
                                    ? 'No unread notifications'
                                    : 'No notifications yet'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                                You're all caught up! Check back later for updates.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <NotificationItem
                                        notification={notification}
                                        onMarkAsRead={() => handleMarkAsRead(notification.id)}
                                        onDelete={() => handleDelete(notification.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination - Centered */}
                {notifications.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setOffset(Math.max(0, offset - limit))}
                            disabled={offset === 0}
                            className="px-6 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            Previous
                        </button>
                        <span className="text-gray-600 dark:text-gray-400">
                            Page {Math.floor(offset / limit) + 1}
                        </span>
                        <button
                            onClick={() => setOffset(offset + limit)}
                            className="px-6 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Footer Info - Centered */}
                <div className="flex items-center justify-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                        Notifications are automatically deleted after 30 days
                    </p>
                </div>
            </div>
        </div>
    );
}
