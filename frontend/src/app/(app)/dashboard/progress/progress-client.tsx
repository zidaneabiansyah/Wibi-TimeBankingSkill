'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSkillStore } from '@/stores/skill.store';
import { useBadgeStore } from '@/stores/badge.store';
import { TrendingUp, Award, Target, BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading';
import type { UserSkill } from '@/types';

export function ProgressClient() {
    const { userSkills, isLoadingUserSkills, fetchUserSkills } = useSkillStore();
    const { userBadges, fetchUserBadges } = useBadgeStore();

    useEffect(() => {
        fetchUserSkills();
        fetchUserBadges();
    }, [fetchUserSkills, fetchUserBadges]);

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Learning Progress</h1>
                        <p className="text-muted-foreground">Track your skill development and achievements</p>
                    </div>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{userSkills.length}</p>
                                    <p className="text-xs text-muted-foreground">Skills Learning</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Target className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userSkills.filter((p: UserSkill) => (p.total_sessions || 0) >= 10).length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userSkills.filter((p: UserSkill) => (p.total_sessions || 0) > 0 && (p.total_sessions || 0) < 10).length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">In Progress</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Award className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{userBadges.length}</p>
                                    <p className="text-xs text-muted-foreground">Badges Earned</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Skill Progress List */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Your Skills</h2>
                    {isLoadingUserSkills ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <LoadingSkeleton className="h-20 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : userSkills.length === 0 ? (
                        <EmptyState
                            icon={BookOpen}
                            title="No progress yet"
                            description="Start learning skills to track your progress here!"
                            action={{
                                label: 'Browse Skills',
                                onClick: () => window.location.href = '/marketplace',
                            }}
                            variant="card"
                        />
                    ) : (
                        <div className="space-y-4">
                            {userSkills.map((progress: UserSkill) => {
                                const progressPercentage = Math.min(((progress.total_sessions || 0) / 10) * 100, 100);
                                return (
                                    <Card key={progress.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{progress.skill?.name || 'Unknown Skill'}</CardTitle>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {progress.total_sessions || 0} sessions completed
                                                    </p>
                                                </div>
                                                <Badge variant={progressPercentage >= 100 ? 'default' : 'secondary'}>
                                                    {progressPercentage >= 100 ? 'Completed' : 'In Progress'}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-medium">{Math.round(progressPercentage)}%</span>
                                                </div>
                                                <Progress value={progressPercentage} className="h-2" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Level</p>
                                                    <p className="font-medium capitalize">{progress.level}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Rating</p>
                                                    <p className="font-medium">
                                                        ⭐ {progress.average_rating?.toFixed(1) || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Badges Section */}
                {userBadges.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Your Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {userBadges.map((userBadge) => (
                                <Card key={userBadge.id} className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="text-4xl mb-2">{userBadge.badge?.icon}</div>
                                        <p className="text-sm font-medium">{userBadge.badge?.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(userBadge.earned_at).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
