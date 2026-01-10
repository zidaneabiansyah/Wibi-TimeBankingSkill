'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSkillStore } from '@/stores/skill.store';
import { useAuthStore } from '@/stores/auth.store';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { m } from 'framer-motion';
import { Plus, Edit, Trash2, Star, Users, Clock, TrendingUp, BookOpen } from 'lucide-react';
import type { Skill, UserSkill } from '@/types';

export default function MySkillsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { userSkills, isLoadingUserSkills, fetchUserSkills } = useSkillStore();
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const loadSkills = async () => {
            try {
                setError(null);
                await fetchUserSkills();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load skills');
            }
        };

        loadSkills();
    }, [fetchUserSkills]);

    const handleDelete = async (skillId: number) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        setDeletingId(skillId);
        try {
            // TODO: Implement delete skill API call
            console.log('Deleting skill:', skillId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete skill');
        } finally {
            setDeletingId(null);
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <m.div className="flex items-center justify-between mb-8" {...fadeInUp}>
                        <div>
                            <h1 className="text-3xl font-bold">My Skills</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage the skills you're offering to teach
                            </p>
                        </div>
                        <Link href="/profile/skills/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Skill
                            </Button>
                        </Link>
                    </m.div>

                    {/* Error State */}
                    {error && (
                        <m.div className="mb-6" {...fadeInUp}>
                            <ErrorState
                                title="Error Loading Skills"
                                message={error}
                                onRetry={() => window.location.reload()}
                            />
                        </m.div>
                    )}

                    {/* Loading State */}
                    {isLoadingUserSkills ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i} className="h-full">
                                    <CardHeader>
                                        <LoadingSkeleton className="h-6 w-32" />
                                        <LoadingSkeleton className="h-4 w-24 mt-2" />
                                    </CardHeader>
                                    <CardContent>
                                        <LoadingSkeleton className="h-12 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : userSkills && userSkills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userSkills.map((skill: UserSkill, index: number) => (
                                <m.div
                                    key={skill.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="group h-full flex flex-col overflow-hidden border-border/30 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/10">
                                        {/* Accent Line */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        {/* Image/Icon Hero Section */}
                                        <div className="w-full aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 flex items-center justify-center overflow-hidden relative">
                                            {skill.skill?.icon ? (
                                                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                                    {skill.skill.icon}
                                                </span>
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-primary/20 to-secondary/20">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40 group-hover:text-primary/60 transition-colors duration-300">
                                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <CardHeader className="p-4 md:p-5 pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                                                        {skill.skill?.name || (skill as any).name}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-muted-foreground">{skill.skill?.category || (skill as any).category}</span>
                                                        <span className="text-border/50 text-xs">•</span>
                                                        <span className="text-xs font-medium text-secondary">{skill.hourly_rate || 1} Credits/hr</span>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="flex-shrink-0 bg-secondary/10 text-secondary border-secondary/20 capitalize">
                                                    {skill.level}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 px-4 md:px-5 py-0 space-y-4">
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{skill.years_of_experience || 0} years experience</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-background/50">
                                                        Active
                                                    </Badge>
                                                </div>
                                            </div>

                                            {skill.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {skill.description}
                                                </p>
                                            )}
                                            
                                            {/* Stats */}
                                            <div className="flex items-center gap-3 text-xs md:text-sm pt-4 border-t border-border/10">
                                                <div className="flex items-center gap-1.5">
                                                    <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                                                    <span className="font-semibold text-foreground">
                                                        {skill.average_rating ? skill.average_rating.toFixed(1) : "5.0"}
                                                    </span>
                                                    <span className="text-muted-foreground">({skill.total_reviews || 0} reviews)</span>
                                                </div>
                                                <span className="text-border/50">•</span>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Users className="h-3.5 w-3.5" />
                                                    <span>{skill.total_sessions || 0} sessions</span>
                                                </div>
                                            </div>
                                        </CardContent>

                                        {/* Actions */}
                                        <div className="p-4 md:p-5 mt-auto flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 gap-2 bg-background/50"
                                                asChild
                                            >
                                                <Link href={`/profile/skills/${skill.skill_id}/edit`}>
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive bg-background/50 border-destructive/20"
                                                onClick={() => handleDelete(skill.skill_id)}
                                                disabled={deletingId === skill.skill_id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                </m.div>
                            ))}
                        </div>
                    ) : (
                        <m.div {...fadeInUp}>
                            <EmptyState
                                icon={BookOpen}
                                title="No Skills Yet"
                                description="Start teaching! Add a skill you'd like to share with the community."
                                action={{
                                    label: 'Add Your First Skill',
                                    onClick: () => router.push('/profile/skills/new'),
                                }}
                                variant="card"
                            />
                        </m.div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
