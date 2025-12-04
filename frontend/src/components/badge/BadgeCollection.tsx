'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { BadgeCard } from './BadgeCard';
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
    const { userBadges, isLoading, error, fetchUserBadges, fetchUserBadgesByType, pinBadge } =
        useBadgeStore();
    const [selectedType, setSelectedType] = useState<BadgeType>('achievement');
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        fetchUserBadges();
    }, [fetchUserBadges]);

    const handleTypeChange = (type: BadgeType) => {
        setSelectedType(type);
        fetchUserBadgesByType(type);
    };

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

    const filteredBadges = userBadges.filter((ub) => ub.badge?.type === selectedType);
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
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
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
            <Tabs value={selectedType} onValueChange={(v) => handleTypeChange(v as BadgeType)}>
                <TabsList className="grid w-full grid-cols-4">
                    {BADGE_TYPES.map((type) => (
                        <TabsTrigger key={type.value} value={type.value} className="gap-1">
                            <span>{type.icon}</span>
                            <span className="hidden sm:inline">{type.label.split(' ')[1]}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Tab Contents */}
                {BADGE_TYPES.map((type) => (
                    <TabsContent key={type.value} value={type.value} className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : filteredBadges.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-lg font-semibold mb-2">No {type.label} yet</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Keep working to earn more badges!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredBadges.map((ub) => (
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
                ))}
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
