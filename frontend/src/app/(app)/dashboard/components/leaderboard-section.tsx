'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award } from "lucide-react";
import { m } from "framer-motion";
import type { UserBadge } from "@/types";
import type { LeaderboardEntry } from "@/lib/services/badge.service";

interface LeaderboardSectionProps {
    leaderboards: Record<string, LeaderboardEntry[]>;
    userBadges: UserBadge[];
}

export function LeaderboardSection({ leaderboards, userBadges }: LeaderboardSectionProps) {
    const ratingLeaderboard = leaderboards['rating'] || [];
    const sessionsLeaderboard = leaderboards['sessions'] || [];

    return (
        <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-6"
        >
            {/* User Badges */}
            {userBadges && userBadges.length > 0 && (
                <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-secondary" />
                            Your Badges
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {userBadges.slice(0, 6).map((userBadge) => (
                                <Badge
                                    key={userBadge.id}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                     {userBadge.badge?.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Rated Teachers */}
            {ratingLeaderboard.length > 0 && (
                <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Top Rated
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {ratingLeaderboard.slice(0, 5).map((entry, index) => (
                                <div
                                    key={entry.user_id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${index === 0 ? 'bg-amber-500/20 text-amber-500' :
                                            index === 1 ? 'bg-slate-400/20 text-slate-400' :
                                                index === 2 ? 'bg-orange-600/20 text-orange-600' :
                                                    'bg-muted text-muted-foreground'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{entry.full_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            ⭐ {entry.score?.toFixed(1)} rating
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Most Active */}
            {sessionsLeaderboard.length > 0 && (
                <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-primary" />
                            Most Active
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {sessionsLeaderboard.slice(0, 5).map((entry, index) => (
                                <div
                                    key={entry.user_id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${index === 0 ? 'bg-primary/20 text-primary' :
                                            index === 1 ? 'bg-slate-400/20 text-slate-400' :
                                                index === 2 ? 'bg-orange-600/20 text-orange-600' :
                                                    'bg-muted text-muted-foreground'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{entry.full_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {entry.score} sessions
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </m.div>
    );
}
