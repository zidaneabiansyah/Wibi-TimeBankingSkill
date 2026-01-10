'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { LeaderboardTable } from './LeaderboardTable';
import { useBadgeStore } from '@/stores';
import { m } from 'framer-motion';
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
        <div className="space-y-10">
            {/* Controls Filter */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Tabs 
                    value={selectedType} 
                    onValueChange={(v) => handleTypeChange(v as LeaderboardType)}
                    className="w-full max-w-2xl"
                >
                    <TabsList className="grid w-full grid-cols-5 p-1 h-12 bg-muted/50 rounded-xl">
                        {LEADERBOARD_TYPES.map((type) => (
                            <TabsTrigger 
                                key={type.value} 
                                value={type.value} 
                                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                            >
                                <span className="text-lg">{type.icon}</span>
                                <span className="hidden lg:inline text-xs font-semibold">{type.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Time Range:</span>
                    <Select value={timeRange} onValueChange={(v) => handleTimeRangeChange(v as TimeRange)}>
                        <SelectTrigger className="w-[140px] h-10 rounded-xl bg-card border-border/40 focus:ring-primary/20">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/40">
                            <SelectItem value="weekly">This Week</SelectItem>
                            <SelectItem value="monthly">This Month</SelectItem>
                            <SelectItem value="all-time">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Ranking Display Section */}
            <div className="relative">
                {isLoading && !currentEntries.length ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">Fetching global rankings...</p>
                    </div>
                ) : (
                    <m.div
                        key={`${selectedType}-${timeRange}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <LeaderboardTable
                            entries={currentEntries}
                            type={selectedType}
                            isLoading={isLoading && !currentEntries.length}
                        />
                    </m.div>
                )}
            </div>
        </div>
    );
}
