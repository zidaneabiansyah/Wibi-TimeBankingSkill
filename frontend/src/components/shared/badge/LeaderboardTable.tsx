'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { badgeService } from '@/lib/services';
import type { LeaderboardEntry } from '@/lib/services/badge.service';
import { m, AnimatePresence } from 'framer-motion';
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
                        <m.div
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
                                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center font-black shadow-2xl z-20 transition-transform group-hover:scale-110
                                    ${rank === 1 ? 'bg-yellow-500 text-white text-xl md:text-2xl border-4 border-background' : 
                                    rank === 2 ? 'bg-slate-300 text-slate-800 text-lg md:text-xl border-4 border-background shadow-slate-400/20' : 
                                    rank === 3 ? 'bg-orange-500 text-white text-lg md:text-xl border-4 border-background shadow-orange-900/20' : 
                                    'bg-orange-500 text-white text-lg md:text-xl border-4 border-background shadow-orange-900/20'}`}
                                >
                                    {rank === 1 ? '1' : rank === 2 ? '2' : '3'}
                                    <div className="absolute -top-1 -right-1 text-[10px] drop-shadow-sm">
                                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className={`w-full p-6 rounded-3xl border bg-card/90 backdrop-blur-md shadow-2xl text-center space-y-2 
                                ${isFirst ? 'pt-8 pb-10 border-yellow-500/30 shadow-yellow-500/10 ring-2 ring-yellow-500/5' : 'border-border/60 shadow-lg'}`}
                            >
                                <p className={`font-black tracking-tight truncate ${isFirst ? 'text-xl' : 'text-lg'}`}>{entry.full_name}</p>
                                <p className="text-xs font-bold text-muted-foreground/80 truncate mb-3">@{entry.username}</p>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-widest shadow-sm
                                    ${isFirst ? 'bg-yellow-500 text-white shadow-yellow-500/20' : 'bg-secondary text-secondary-foreground shadow-black/5'}`}
                                >
                                    <span className="text-lg">{badgeService.formatScore(entry.score, type)}</span>
                                    <span className="text-[10px] opacity-80 font-bold lowercase">{type === 'rating' ? 'stars' : type}</span>
                                </div>
                            </div>
                        </m.div>
                    );
                })}
            </div>

            {/* Ranking List (4+) */}
            {others.length > 0 && (
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex items-center gap-3 px-4">
                        <div className="h-px flex-1 bg-border/40" />
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-muted-foreground flex items-center gap-2 uppercase">
                            <ArrowUp className="h-3 w-3 text-primary" />
                            Upcoming Challengers
                        </h4>
                        <div className="h-px flex-1 bg-border/40" />
                    </div>
                    <div className="space-y-3">
                        {others.map((entry, index) => (
                            <m.div
                                key={entry.user_id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="group flex items-center gap-5 p-5 rounded-3xl bg-card border border-border/40 hover:border-primary/40 hover:shadow-xl hover:bg-accent/5 transition-all duration-300"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-2xl bg-secondary/50 flex items-center justify-center font-black text-lg text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                    {(entry.rank || index + 4)}
                                </div>
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:scale-110 transition-transform ring-1 ring-border/20">
                                    <AvatarImage src={entry.avatar} alt={entry.username} />
                                    <AvatarFallback className="font-bold">{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-base truncate group-hover:text-primary transition-colors">{entry.full_name}</p>
                                    <p className="text-xs font-semibold text-muted-foreground/80 truncate">@{entry.username}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-0.5">
                                    <p className="font-black text-xl text-foreground tracking-tight">
                                        {badgeService.formatScore(entry.score, type)}
                                    </p>
                                    <div className="px-2 py-0.5 rounded-lg bg-secondary/80 text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                                        {type}
                                    </div>
                                </div>
                            </m.div>
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
