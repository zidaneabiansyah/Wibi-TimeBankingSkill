'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, Bell, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';
import { notificationService } from '@/lib/services/notification.service';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * NotificationDropdown Component
 * Displays list of recent notifications in a premium "Glassmorphic" dropdown
 */
export function NotificationDropdown({
    isOpen,
    onClose,
}: NotificationDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { notifications, setNotifications, markAsRead, removeNotification } =
        useNotificationStore();

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await notificationService.getNotifications(10, 0);
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            // Non-critical error, don't toast in dropdown for cleaner UI
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            markAsRead(id);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            toast.error('Gagal memperbarui notifikasi');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await notificationService.deleteNotification(id);
            removeNotification(id);
            toast.success('Notifikasi dihapus');
        } catch (error) {
            console.error('Failed to delete notification:', error);
            toast.error('Gagal menghapus notifikasi');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "absolute right-0 top-14 w-80 sm:w-96 max-h-[500px] flex flex-col overflow-hidden",
                "bg-card/90 backdrop-blur-3xl border border-border rounded-4xl shadow-xl",
                "animate-in fade-in slide-in-from-top-4 duration-300 z-100"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-black text-foreground uppercase tracking-[0.15em]">
                        NOTIFIKASI
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-full transition-colors group"
                    aria-label="Close"
                >
                    <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border/40">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Memuat Grid...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center px-8">
                        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4 border border-border/40">
                            <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Belum ada sinyal masuk</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium">Grid Anda bersih dan terpantau aman.</p>
                    </div>
                ) : (
                    <div className="py-2">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={() => handleMarkAsRead(notification.id)}
                                onDelete={() => handleDelete(notification.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-4 bg-muted/30 border-t border-border/40">
                    <button
                        onClick={() => {
                            onClose();
                            window.location.href = '/notifications';
                        }}
                        className="w-full h-11 flex items-center justify-center gap-2 group hover:bg-muted rounded-xl transition-all"
                    >
                        <span className="text-[10px] font-black text-muted-foreground group-hover:text-foreground uppercase tracking-[0.2em] transition-colors">
                            Lihat Semua Protokol
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </button>
                </div>
            )}
        </div>
    );
}
