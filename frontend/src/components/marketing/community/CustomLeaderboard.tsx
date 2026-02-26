'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Gem, Trophy } from 'lucide-react';

import { useBadgeStore, useAuthStore } from '@/stores';
import type { LeaderboardEntry } from '@/lib/services/badge.service';
import { Loader2 } from 'lucide-react';

type TimeRange = 'weekly' | 'monthly' | 'all-time';
type LeaderboardCategory = 'badges' | 'rarity' | 'sessions' | 'rating' | 'credits';

const CATEGORIES: { id: LeaderboardCategory; label: string }[] = [
    { id: 'badges', label: 'Badges' },
    { id: 'rarity', label: 'Rarity' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'rating', label: 'Rating' },
    { id: 'credits', label: 'Credits' },
];

export function CustomLeaderboard() {
    const { leaderboards, isLoading, fetchLeaderboard } = useBadgeStore();
    const { user } = useAuthStore();
    const limit = 15;

    const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('weekly');
    const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('badges');
    const [fade, setFade] = useState(false);

    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        fetchLeaderboard(activeCategory, limit, activeTimeRange);
    }, [activeCategory, activeTimeRange, fetchLeaderboard, limit]);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            let target: Date;

            if (activeTimeRange === 'weekly') {
                target = new Date(now);
                target.setHours(24, 0, 0, 0);
            } else {
                target = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            }

            const difference = target.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    m: Math.floor((difference / 1000 / 60) % 60),
                    s: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [activeTimeRange]);

    const handleTimeRangeChange = (range: TimeRange) => {
        if (range === activeTimeRange) return;
        setFade(true);
        setTimeout(() => {
            setActiveTimeRange(range);
            setFade(false);
        }, 200);
    };

    const currentEntries: LeaderboardEntry[] = leaderboards[activeCategory] || [];

    // Fill in calculated rank if missing backend side based on index
    const sortedData = currentEntries.map((entry, idx) => ({
        ...entry,
        rank: entry.rank || idx + 1
    }));

    const top3 = sortedData.slice(0, 3);
    const others = sortedData.slice(3);

    // Display podium sequence: 2 - 1 - 3
    let displayOrder: typeof sortedData = [];
    if (top3.length === 3) displayOrder = [top3[1], top3[0], top3[2]];
    else if (top3.length === 2) displayOrder = [top3[1], top3[0]];
    else if (top3.length === 1) displayOrder = [top3[0]];

    const currentUserEntry = user ? sortedData.find(entry => entry.user_id === user.id) : null;
    let userPointsStr = "0";
    let userRankStr = "-";
    if (currentUserEntry) {
        userPointsStr = activeCategory === 'rating' ? (currentUserEntry.score / 100).toFixed(1) : currentUserEntry.score.toLocaleString();
        userRankStr = `#${currentUserEntry.rank}`;
    }
    const totalUsersDummy = 1200; // As backend doesn't return total in store yet, using aesthetic placeholder

    return (
        <div className="w-full flex flex-col items-center">
            {/* Top Toolbar (Button Group) */}
            <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between bg-card p-2 md:p-3 rounded-2xl md:rounded-full border border-border mb-16 shadow-inner">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-1 md:gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                if (cat.id === activeCategory) return;
                                setFade(true);
                                setTimeout(() => { setActiveCategory(cat.id as LeaderboardCategory); setFade(false); }, 200);
                            }}
                            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-full text-sm font-semibold transition-all duration-300 min-w-max ${activeCategory === cat.id
                                ? 'bg-muted text-foreground border border-border shadow-md'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                                }`}
                        >
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Dropdown Range */}
                <div className="flex items-center gap-3 px-4 md:px-6 py-2 mt-2 md:mt-0 w-full md:w-auto justify-between border-t border-border/10 md:border-none">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Time Range:</span>
                    <div className="relative min-w-[120px]">
                        <select
                            value={activeTimeRange}
                            onChange={(e) => handleTimeRangeChange(e.target.value as TimeRange)}
                            className="w-full bg-background border border-border text-foreground text-sm font-bold rounded-lg md:rounded-xl px-4 py-2.5 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm transition-colors hover:border-border/80"
                        >
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                            <option value="all-time">All Time</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Podium Layout */}
            <div
                className={`flex flex-col md:flex-row items-end justify-center w-full max-w-4xl mx-auto transition-all duration-300 transform ${fade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
            >
                {isLoading && sortedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 w-full h-80">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <span className="text-muted-foreground font-medium">Memuat data papan skor...</span>
                    </div>
                ) : (
                    displayOrder.map((user, idx) => {
                        const isRank1 = user.rank === 1;
                        // Use default avatar if empty string
                        const avatarUrl = user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.username) + "&background=random";

                        return (
                            <div
                                key={user.user_id + '_' + user.rank}
                                className={`flex flex-col items-center px-2 w-full md:auto ${isRank1 ? 'order-1 md:order-2 z-10 md:w-[35%]' : idx === 0 ? 'order-2 md:order-1 md:w-[30%] -mb-2 md:mb-0' : 'order-3 md:order-3 md:w-[30%] -mb-2 md:mb-0'
                                    }`}
                            >
                                <div
                                    className={`w-full relative flex flex-col items-center bg-card/40 backdrop-blur-sm transition-all duration-300 ${isRank1
                                        ? 'rounded-[2.5rem] border border-primary/40 p-10 pb-12 shadow-2xl shadow-primary/20 scale-105 transform origin-bottom'
                                        : 'rounded-3xl border border-border p-8 opacity-90 hover:opacity-100 shadow-xl'
                                        }`}
                                >
                                    {/* Glowing backdrop for rank 1 */}
                                    {isRank1 && (
                                        <div className="absolute inset-x-0 top-0 h-32 bg-primary/20 blur-[3rem] rounded-t-[2.5rem] pointer-events-none" />
                                    )}

                                    {/* Avatar with squircle shape */}
                                    <div className="relative mb-6">
                                        <div
                                            className={`relative overflow-hidden ring-4 ring-offset-4 ring-offset-card shadow-lg ${isRank1 ? 'w-28 h-28 ring-yellow-500 shadow-yellow-500/30' : 'w-20 h-20 ring-border'
                                                }`}
                                            style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
                                        >
                                            <Image
                                                src={avatarUrl}
                                                alt={user.full_name || user.username}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        {/* Rank Badge */}
                                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-xl border-4 border-background ${isRank1 ? 'bg-yellow-500 text-stone-900' :
                                            user.rank === 2 ? 'bg-slate-300 text-stone-800' :
                                                'bg-orange-600 text-white'
                                            }`}>
                                            {user.rank}
                                        </div>
                                    </div>

                                    <h3 className={`font-black text-center text-foreground truncate w-full px-2 ${isRank1 ? 'text-2xl mt-2' : 'text-xl mt-1'}`}>
                                        {user.full_name || user.username}
                                    </h3>
                                    <p className="text-xs text-primary font-bold mt-1.5 tracking-widest uppercase truncate max-w-full">
                                        {activeCategory === 'rating' ? (user.score / 100).toFixed(1) : user.score.toLocaleString()} pts
                                    </p>

                                    <div className="w-full border-t border-border my-6" />

                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                                            <Gem className="w-5 h-5 fill-yellow-500/20" />
                                            <span className={`font-black tracking-tight ${isRank1 ? 'text-3xl' : 'text-2xl'}`}>
                                                {/* Dummy Prize formula based on Score for visual purpose */}
                                                {(user.score * 10).toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                                            Poin Prize
                                        </span>
                                    </div>
                                </div>

                                {/* Empty space block for bottom margin consistency between items */}
                                <div className="h-6 md:h-8" />
                            </div>
                        );
                    }))}
            </div>

            {/* Lower Rankings List (Slanted Rows) */}
            <div className={`w-full max-w-5xl mx-auto mt-20 transition-all duration-300 ${fade ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {/* Table Header */}
                <div className="hidden md:flex items-center px-12 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    <div className="w-16">Rank</div>
                    <div className="flex-1 ml-4 block sm:hidden lg:block">Name</div>
                    <div className="w-24 text-center ml-auto">Level</div>
                    <div className="w-24 text-center">Helps Given</div>
                    <div className="w-24 text-center">Impact Rate</div>
                    <div className="w-32 text-center pr-12">Total Score</div>
                </div>

                {/* Table Rows */}
                <div className="flex flex-col gap-3 px-4 md:px-0 pb-16">
                    {others.map((user) => {
                        const avatarUrl = user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.username) + "&background=random";

                        // TimeBanking logical dummy formulas based on score
                        const userLevel = Math.max(1, Math.floor(user.score / 150));
                        const helpsGiven = Math.max(0, Math.floor(user.score / 15));
                        const impactRate = (Math.min(99, 50 + (user.score % 50))).toFixed(1) + "%";

                        let roleTitle = "Volunteer";
                        if (userLevel > 10) roleTitle = "Community Hero";
                        else if (userLevel > 5) roleTitle = "Mentor";
                        else if (userLevel > 2) roleTitle = "Active Member";

                        return (
                            <div key={user.user_id + "_" + user.rank} className="relative group cursor-pointer w-[95%] md:w-full mx-auto max-w-[95vw]">
                                {/* Slanted Container Background */}
                                <div className="absolute inset-x-0 inset-y-0 bg-card border border-border rounded-lg md:rounded-xl md:-skew-x-[15deg] group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-200" />

                                {/* Un-skewed Content Area */}
                                <div className="relative flex flex-col md:flex-row items-center py-4 px-6 md:px-10 min-h-[5rem]">

                                    {/* Rank & Profile */}
                                    <div className="flex items-center gap-4 w-full md:w-64">
                                        <span className="text-xl font-black text-muted-foreground w-8 md:w-10 tabular-nums">{user.rank}</span>
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border">
                                            <Image src={avatarUrl} alt={user.username} fill className="object-cover" unoptimized />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-foreground text-base md:text-sm whitespace-nowrap">{user.full_name || user.username}</span>
                                                <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground hidden md:block">{roleTitle}</span>
                                        </div>
                                    </div>

                                    {/* Divider & Tags */}
                                    <div className="hidden md:flex items-center pl-6 pr-4 ml-4 lg:ml-0 gap-3">
                                        <span className="text-xs bg-muted text-foreground px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 whitespace-nowrap">
                                            <Gem className="w-3 h-3 text-primary" /> Badge Holder
                                        </span>
                                    </div>

                                    {/* Stats Area (Right side) */}
                                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-0 mt-4 md:mt-0 w-full md:flex-1 text-sm font-bold text-muted-foreground">
                                        <div className="text-center md:w-24"><span className="md:hidden text-muted-foreground font-normal mr-2">Level:</span>Lv.{userLevel}</div>
                                        <div className="text-center md:w-24"><span className="md:hidden text-muted-foreground font-normal mr-2">Helps:</span>{helpsGiven}</div>
                                        <div className="text-center md:w-24"><span className="md:hidden text-muted-foreground font-normal mr-2">Impact:</span>{impactRate}</div>
                                        <div className="text-center md:w-32 ml-0 md:ml-4">
                                            <span className="inline-block bg-primary text-white px-4 py-1.5 rounded text-xs shadow-md shadow-primary/20">
                                                {activeCategory === 'rating' ? (user.score / 100).toFixed(1) : user.score.toLocaleString()} pts
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="w-full mt-12 pt-6 border-t border-border/60 flex justify-center text-center">
                {user ? (
                    <p className="text-sm text-muted-foreground font-medium">
                        Kamu mendapatkan <span className="text-primary font-bold">{userPointsStr} poin</span> dengan kategori ini, dan berada di peringkat <span className="text-foreground font-bold max-w-fit px-2 py-0.5 rounded bg-muted">{userRankStr}</span> dari {(totalUsersDummy).toLocaleString()} pengguna.
                    </p>
                ) : (
                    <p className="text-sm text-stone-400 font-medium">
                        Silakan login untuk melihat peringkat dan poin kamu.
                    </p>
                )}
            </div>
        </div>
    );
}
