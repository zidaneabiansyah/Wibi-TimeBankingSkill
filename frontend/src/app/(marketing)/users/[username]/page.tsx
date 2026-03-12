'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, MapPin, GraduationCap, Clock, Star, Users, ArrowLeft, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userService } from '@/lib/services/user.service';
import type { UserProfile } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    // In Next.js App Router, params are strings. We decode the username since it might have URL encoding (e.g. @username)
    // The param in the URL will likely contain the '@', so we need to handle that. 
    // The backend expects just the username string after the '@' or the full string if passed directly.
    const rawUsername = Array.isArray(params.username) ? params.username[0] : params.username;
    
    // Clean up the username. If it starts with '%40' or '@', strip it because the API path is `/users/@${username}` in userService
    const username = rawUsername ? decodeURIComponent(rawUsername).replace('@', '') : '';

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return;
            try {
                setLoading(true);
                const data = await userService.getPublicProfileByUsername(username);
                setProfile(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load profile:', err);
                setError('User not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">User Not Found</h2>
                    <p className="text-muted-foreground mb-6">The profile you are looking for does not exist.</p>
                    <Button onClick={() => router.push('/marketplace')}>Go to Marketplace</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-20 font-['Plus_Jakarta_Sans']">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back Button */}
                <div className="mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.back()} 
                        className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Main Profile Info */}
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-background shadow-md mb-6 relative">
                                <img 
                                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.full_name}&background=random&size=256`} 
                                    alt={profile.full_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">
                                {profile.full_name}
                            </h1>
                            <p className="text-primary font-medium text-sm mb-4">
                                @{profile.username}
                            </p>

                            {profile.bio && (
                                <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                                    {profile.bio}
                                </p>
                            )}

                            <div className="w-full space-y-3 pt-6 border-t border-border">
                                {profile.location && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-3 shrink-0 text-muted-foreground/70" />
                                        <span className="truncate">{profile.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4 mr-3 shrink-0 text-muted-foreground/70" />
                                    <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Education Card */}
                        {(profile.school || profile.major) && (
                            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                                <h3 className="font-bold text-foreground flex items-center mb-4 text-[16px]">
                                    <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                                    Education
                                </h3>
                                <div className="space-y-4">
                                    {profile.school && (
                                        <div>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">School / University</p>
                                            <p className="text-sm font-medium text-foreground">{profile.school} {profile.grade ? `(${profile.grade})` : ''}</p>
                                        </div>
                                    )}
                                    {profile.major && (
                                        <div>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Major / Field of Study</p>
                                            <p className="text-sm font-medium text-foreground">{profile.major}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Statistics & Skills */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Statistics Grid */}
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-6 px-1">Mentor Statistics</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-black text-foreground mb-1">{profile.total_sessions_as_teacher || 0}</p>
                                    <p className="text-sm font-medium text-muted-foreground">Sessions Taught</p>
                                </div>
                                
                                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 text-amber-500">
                                        <Star className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-black text-foreground mb-1">{profile.average_rating_as_teacher ? profile.average_rating_as_teacher.toFixed(1) : '0.0'}</p>
                                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-500">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-black text-foreground mb-1">{profile.total_teaching_hours ? (profile.total_teaching_hours / 60).toFixed(1) : '0'}</p>
                                    <p className="text-sm font-medium text-muted-foreground">Hours Taught</p>
                                </div>
                            </div>
                        </div>

                        {/* Note about skills */}
                        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-foreground mb-2">Want to learn from {profile.full_name}?</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Check out their available skills and offerings in the marketplace to book a learning session.
                                </p>
                            </div>
                            <Button asChild className="shrink-0 rounded-xl px-6">
                                <Link href="/marketplace">
                                    Browse Marketplace
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
