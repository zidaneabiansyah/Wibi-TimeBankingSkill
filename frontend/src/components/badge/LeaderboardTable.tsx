'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { badgeService } from '@/lib/services';
import type { LeaderboardEntry } from '@/lib/services/badge.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, Crown, ArrowUp, User } from 'lucide-react';

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    type: 'badges' | 'rarity' | 'sessions' | 'rating' | 'credits';
    isLoading?: boolean;
}

const LEADERBOARD_CONFIG = {
    badges: {
        title: 'Badge Master',
        description: 'Most achievement points collected',
        icon: Trophy,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
    },
    rarity: {
        title: 'Legendary Status',
        description: 'Highest rarity multiplier',
        icon: Crown,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    sessions: {
        title: 'Super Sharer',
        description: 'Highest number of knowledge sessions',
        icon: Medal,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    rating: {
        title: 'Top Rated',
        description: 'Highest average peer rating',
        icon: Star,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
    },
    credits: {
        title: 'Wealthiest',
        description: 'Most time credits earned',
        icon: User,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
    },
};

/**
 * LeaderboardTable component displays leaderboard entries in a premium UI
 */
export function LeaderboardTable({
    entries,
    type,
    isLoading = false,
}: LeaderboardTableProps) {
    const config = LEADERBOARD_CONFIG[type];
    const top3 = entries.slice(0, 3);
    const others = entries.slice(3);

    // Reorder top3 for podium: [2, 1, 3]
    const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

    return (
        <div className="space-y-12">
            {/* Podium Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto px-4">
                {podiumOrder.map((entry, idx) => {
                    const rank = idx === 0 && top3.length === 3 ? 2 : (idx === 1 && top3.length === 3 ? 1 : (idx === 2 && top3.length === 3 ? 3 : idx + 1));
                    const isFirst = rank === 1;
                    
                    return (
                        <motion.div
                            key={entry.user_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * rank }}
                            className={`relative flex flex-col items-center ${isFirst ? 'order-1 md:order-2 z-10' : idx === 0 ? 'order-2 md:order-1' : 'order-3'}`}
                        >
                            {/* Avatar with rank border */}
                            <div className={`relative mb-4 group`}>
                                <div className={`absolute -inset-1 rounded-full blur opacity-40 transition duration-500 group-hover:opacity-100 
                                    ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-400' : 'bg-orange-600'}`} 
                                />
                                <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-background overflow-hidden bg-muted">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={entry.avatar} alt={entry.username} />
                                        <AvatarFallback className="text-xl font-bold bg-muted-foreground/10">
                                            {entry.username.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full flex items-center justify-center font-bold text-shadow shadow-lg
                                    ${rank === 1 ? 'bg-yellow-500 text-white text-lg h-10 w-10 border-4 border-background' : 
                                      rank === 2 ? 'bg-slate-400 text-white' : 
                                      'bg-orange-600 text-white'}`}
                                >
                                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className={`w-full p-4 rounded-2xl border bg-card/80 backdrop-blur-sm shadow-xl text-center space-y-1 
                                ${isFirst ? 'pt-6 pb-8 border-yellow-500/20 shadow-yellow-500/5' : 'border-border/40'}`}
                            >
                                <p className="font-bold text-base truncate">{entry.full_name}</p>
                                <p className="text-xs text-muted-foreground truncate mb-2">@{entry.username}</p>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${isFirst ? 'bg-yellow-500 text-white' : 'bg-muted'}`}
                                >
                                    {badgeService.formatScore(entry.score, type)}
                                    <span className="opacity-70 font-medium lowercase">{type === 'rating' ? 'rating' : type}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Ranking List (4+) */}
            {others.length > 0 && (
                <div className="max-w-4xl mx-auto space-y-3">
                    <h4 className="text-sm font-bold text-muted-foreground px-4 flex items-center gap-2">
                        <ArrowUp className="h-3.5 w-3.5" />
                        UPCOMING CHALENGERS
                    </h4>
                    <div className="space-y-2">
                        {others.map((entry, index) => (
                            <motion.div
                                key={entry.user_id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex-shrink-0 w-8 text-center font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                    {(entry.rank || index + 4)}
                                </div>
                                <Avatar className="h-10 w-10 border border-border/40 group-hover:scale-105 transition-transform">
                                    <AvatarImage src={entry.avatar} alt={entry.username} />
                                    <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{entry.full_name}</p>
                                    <p className="text-xs text-muted-foreground truncate">@{entry.username}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-base text-foreground">
                                        {badgeService.formatScore(entry.score, type)}
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
                                        {type}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && entries.length === 0 && (
                <div className="text-center py-20 bg-card/50 rounded-3xl border-2 border-dashed border-border/40 max-w-4xl mx-auto">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium">No results found for this period</p>
                    <p className="text-sm text-muted-foreground">Be the first one to climb this throne!</p>
                </div>
            )}

            {/* Dashboard Stats */}
            {entries.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
                    {[
                        { label: 'Highest Achievement', value: badgeService.formatScore(entries[0]?.score, type), color: 'text-yellow-500' },
                        { label: 'Total Participants', value: entries.length, color: 'text-blue-500' },
                        { label: 'Community Average', value: Math.round(entries.reduce((sum, e) => sum + e.score, 0) / entries.length), color: 'text-green-500' }
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-card border border-border/40 flex flex-col items-center text-center space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                            <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
