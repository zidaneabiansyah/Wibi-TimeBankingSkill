'use client';

import { useEffect, useState } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, CreditCard, BookOpen, Loader2, TrendingUp } from 'lucide-react';
import type { PlatformAnalytics } from '@/types';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await analyticsService.getPlatformAnalytics();
                setAnalytics(data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your platform's performance
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => analyticsService.exportAnalytics('csv')}
                        disabled={isLoading}
                    >
                        Export CSV
                    </Button>
                    <Button 
                        onClick={() => analyticsService.exportAnalytics('pdf')}
                        disabled={isLoading}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Users"
                    value={analytics?.total_users || 0}
                    description={`${analytics?.active_users || 0} active users`}
                    icon={Users}
                    trend={{
                        value: '+12.5%',
                        isPositive: true,
                    }}
                />
                <StatsCard
                    title="Total Sessions"
                    value={analytics?.total_sessions || 0}
                    description={`${analytics?.completed_sessions || 0} completed`}
                    icon={GraduationCap}
                    trend={{
                        value: '+8.2%',
                        isPositive: true,
                    }}
                />
                <StatsCard
                    title="Total Credits"
                    value={`${analytics?.total_credits_in_flow || 0} CR`}
                    description="Credits in circulation"
                    icon={CreditCard}
                    trend={{
                        value: '+15.3%',
                        isPositive: true,
                    }}
                />
                <StatsCard
                    title="Active Skills"
                    value={analytics?.total_skills || 0}
                    description="Skills with teachers"
                    icon={BookOpen}
                    trend={{
                        value: '+5.1%',
                        isPositive: true,
                    }}
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest platform activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
                                analytics.recent_activity.map((activity) => (
                                    <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-4">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                            activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-950' :
                                            activity.type === 'session' ? 'bg-green-100 dark:bg-green-950' :
                                            'bg-purple-100 dark:bg-purple-950'
                                        }`}>
                                            {activity.type === 'user' && <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                            {activity.type === 'session' && <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />}
                                            {activity.type === 'skill' && <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.details} • {new Date(activity.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No recent activity</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>
                            Key metrics at a glance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avg. Session Duration</span>
                                <span className="text-sm font-medium">1.5 hours</span>{/* TODO: Add duration tracking */}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avg. Rating</span>
                                <span className="text-sm font-medium">{analytics?.average_session_rating.toFixed(1) || '0.0'} / 5.0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Completion Rate</span>
                                <span className="text-sm font-medium">
                                    {analytics && analytics.total_sessions > 0 
                                        ? Math.round((analytics.completed_sessions / analytics.total_sessions) * 100) 
                                        : 0}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Active Teachers</span>
                                <span className="text-sm font-medium">{analytics?.active_users || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
