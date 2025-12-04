'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { badgeService } from '@/lib/services';
import type { LeaderboardEntry } from '@/lib/services/badge.service';

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    type: 'badges' | 'rarity' | 'sessions' | 'rating' | 'credits';
    isLoading?: boolean;
}

const LEADERBOARD_CONFIG = {
    badges: {
        title: '🏆 Badge Leaderboard',
        description: 'Top users by badge count',
        icon: '🏆',
    },
    rarity: {
        title: '💎 Rarity Leaderboard',
        description: 'Top users by badge rarity score',
        icon: '💎',
    },
    sessions: {
        title: '📚 Session Leaderboard',
        description: 'Top users by session count',
        icon: '📚',
    },
    rating: {
        title: '⭐ Rating Leaderboard',
        description: 'Top users by average rating',
        icon: '⭐',
    },
    credits: {
        title: '💰 Credit Leaderboard',
        description: 'Top users by credits earned',
        icon: '💰',
    },
};

/**
 * LeaderboardTable component displays leaderboard entries
 */
export function LeaderboardTable({
    entries,
    type,
    isLoading = false,
}: LeaderboardTableProps) {
    const config = LEADERBOARD_CONFIG[type];

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-yellow-100 dark:bg-yellow-900/30';
        if (rank === 2) return 'bg-slate-100 dark:bg-slate-800/50';
        if (rank === 3) return 'bg-orange-100 dark:bg-orange-900/30';
        return '';
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `${rank}`;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>{config.icon}</span>
                    {config.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {config.description}
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 font-semibold text-sm">Rank</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">User</th>
                            <th className="text-right py-3 px-4 font-semibold text-sm">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="text-center py-8">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400" />
                                    </div>
                                </td>
                            </tr>
                        ) : entries.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-8">
                                    <p className="text-slate-600 dark:text-slate-400">
                                        No data available yet
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry, index) => (
                                <tr
                                    key={entry.user_id}
                                    className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${getRankColor(
                                        entry.rank || index + 1
                                    )}`}
                                >
                                    {/* Rank */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-sm">
                                            {getRankBadge(entry.rank || index + 1)}
                                        </div>
                                    </td>

                                    {/* User Info */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={entry.avatar} alt={entry.username} />
                                                <AvatarFallback>
                                                    {entry.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {entry.full_name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    @{entry.username}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Score */}
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-lg">
                                                {badgeService.formatScore(entry.score, type)}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {type === 'rating' ? 'rating' : type}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Stats */}
            {entries.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {entries[0]?.score}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Top Score
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                                {entries.length}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Participants
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                                {Math.round(
                                    entries.reduce((sum, e) => sum + e.score, 0) / entries.length
                                )}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Average
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
