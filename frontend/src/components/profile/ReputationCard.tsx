'use client';

import { useEffect, useState } from 'react';
import { Award, Star, TrendingUp, Users, Medal, Sparkles, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { communityService } from '@/lib/services/community.service';
import type { Endorsement } from '@/types';

interface ReputationCardProps {
    userId: number;
    userName?: string;
    compact?: boolean;
}

function getReputationLevel(reputation: number): { label: string; color: string; icon: LucideIcon } {
    if (reputation >= 100) return { label: 'Legend', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: Sparkles };
    if (reputation >= 50) return { label: 'Expert', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: Award };
    if (reputation >= 25) return { label: 'Skilled', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: Medal };
    if (reputation >= 10) return { label: 'Active', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: TrendingUp };
    if (reputation >= 1) return { label: 'Newcomer', color: 'bg-gradient-to-r from-gray-500 to-slate-500', icon: Star };
    return { label: 'Getting Started', color: 'bg-gray-400', icon: Star };
}

export function ReputationCard({ userId, userName, compact = false }: ReputationCardProps) {
    const [reputation, setReputation] = useState<number>(0);
    const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [rep, endResult] = await Promise.all([
                    communityService.getUserReputation(userId),
                    communityService.getUserEndorsements(userId, 5, 0)
                ]);
                setReputation(rep);
                setEndorsements(endResult.endorsements);
            } catch (error) {
                console.error('Failed to fetch reputation:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const level = getReputationLevel(reputation);
    const LevelIcon = level.icon;

    if (compact) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                <div className={`w-8 h-8 rounded-full ${level.color} flex items-center justify-center shadow-lg`}>
                    <LevelIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Reputation</span>
                    <span className="font-bold text-sm">{reputation} pts</span>
                </div>
                <Badge variant="secondary" className="ml-auto text-xs">
                    {level.label}
                </Badge>
            </div>
        );
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className={`${level.color} text-white`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                            <LevelIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Community Reputation</CardTitle>
                            <CardDescription className="text-white/80">
                                {userName ? `${userName}'s standing` : 'Your standing in the community'}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{reputation}</div>
                        <div className="text-sm text-white/80">{level.label}</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <div className="text-2xl font-bold text-primary">{endorsements.length}+</div>
                                <div className="text-xs text-muted-foreground">Endorsements</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <div className="text-2xl font-bold text-green-600">{level.label}</div>
                                <div className="text-xs text-muted-foreground">Level</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                                <div className="text-2xl font-bold text-blue-600">
                                    {reputation >= 100 ? '🏆' : reputation >= 50 ? '🥇' : reputation >= 25 ? '🥈' : reputation >= 10 ? '🥉' : '⭐'}
                                </div>
                                <div className="text-xs text-muted-foreground">Rank</div>
                            </div>
                        </div>

                        {/* Recent Endorsements */}
                        {endorsements.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Recent Endorsements
                                </h4>
                                <div className="space-y-2">
                                    {endorsements.slice(0, 3).map((endorsement) => (
                                        <div 
                                            key={endorsement.id} 
                                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                                {endorsement.endorser?.full_name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {endorsement.endorser?.full_name || 'Anonymous'}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Endorsed: {endorsement.skill?.name || 'A skill'}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="shrink-0 text-xs">
                                                +1 rep
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {endorsements.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">
                                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No endorsements yet</p>
                                <p className="text-xs">Get endorsed by others to build your reputation!</p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
