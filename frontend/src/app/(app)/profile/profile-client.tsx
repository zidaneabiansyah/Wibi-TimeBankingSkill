'use client';

import { useEffect } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
});
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
    Settings,
    Activity
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
        <main className={`container mx-auto px-4 py-8 mb-20 max-w-7xl ${plusJakartaSans.className}`}>
            <div className="flex flex-col space-y-6">

                {/* Hero / Cover Section */}
                <div className="relative mb-8 md:mb-12">
                    <div className="rounded-4xl overflow-hidden bg-linear-to-r from-orange-500/20 via-primary/10 to-blue-500/20 border border-border/40 shadow-sm h-48 md:h-64 relative">
                        <div className="absolute inset-0 backdrop-blur-3xl bg-background/10"></div>
                    </div>

                    {/* User Avatar & Actions overlapping the cover */}
                    <div className="absolute -bottom-14 left-8 md:left-12 flex items-end justify-between gap-6 z-10 w-[calc(100%-4rem)] md:w-[calc(100%-6rem)]">
                        <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-background shadow-xl rounded-2xl md:rounded-3xl bg-background shrink-0">
                            <AvatarImage src={user?.avatar || ''} alt={user?.full_name} className="object-cover rounded-2xl md:rounded-3xl" />
                            <AvatarFallback className="text-3xl md:text-5xl font-bold bg-card rounded-2xl md:rounded-3xl text-foreground">
                                {user?.full_name ? getInitials(user.full_name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex gap-3 shrink-0 transition-transform">
                            <Link href="/profile/edit">
                                <Button variant="secondary" className="backdrop-blur-md bg-card/10 hover:bg-card/20 border border-border shadow-sm font-semibold rounded-xl text-foreground">
                                    <Edit className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">Edit Profile</span>
                                </Button>
                            </Link>
                            <Link href="/profile/settings">
                                <Button variant="secondary" size="icon" className="backdrop-blur-md bg-card/10 hover:bg-card/20 border border-border shadow-sm rounded-xl text-foreground">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Name and Bio directly below Avatar */}
                <div className="px-8 md:px-12 mt-8 md:mt-12 mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{user?.full_name}</h1>
                    <p className="text-lg text-muted-foreground font-medium mb-4">@{user?.username}</p>
                    {user?.bio && (
                        <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">{user.bio}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-8">

                    {/* Left Sidebar (Col span 4) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Contact Info */}
                        <Card className="border-border/20 bg-card/20 backdrop-blur-xl shadow-none hover:bg-card/40 transition-all rounded-4xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <span className="truncate font-medium text-muted-foreground">{user?.email}</span>
                                </div>
                                {user?.school && (
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <span className="truncate font-medium text-muted-foreground">{user.school}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-muted-foreground">
                                        Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Badges Layout */}
                        {userBadges.length > 0 && (
                            <Card className="border-border/20 bg-card/20 backdrop-blur-xl shadow-none hover:bg-card/40 transition-all rounded-4xl">
                                <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        Badges
                                    </CardTitle>
                                    <Award className="h-4 w-4 text-orange-500 opacity-50" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {userBadges.slice(0, 8).map((userBadge) => (
                                            <Badge key={userBadge.id} variant="secondary" className="px-3 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 border-transparent rounded-full transition-all text-white font-semibold">
                                                {userBadge.badge?.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    {userBadges.length > 8 && (
                                        <Link href="/profile/badges">
                                            <Button variant="ghost" size="sm" className="w-full mt-6 rounded-xl text-orange-500 text-xs font-bold uppercase tracking-widest hover:text-orange-400 hover:bg-orange-500/10">
                                                View All Badges
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Links */}
                        <Card className="border-border/20 bg-card/20 backdrop-blur-xl shadow-none hover:bg-card/40 transition-all rounded-4xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Shortcuts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <Link href="/dashboard/sessions" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                                    <Calendar className="h-4 w-4 text-blue-400" /> Sessions
                                </Link>
                                <Link href="/dashboard/transactions" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                                    <TrendingUp className="h-4 w-4 text-green-400" /> Transactions
                                </Link>
                                <Link href="/dashboard/availability" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                                    <Calendar className="h-4 w-4 text-purple-400" /> Availability
                                </Link>
                                <Link href="/profile/favorites" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                                    <Star className="h-4 w-4 text-amber-400" /> Favorites
                                </Link>
                                <Link href="/dashboard/progress" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                                    <Activity className="h-4 w-4 text-rose-400" /> Progress
                                </Link>
                                <Link href="/profile/settings" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                                    <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Main Content (Col span 8) */}
                    <div className="lg:col-span-8 flex flex-col gap-8 md:gap-10">

                        {/* Unified Stats Overview Panel */}
                        <Card className="relative overflow-hidden border-border/20 bg-card/20 backdrop-blur-2xl shadow-none hover:shadow-xl rounded-4xl p-1 transition-all flex justify-center items-center">
                            {/* Subtle internal grid styling */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 relative z-10 w-full divide-x divide-y lg:divide-y-0 divide-border/10">

                                {/* Skills Stat */}
                                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-muted/50 transition-colors rounded-tl-3xl lg:rounded-l-3xl lg:rounded-tr-none border-t border-transparent hover:border-primary/20">
                                    <div className="flex flex-col items-center gap-2 text-4xl font-bold mb-3 group-hover:scale-110 group-hover:text-primary transition-all tabular-nums tracking-tighter text-foreground">
                                        <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary/70 mb-1 md:mb-2" />
                                        <span>{userSkills.length}</span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                        Authored
                                    </span>
                                </div>

                                {/* Teaching Stat */}
                                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-muted/50 transition-colors rounded-tr-3xl lg:rounded-none border-t border-transparent hover:border-green-500/20">
                                    <div className="flex flex-col items-center gap-2 text-4xl font-bold mb-3 group-hover:scale-110 group-hover:text-green-500 transition-all tabular-nums tracking-tighter text-foreground">
                                        <Users className="h-6 w-6 md:h-8 md:w-8 text-green-500/70 mb-1 md:mb-2" />
                                        <span>{stats?.total_sessions_as_teacher || 0}</span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-green-500 transition-colors">
                                        Taught
                                    </span>
                                </div>

                                {/* Learning Stat */}
                                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-muted/50 transition-colors rounded-bl-3xl lg:rounded-none border-t border-transparent hover:border-blue-500/20">
                                    <div className="flex flex-col items-center gap-2 text-4xl font-bold mb-3 group-hover:scale-110 group-hover:text-blue-500 transition-all tabular-nums tracking-tighter text-foreground">
                                        <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-blue-500/70 mb-1 md:mb-2" />
                                        <span>{stats?.total_sessions_as_student || 0}</span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-blue-500 transition-colors">
                                        Learned
                                    </span>
                                </div>

                                {/* Rating Stat */}
                                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:bg-muted/50 transition-colors rounded-br-3xl lg:rounded-r-3xl lg:rounded-bl-none border-t border-transparent hover:border-amber-500/20">
                                    <div className="flex flex-col items-center justify-center gap-2 text-4xl font-bold mb-3 group-hover:scale-110 transition-all text-amber-500 tabular-nums tracking-tighter">
                                        <Star className="h-6 w-6 md:h-8 md:w-8 fill-amber-500/50 mb-1 md:mb-2" />
                                        <span>{stats?.average_rating_as_teacher?.toFixed(1) || '0.0'}</span>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-amber-500 transition-colors">
                                        Rating
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* My Skills Grid */}
                        <div className="mt-2">
                            <div className="flex justify-between items-end mb-6 px-1">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tighter text-foreground">Offered Skills</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Expertise you bring to the community</p>
                                </div>
                                <Link href="/dashboard/skills">
                                    <Button variant="ghost" size="sm" className="rounded-xl font-bold hover:bg-muted text-xs uppercase tracking-widest hidden sm:inline-flex text-muted-foreground hover:text-foreground">View All</Button>
                                </Link>
                            </div>

                            {userSkills.length === 0 ? (
                                <Card className="border-border/10 border-dashed bg-card/20 backdrop-blur-sm rounded-4xl">
                                    <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center">
                                        <h4 className="font-bold text-lg text-muted-foreground mb-2">No skills established</h4>
                                        <p className="text-sm mb-8 max-w-sm text-muted-foreground">You haven't added any skills to your profile yet. Start sharing your knowledge.</p>
                                        <Link href="/profile/skills/new">
                                            <Button className="rounded-full h-12 px-8 shadow-lg hover:shadow-orange-500/20 hover:scale-105 transition-all bg-orange-600 text-white font-bold uppercase tracking-widest text-[10px]">
                                                Add First Skill
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {userSkills.slice(0, 4).map((userSkill: any) => (
                                        <Card key={userSkill.id} className="relative overflow-hidden border-border/20 bg-card/20 backdrop-blur-xl hover:bg-card/40 hover:border-border/40 transition-all duration-300 group rounded-4xl shadow-none hover:shadow-xl">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[3rem] -mr-10 -mt-10 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
                                            <CardContent className="p-6 flex flex-col h-full z-10 relative">
                                                <div className="flex items-start justify-between gap-3 mb-6">
                                                    <h4 className="font-bold text-lg leading-tight line-clamp-2 text-foreground">{userSkill.skill?.name}</h4>
                                                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 font-bold border-none shrink-0 rounded-xl px-2 py-1">
                                                        ⭐ {userSkill.average_rating?.toFixed(1) || '0.0'}
                                                    </Badge>
                                                </div>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-[0.2em] bg-muted border-border text-muted-foreground rounded-xl px-3 py-1.5">
                                                        {userSkill.level}
                                                    </Badge>
                                                    <div className="flex gap-4 text-xs font-bold text-muted-foreground">
                                                        <span className="flex items-center gap-1.5 tooltip-trigger" title="Students"><Users className="h-3.5 w-3.5" /> {userSkill.total_students || 0}</span>
                                                        <span className="flex items-center gap-1.5 tooltip-trigger" title="Sessions"><Calendar className="h-3.5 w-3.5" /> {userSkill.total_sessions || 0}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            {userSkills.length > 0 && (
                                <div className="mt-6 sm:hidden text-center">
                                    <Link href="/dashboard/skills">
                                        <Button variant="ghost" className="w-full rounded-2xl font-bold bg-muted text-xs uppercase tracking-widest text-muted-foreground">View All Skills</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
