'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';
import { notificationService } from '@/lib/services/notification.service';
import { useNotificationWebSocket } from '@/lib/hooks/useNotificationWebSocket';
import { cn } from '@/lib/utils';

/**
 * NotificationBell Component
 * Displays notification bell icon with unread count badge
 * Redesigned to be "Mini Obsidian" style (more proportional)
 */
export function NotificationBell() {
    const [isLoading, setIsLoading] = useState(true);
    const { unreadCount, setUnreadCount } = useNotificationStore();
    const { isConnected } = useNotificationWebSocket();

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadCount(count);
            } catch (error) {
                setUnreadCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnreadCount();
    }, [setUnreadCount]);

    return (
        <div className="relative">
            <button
                className={cn(
                    "relative flex items-center justify-center transition-all duration-300 group",
                    "hover:bg-card p-2 rounded-xl active:scale-90 cursor-pointer"
                )}
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />

                {/* Unread count badge - Smaller and more precise */}
                {unreadCount > 0 && (
                    <span
                        className={cn(
                            "absolute top-0 right-0 inline-flex items-center justify-center",
                            "h-4 min-w-[16px] px-1 text-[9px] font-black leading-none text-white",
                            "bg-orange-600 rounded-full border-2 border-background shadow-lg shadow-orange-600/20 tabular-nums animate-in zoom-in-50 duration-300"
                        )}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}
