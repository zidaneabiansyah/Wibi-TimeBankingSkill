'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading";
import { m } from "framer-motion";
import { Zap, Users, TrendingUp, Star } from "lucide-react";
import type { UserProfile, UserStats } from "@/types";

interface StatsCardsProps {
    user: UserProfile | null;
    stats: UserStats | null;
    isLoading: boolean;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function StatsCards({ user, stats, isLoading }: StatsCardsProps) {
    const availableCredits = ((user?.credit_balance || 0) - (user?.credit_held || 0)).toFixed(1);
    const heldCredits = (user?.credit_held || 0).toFixed(1);

    return (
        <m.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                    },
                },
            }}
        >
            {/* Credit Balance Card */}
            <m.div variants={cardVariants}>
                <Card className="border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Zap className="h-4 w-4 text-secondary" />
                            Credit Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton className="h-9 w-20" />
                        ) : (
                            <div>
                                <div className="text-3xl font-bold text-primary">
                                    {availableCredits}
                                </div>
                                <div className="flex flex-col gap-2 mt-2 text-xs">
                                    <p className="text-muted-foreground">Available credits</p>
                                    {parseFloat(heldCredits) > 0 && (
                                        <p className="text-secondary font-medium flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                                            {heldCredits} held in escrow
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </m.div>

            {/* Sessions as Teacher */}
            <m.div variants={cardVariants}>
                <Card className="border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Users className="h-4 w-4 text-secondary" />
                            Teaching
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton className="h-9 w-16" />
                        ) : (
                            <div>
                                <div className="text-3xl font-bold text-primary">
                                    {stats?.total_sessions_as_teacher || 0}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    {stats?.total_credits_earned?.toFixed(1) || '0.0'} credits earned
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </m.div>

            {/* Sessions as Student */}
            <m.div variants={cardVariants}>
                <Card className="border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <TrendingUp className="h-4 w-4 text-secondary" />
                            Learning
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton className="h-9 w-16" />
                        ) : (
                            <div>
                                <div className="text-3xl font-bold text-primary">
                                    {stats?.total_sessions_as_student || 0}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    {stats?.total_credits_spent?.toFixed(1) || '0.0'} credits spent
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </m.div>

            {/* Average Rating */}
            <m.div variants={cardVariants}>
                <Card className="border-border/40 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Star className="h-4 w-4 text-secondary fill-secondary" />
                            Your Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSkeleton className="h-9 w-12" />
                        ) : (
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="text-3xl font-bold text-secondary">
                                        {stats?.average_rating_as_teacher?.toFixed(1) || 'N/A'}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">As teacher</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </m.div>
        </m.div>
    );
}
