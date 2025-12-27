'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
import { skillService } from '@/lib/services';
import { useAuthStore } from '@/stores/auth.store';
import type { Skill, UserSkill } from '@/types';
import { TeacherAvailability } from '@/components/marketplace/TeacherAvailability';

export default function SkillDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const skillId = Number(params.skillId);

    const [skill, setSkill] = useState<Skill | null>(null);
    const [teachers, setTeachers] = useState<UserSkill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const skillData = await skillService.getSkillById(skillId);
                setSkill(skillData);
                
                // Fetch teachers for this skill
                const teachersData = await skillService.getSkillTeachers(skillId);
                setTeachers(teachersData);
            } catch (err: any) {
                setError(err.message || 'Failed to load skill');
            } finally {
                setIsLoading(false);
            }
        };

        if (skillId) {
            fetchData();
        }
    }, [skillId]);

    const handleBookSession = (userSkillId: number) => {
        if (!isAuthenticated) {
            router.push('/login?redirect=' + encodeURIComponent(`/book/${userSkillId}`));
            return;
        }
        router.push(`/book/${userSkillId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading skill details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !skill) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-red-500">{error || 'Skill not found'}</p>
                        <Link href="/marketplace">
                            <Button className="mt-6">Back to Marketplace</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col space-y-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                            Marketplace
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                        <span className="text-foreground font-medium">{skill.name}</span>
                    </nav>

                    {/* Skill Header Card */}
                    <Card className="overflow-hidden bg-linear-to-br from-card/80 to-card border-border/50">
                        <div className="flex flex-col md:flex-row">
                            {/* Skill Icon/Image */}
                            <div className="w-full md:w-72 lg:w-80 shrink-0">
                                <div className="aspect-square md:h-full w-full overflow-hidden bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                    {skill.icon ? (
                                        <span className="text-8xl">{skill.icon}</span>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            
                            {/* Skill Info */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                <div className="space-y-4">
                                    <div>
                                        <Badge variant="outline" className="capitalize mb-3 border-primary/30 text-primary bg-primary/5">
                                            {skill.category}
                                        </Badge>
                                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{skill.name}</h1>
                                    </div>
                                    
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {skill.description || 'No description available for this skill.'}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{skill.total_teachers || 0}</p>
                                                <p className="text-xs text-muted-foreground">Teachers</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{skill.total_learners || 0}</p>
                                                <p className="text-xs text-muted-foreground">Learners</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">1</p>
                                                <p className="text-xs text-muted-foreground">Credit/hour</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Teachers Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Available Teachers</h2>
                                <p className="text-muted-foreground mt-1">
                                    {teachers.length > 0 
                                        ? `${teachers.length} teacher${teachers.length > 1 ? 's' : ''} ready to help you learn`
                                        : 'Be the first to teach this skill!'
                                    }
                                </p>
                            </div>
                            {teachers.length > 0 && (
                                <Badge variant="outline" className="hidden sm:flex">
                                    {teachers.length} Available
                                </Badge>
                            )}
                        </div>

                        {teachers.length === 0 ? (
                            <Card className="bg-card/50 border-border/50 border-dashed">
                                <CardContent className="py-16 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mx-auto mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No teachers available yet</h3>
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        Be the first to share your knowledge! Add this skill to your profile and start teaching others.
                                    </p>
                                    <Link href="/dashboard/skills">
                                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                <path d="M12 5v14" />
                                                <path d="M5 12h14" />
                                            </svg>
                                            Add This Skill
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teachers.map((teacher) => (
                                    <Card key={teacher.id} className="group bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-xl font-semibold ring-2 ring-border group-hover:ring-primary/30 transition-all">
                                                    {teacher.user?.full_name?.charAt(0).toUpperCase() || 'T'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg truncate">{teacher.user?.full_name || 'Teacher'}</CardTitle>
                                                    <CardDescription className="truncate">@{teacher.user?.username || 'unknown'}</CardDescription>
                                                </div>
                                                {teacher.is_available && (
                                                    <div className="flex h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-500/20" title="Available" />
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-q0">
                                                {teacher.description || 'Ready to help you learn this skill!'}
                                            </p>
                                            
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                    <span className="font-medium">{teacher.average_rating?.toFixed(1) || 'New'}</span>
                                                </div>
                                                <span className="text-border">•</span>
                                                <span className="text-sm text-muted-foreground">{teacher.total_sessions || 0} sessions</span>
                                                <span className="text-border">•</span>
                                                <Badge variant="outline" className="capitalize text-xs border-border/50">{teacher.level}</Badge>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                <TeacherAvailability userId={teacher.user?.id || 0} compact />
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                <div className="flex items-center gap-1.5 text-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    <span className="font-semibold">{teacher.hourly_rate || 1} Credit/hour</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0">
                                            <Button 
                                                className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all" 
                                                onClick={() => handleBookSession(teacher.id)}
                                                disabled={!teacher.is_available}
                                            >
                                                {teacher.is_available ? (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                                            <line x1="16" x2="16" y1="2" y2="6" />
                                                            <line x1="8" x2="8" y1="2" y2="6" />
                                                            <line x1="3" x2="21" y1="10" y2="10" />
                                                        </svg>
                                                        Book Session
                                                    </>
                                                ) : 'Not Available'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
