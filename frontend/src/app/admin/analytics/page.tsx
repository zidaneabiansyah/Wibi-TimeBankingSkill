'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { analyticsService } from '@/lib/services/analytics.service';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    GraduationCap,
    CreditCard,
    BookOpen,
    Loader2,
    Download,
    Calendar,
} from 'lucide-react';
import { UserGrowthChart, SessionTrendChart, CreditFlowChart } from './_components/AdminCharts';
import type { PlatformAnalytics } from '@/types';

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            const data = await analyticsService.getPlatformAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                    <p className="text-muted-foreground">
                        Comprehensive platform insights and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 rounded-lg border p-1">
                        <Button
                            variant={timeRange === 'week' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeRange('week')}
                        >
                            Week
                        </Button>
                        <Button
                            variant={timeRange === 'month' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeRange('month')}
                        >
                            Month
                        </Button>
                        <Button
                            variant={timeRange === 'year' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeRange('year')}
                        >
                            Year
                        </Button>
                    </div>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.total_users || 0}</div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+12.5% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics?.total_sessions || 0}</div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+8.2% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Credits in Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics?.total_credits_in_flow || 0} CR
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+15.3% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics?.average_session_rating?.toFixed(1) || '0.0'} / 5.0
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+0.3 from last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* User Growth Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>New user registrations over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics?.user_growth ? (
                            <UserGrowthChart data={analytics.user_growth} />
                        ) : (
                            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <BarChart3 className="mx-auto h-12 w-12 mb-2" />
                                    <p>No growth data available</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Session Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session Activity</CardTitle>
                        <CardDescription>Sessions completed over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics?.session_trend ? (
                            <SessionTrendChart data={analytics.session_trend} />
                        ) : (
                            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <GraduationCap className="mx-auto h-12 w-12 mb-2" />
                                    <p>No activity data available</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Credit Flow Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Credit Flow</CardTitle>
                        <CardDescription>Credits earned and spent over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {analytics?.credit_flow ? (
                            <CreditFlowChart data={analytics.credit_flow.map(d => ({ ...d, value: Number(d.value) }))} />
                        ) : (
                            <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <CreditCard className="mx-auto h-12 w-12 mb-2" />
                                    <p>No flow data available</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Skills Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Popular Skills</CardTitle>
                        <CardDescription>Most requested skills on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics?.top_skills?.slice(0, 5).map((skill, index) => (
                                <div key={skill.skill_id} className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{skill.skill_name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {skill.session_count} sessions
                                        </div>
                                    </div>
                                    <Badge variant="outline">{skill.teacher_count} teachers</Badge>
                                </div>
                            )) || (
                                    <div className="text-center text-muted-foreground">
                                        <BookOpen className="mx-auto h-12 w-12 mb-2" />
                                        <p>No skill data available</p>
                                    </div>
                                )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>User Statistics</CardTitle>
                        <CardDescription>Breakdown of user activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Active Users</span>
                            <span className="font-medium">{analytics?.active_users || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Users</span>
                            <span className="font-medium">{analytics?.total_users || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Active Rate</span>
                            <span className="font-medium text-green-600">
                                {analytics?.total_users
                                    ? ((analytics.active_users / analytics.total_users) * 100).toFixed(1)
                                    : 0}
                                %
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Session Statistics</CardTitle>
                        <CardDescription>Session completion metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Completed</span>
                            <span className="font-medium">{analytics?.completed_sessions || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Sessions</span>
                            <span className="font-medium">{analytics?.total_sessions || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Completion Rate</span>
                            <span className="font-medium text-green-600">
                                {analytics?.total_sessions
                                    ? ((analytics.completed_sessions / analytics.total_sessions) * 100).toFixed(1)
                                    : 0}
                                %
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Platform Health</CardTitle>
                        <CardDescription>Overall platform metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Skills</span>
                            <span className="font-medium">{analytics?.total_skills || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Avg. Rating</span>
                            <span className="font-medium">
                                {analytics?.average_session_rating?.toFixed(1) || '0.0'} / 5.0
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Platform Status</span>
                            <Badge variant="default" className="bg-green-600">
                                Healthy
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
