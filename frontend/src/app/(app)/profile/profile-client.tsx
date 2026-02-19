'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import { useSkillStore } from '@/stores/skill.store';
import { useBadgeStore } from '@/stores/badge.store';
import {
    Edit,
    Mail,
    MapPin,
    Calendar,
    Award,
    BookOpen,
    Star,
    Users,
    TrendingUp,
    Settings
} from 'lucide-react';

export function ProfileClient() {
    const { user } = useAuthStore();
    const { stats, fetchStats } = useUserStore();
    const { userSkills, fetchUserSkills } = useSkillStore();
    const { userBadges, fetchUserBadges } = useBadgeStore();

    useEffect(() => {
        fetchStats();
        fetchUserSkills();
        fetchUserBadges();
    }, [fetchStats, fetchUserSkills, fetchUserBadges]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <div className="flex gap-2">
                        <Link href="/profile/edit">
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </Link>
                        <Link href="/profile/settings">
                            <Button variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={user?.avatar || ''} alt={user?.full_name} />
                                        <AvatarFallback className="text-2xl">
                                            {user?.full_name ? getInitials(user.full_name) : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-2xl font-bold">{user?.full_name}</h2>
                                        <p className="text-muted-foreground">@{user?.username}</p>
                                    </div>
                                    {user?.bio && (
                                        <p className="text-sm text-muted-foreground">{user.bio}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{user?.email}</span>
                                </div>
                                {user?.school && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{user.school}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Badges */}
                        {userBadges.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Badges ({userBadges.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {userBadges.slice(0, 8).map((userBadge) => (
                                            <Badge key={userBadge.id} variant="secondary" className="text-xs">
                                                {userBadge.badge?.icon} {userBadge.badge?.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    {userBadges.length > 8 && (
                                        <Link href="/profile/badges">
                                            <Button variant="ghost" size="sm" className="w-full mt-3">
                                                View All Badges
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Stats & Skills */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-2xl font-bold">{userSkills.length}</p>
                                        <p className="text-xs text-muted-foreground">Skills</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                                            <Users className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="text-2xl font-bold">{stats?.total_sessions_as_teacher || 0}</p>
                                        <p className="text-xs text-muted-foreground">Teaching</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                                            <TrendingUp className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <p className="text-2xl font-bold">{stats?.total_sessions_as_student || 0}</p>
                                        <p className="text-xs text-muted-foreground">Learning</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                                            <Star className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <p className="text-2xl font-bold">
                                            {stats?.average_rating_as_teacher?.toFixed(1) || 'N/A'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Rating</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* My Skills */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>My Skills</CardTitle>
                                    <Link href="/dashboard/skills">
                                        <Button variant="ghost" size="sm">View All</Button>
                                    </Link>
                                </div>
                                <CardDescription>Skills you teach</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {userSkills.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No skills added yet</p>
                                        <Link href="/profile/skills/new">
                                            <Button variant="outline" size="sm" className="mt-3">
                                                Add Your First Skill
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {userSkills.slice(0, 4).map((userSkill: any) => (
                                            <Card key={userSkill.id} className="border-border/50">
                                                <CardContent className="pt-4">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium truncate">{userSkill.skill?.name}</h4>
                                                            <p className="text-xs text-muted-foreground capitalize">{userSkill.level}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            ⭐ {userSkill.average_rating?.toFixed(1) || 'N/A'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                                                        <span>{userSkill.total_students || 0} students</span>
                                                        <span>{userSkill.total_sessions || 0} sessions</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <Link href="/dashboard/sessions">
                                        <Button variant="outline" className="w-full">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Sessions
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/transactions">
                                        <Button variant="outline" className="w-full">
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Transactions
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/availability">
                                        <Button variant="outline" className="w-full">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Availability
                                        </Button>
                                    </Link>
                                    <Link href="/profile/favorites">
                                        <Button variant="outline" className="w-full">
                                            <Star className="h-4 w-4 mr-2" />
                                            Favorites
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/progress">
                                        <Button variant="outline" className="w-full">
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Progress
                                        </Button>
                                    </Link>
                                    <Link href="/profile/settings">
                                        <Button variant="outline" className="w-full">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
