'use client';

import { useState } from 'react';
import { Star, Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { badgeService } from '@/lib/services';
import type { UserBadge } from '@/types';

interface BadgeCardProps {
    userBadge: UserBadge;
    onPin?: (badgeId: number, isPinned: boolean) => void;
    showPin?: boolean;
    variant?: 'default' | 'compact';
}

/**
 * BadgeCard component displays a single badge
 */
export function BadgeCard({
    userBadge,
    onPin,
    showPin = true,
    variant = 'default',
}: BadgeCardProps) {
    const [isPinning, setIsPinning] = useState(false);
    const badge = userBadge.badge;

    if (!badge) return null;

    const rarityColor = badgeService.getRarityColor(badge.rarity);
    const typeLabel = badgeService.getBadgeTypeLabel(badge.type);
    const progressPercent = userBadge.progress_percent;

    const handlePin = async () => {
        if (!onPin) return;
        setIsPinning(true);
        try {
            await onPin(badge.id, !userBadge.is_pinned);
        } finally {
            setIsPinning(false);
        }
    };

    if (variant === 'compact') {
        return (
            <div className="relative group">
                <div className="w-16 h-16 rounded-lg bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                    <span className="text-2xl">{badge.icon}</span>
                    {userBadge.is_pinned && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white dark:border-slate-900" />
                    )}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                        {badge.name}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-3">
                {/* Badge Icon & Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{badge.icon}</span>
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm leading-tight">{badge.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{typeLabel}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                        {badge.description}
                    </p>

                    {/* Progress Bar (if not completed) */}
                    {!userBadge.is_completed && (
                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Progress</span>
                                <span className="text-xs text-slate-500">
                                    {userBadge.progress}/{userBadge.progress_goal}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all"
                                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                            <Star className={`w-3 h-3 ${rarityColor}`} />
                            <span className="text-slate-600 dark:text-slate-400">
                                Rarity {badge.rarity}/5
                            </span>
                        </div>
                        {badge.bonus_credits > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-600 dark:text-yellow-400">💰</span>
                                <span className="text-slate-600 dark:text-slate-400">
                                    +{badge.bonus_credits} credits
                                </span>
                            </div>
                        )}
                        <div className="text-slate-500 dark:text-slate-500">
                            {badge.total_awarded} earned
                        </div>
                    </div>
                </div>

                {/* Pin Button */}
                {showPin && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePin}
                        disabled={isPinning}
                        className="mt-1"
                    >
                        {userBadge.is_pinned ? (
                            <Pin className="w-4 h-4 fill-current" />
                        ) : (
                            <PinOff className="w-4 h-4" />
                        )}
                    </Button>
                )}
            </div>

            {/* Earned Date */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Earned on {new Date(userBadge.earned_at).toLocaleDateString()}
                </p>
            </div>
        </Card>
    );
}
