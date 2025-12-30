'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal, Trophy, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type TimeRange = 'weekly' | 'monthly' | 'all-time';

interface LeaderboardEntry {
    rank: number;
    user: {
        id: number;
        name: string;
        username: string;
        avatar?: string;
    };
    value: number;
    change?: number; // Rank change
}

interface LeaderboardCardProps {
    title: string;
    icon?: React.ReactNode;
    entries: LeaderboardEntry[];
    valueLabel: string;
    onTimeRangeChange?: (range: TimeRange) => void;
    className?: string;
}

export function LeaderboardCard({
    title,
    icon,
    entries,
    valueLabel,
    onTimeRangeChange,
    className,
}: LeaderboardCardProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('all-time');

    const handleRangeChange = (value: TimeRange) => {
        setTimeRange(value);
        onTimeRangeChange?.(value);
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-slate-400 fill-slate-400" />;
            case 3:
                return <Medal className="h-5 w-5 text-amber-600 fill-amber-600" />;
            default:
                return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-500/10 border-yellow-500/20';
            case 2:
                return 'bg-slate-400/10 border-slate-400/20';
            case 3:
                return 'bg-amber-600/10 border-amber-600/20';
            default:
                return 'bg-card border-border hover:bg-muted/50';
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        {icon || <Crown className="h-4 w-4" />}
                        {title}
                    </CardTitle>
                    <Select value={timeRange} onValueChange={handleRangeChange}>
                        <SelectTrigger className="w-[110px] h-8 text-xs">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="all-time">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {entries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No entries yet
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div
                            key={entry.user.id}
                            className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${getRankColor(entry.rank)}`}
                        >
                            <div className="flex items-center justify-center w-8 shrink-0">
                                {getRankIcon(entry.rank)}
                            </div>
                            
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                                <AvatarFallback>{entry.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate leading-none">
                                    {entry.user.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    @{entry.user.username}
                                </p>
                            </div>

                            <div className="text-right shrink-0">
                                <div className="font-bold text-sm">
                                    {typeof entry.value === 'number' && entry.value % 1 !== 0 
                                        ? entry.value.toFixed(1) 
                                        : entry.value}
                                </div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    {valueLabel}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
