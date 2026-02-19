'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { BadgeCard } from './BadgeCard';
import { ErrorState } from '@/components/ui/error-state';
import { useBadgeStore } from '@/stores';
import type { BadgeType } from '@/types';

interface BadgeCollectionProps {
    userId?: number;
    showPin?: boolean;
    compact?: boolean;
}

const BADGE_TYPES: { value: BadgeType; label: string; icon: string }[] = [
    { value: 'achievement', label: '🏆 Achievements', icon: '🏆' },
    { value: 'milestone', label: '🎯 Milestones', icon: '🎯' },
    { value: 'quality', label: '⭐ Quality', icon: '⭐' },
    { value: 'special', label: '✨ Special', icon: '✨' },
];

/**
 * BadgeCollection component displays user's badges in tabs
 */
export function BadgeCollection({
    userId,
    showPin = true,
    compact = false,
}: BadgeCollectionProps) {
    const { userBadges, isLoading, error, fetchUserBadges, pinBadge } =
        useBadgeStore();
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        fetchUserBadges();
    }, [fetchUserBadges]);

    const handleCheckBadges = async () => {
        setIsChecking(true);
        try {
            await useBadgeStore.getState().checkAndAwardBadges();
            // Refresh badges after checking
            await fetchUserBadges();
        } finally {
            setIsChecking(false);
        }
    };

    const handlePin = async (badgeId: number, isPinned: boolean) => {
        await pinBadge(badgeId, isPinned);
    };

    const totalBadges = userBadges.length;
    const pinnedBadges = userBadges.filter((ub) => ub.is_pinned);

    if (compact) {
        return (
            <div className="space-y-4">
                {/* Pinned Badges */}
                {pinnedBadges.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Pinned Badges</h3>
                        <div className="flex flex-wrap gap-3">
                            {pinnedBadges.map((ub) => (
                                <BadgeCard
                                    key={ub.id}
                                    userBadge={ub}
                                    onPin={handlePin}
                                    showPin={showPin}
                                    variant="compact"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Badges Grid */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">
                            All Badges ({totalBadges})
                        </h3>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCheckBadges}
                            disabled={isChecking}
                        >
                            {isChecking && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                            Check New
                        </Button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {userBadges.map((ub) => (
                            <BadgeCard
                                key={ub.id}
                                userBadge={ub}
                                onPin={handlePin}
                                showPin={false}
                                variant="compact"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Error Alert */}
            {error && (
                <ErrorState
                    message={error}
                    onRetry={handleCheckBadges}
                    variant="compact"
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">My Badges</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        You have earned {totalBadges} badge{totalBadges !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button
                    onClick={handleCheckBadges}
                    disabled={isChecking}
                    className="gap-2"
                >
                    {isChecking && <Loader2 className="w-4 h-4 animate-spin" />}
                    Check for New Badges
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value="all" onValueChange={() => {}}>
                <TabsList className="hidden" />

                {/* All Badges Grid */}
                <TabsContent value="all" className="space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        </div>
                    ) : userBadges.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lg font-semibold mb-2">No badges yet</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Keep working to earn your first badge!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userBadges.map((ub: any) => (
                                <BadgeCard
                                    key={ub.id}
                                    userBadge={ub}
                                    onPin={handlePin}
                                    showPin={showPin}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Pinned Badges Section */}
            {pinnedBadges.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4">Pinned Badges</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pinnedBadges.map((ub) => (
                            <BadgeCard
                                key={ub.id}
                                userBadge={ub}
                                onPin={handlePin}
                                showPin={showPin}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
