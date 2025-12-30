'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { LeaderboardTable } from './LeaderboardTable';
import { useBadgeStore } from '@/stores';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { LeaderboardEntry } from '@/lib/services/badge.service';

type LeaderboardType = 'badges' | 'rarity' | 'sessions' | 'rating' | 'credits';
type TimeRange = 'weekly' | 'monthly' | 'all-time';

interface LeaderboardTabsProps {
    limit?: number;
}

const LEADERBOARD_TYPES: { value: LeaderboardType; label: string; icon: string }[] = [
    { value: 'badges', label: 'Badges', icon: '🏆' },
    { value: 'rarity', label: 'Rarity', icon: '💎' },
    { value: 'sessions', label: 'Sessions', icon: '📚' },
    { value: 'rating', label: 'Rating', icon: '⭐' },
    { value: 'credits', label: 'Credits', icon: '💰' },
];

/**
 * LeaderboardTabs component displays all leaderboards in tabs
 */
export function LeaderboardTabs({ limit = 10 }: LeaderboardTabsProps) {
    const { leaderboards, isLoading, fetchLeaderboard } = useBadgeStore();
    const [selectedType, setSelectedType] = useState<LeaderboardType>('badges');
    const [timeRange, setTimeRange] = useState<TimeRange>('all-time');

    useEffect(() => {
        // Load initial leaderboard
        fetchLeaderboard('badges', limit, timeRange);
    }, [limit, fetchLeaderboard, timeRange]);

    const handleTypeChange = (type: LeaderboardType) => {
        setSelectedType(type);
        // Always fetch when switching tabs to ensure freshness with current time range
        fetchLeaderboard(type, limit, timeRange);
    };

    const handleTimeRangeChange = (range: TimeRange) => {
        setTimeRange(range);
        fetchLeaderboard(selectedType, limit, range);
    };

    const currentEntries: LeaderboardEntry[] = leaderboards[selectedType] || [];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Leaderboards</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Top {limit} users across different categories
                    </p>
                </div>
                <Select value={timeRange} onValueChange={(v) => handleTimeRangeChange(v as TimeRange)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekly">This Week</SelectItem>
                        <SelectItem value="monthly">This Month</SelectItem>
                        <SelectItem value="all-time">All Time</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tabs */}
            <Tabs value={selectedType} onValueChange={(v) => handleTypeChange(v as LeaderboardType)}>
                <TabsList className="grid w-full grid-cols-5">
                    {LEADERBOARD_TYPES.map((type) => (
                        <TabsTrigger key={type.value} value={type.value} className="gap-1">
                            <span>{type.icon}</span>
                            <span className="hidden sm:inline text-xs">{type.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Tab Contents */}
                {LEADERBOARD_TYPES.map((type) => (
                    <TabsContent key={type.value} value={type.value} className="space-y-4">
                        {isLoading && !currentEntries.length ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <LeaderboardTable
                                entries={currentEntries}
                                type={type.value}
                                isLoading={isLoading && !currentEntries.length}
                            />
                        )}
                    </TabsContent>
                ))}
            </Tabs>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Leaderboards update in real-time as users complete sessions and earn badges.
                    Keep improving to climb the ranks!
                </p>
            </div>
        </div>
    );
}
