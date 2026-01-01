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
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, Users, Clock, TrendingUp, BookOpen } from 'lucide-react';
import type { Skill } from '@/types';

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
                    <motion.div className="flex items-center justify-between mb-8" {...fadeInUp}>
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
                    </motion.div>

                    {/* Error State */}
                    {error && (
                        <motion.div className="mb-6" {...fadeInUp}>
                            <ErrorState
                                title="Error Loading Skills"
                                message={error}
                                onRetry={() => window.location.reload()}
                            />
                        </motion.div>
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
                            {userSkills.map((skill: any, index: number) => (
                                <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="h-full flex flex-col border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                                                    <CardDescription>{skill.category}</CardDescription>
                                                </div>
                                                <Badge variant="outline" className="flex-shrink-0">
                                                    Active
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 space-y-4">
                                            {skill.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-3">
                                                    {skill.description}
                                                </p>
                                            )}

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-secondary fill-secondary" />
                                                    <span className="text-xs text-muted-foreground">
                                                        4.8 rating
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-secondary" />
                                                    <span className="text-xs text-muted-foreground">
                                                        12 students
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>

                                        {/* Actions */}
                                        <div className="px-6 py-4 border-t border-border/40 flex gap-2">
                                            <Link href={`/profile/skills/${skill.id}/edit`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full gap-2">
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(skill.id)}
                                                disabled={deletingId === skill.id}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div {...fadeInUp}>
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
                        </motion.div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
