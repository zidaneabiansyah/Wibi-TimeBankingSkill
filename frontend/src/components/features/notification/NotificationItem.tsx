'use client';

import { Trash2, Bell, Wallet, Trophy, Star, Users, Circle } from 'lucide-react';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: () => void;
    onDelete: () => void;
}

/**
 * NotificationItem Component
 * Displays a single notification with high premium aesthetics
 */
export function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
}: NotificationItemProps) {
    /**
     * Get icon and color based on notification type
     */
    const getTypeConfig = () => {
        switch (notification.type) {
            case 'session':
                return {
                    icon: Bell,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20"
                };
            case 'credit':
                return {
                    icon: Wallet,
                    color: "text-orange-500",
                    bg: "bg-orange-500/10",
                    border: "border-orange-500/20"
                };
            case 'achievement':
                return {
                    icon: Trophy,
                    color: "text-yellow-500",
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/20"
                };
            case 'review':
                return {
                    icon: Star,
                    color: "text-purple-400",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/20"
                };
            case 'social':
                return {
                    icon: Users,
                    color: "text-pink-400",
                    bg: "bg-pink-500/10",
                    border: "border-pink-500/20"
                };
                return {
                    icon: Bell,
                    color: "text-muted-foreground",
                    bg: "bg-muted",
                    border: "border-border"
                };
        }
    };

    const config = getTypeConfig();
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "relative p-5 transition-all duration-300 cursor-pointer group",
                "hover:bg-muted",
                !notification.is_read ? "bg-orange-500/[0.03]" : "opacity-60 hover:opacity-100"
            )}
            onClick={onMarkAsRead}
        >
            <div className="flex items-start gap-4">
                {/* Icon Wrapper with Glow */}
                <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 duration-500",
                    config.bg, config.border
                )}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <h4 className={cn(
                                "text-[13px] font-bold tracking-tight mb-1 transition-colors",
                                notification.is_read ? "text-muted-foreground" : "text-foreground group-hover:text-orange-500"
                            )}>
                                {notification.title}
                            </h4>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {formatDistanceToNow(new Date(notification.created_at), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>

                        {/* Delete Button - Premium modern style */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className={cn(
                                "p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all",
                                "bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white"
                            )}
                            aria-label="Delete"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Message */}
                    <p className={cn(
                        "text-xs leading-relaxed mt-2 line-clamp-2",
                        notification.is_read ? "text-muted-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                        {notification.message}
                    </p>

                    {/* Unread Indicator Dot */}
                    {!notification.is_read && (
                        <div className="absolute top-5 right-5">
                            <Circle className="w-2 h-2 fill-orange-600 text-orange-600 animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
