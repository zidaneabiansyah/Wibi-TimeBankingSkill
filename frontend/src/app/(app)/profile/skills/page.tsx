'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardContent, Card, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSkillStore } from '@/stores/skill.store';
import { useAuthStore } from '@/stores/auth.store';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { m, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Star, Users, BookOpen, Clock, Zap } from 'lucide-react';
import { SessionFilters } from '@/app/(app)/dashboard/sessions/components/session-filters';
import type { UserSkill } from '@/types';

export default function MySkillsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { userSkills, isLoadingUserSkills, fetchUserSkills } = useSkillStore();
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

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

    // Extract unique categories for tabs
    const categories = useMemo(() => {
        const cats = new Set(['all']);
        userSkills.forEach(s => {
            const cat = s.skill?.category || (s as any).category;
            if (cat) cats.add(cat.toLowerCase());
        });
        return Array.from(cats);
    }, [userSkills]);

    const filteredSkills = useMemo(() => {
        return userSkills.filter(skill => {
            const nameMatch = (skill.skill?.name || (skill as any).name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const catMatch = (skill.skill?.category || (skill as any).category || '').toLowerCase().includes(searchQuery.toLowerCase());
            const searchMatch = nameMatch || catMatch;

            const categoryMatch = activeCategory === 'all' ||
                (skill.skill?.category || (skill as any).category || '').toLowerCase() === activeCategory;

            return searchMatch && categoryMatch;
        });
    }, [userSkills, searchQuery, activeCategory]);

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

    return (
        <div className="bg-background min-h-screen" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <main className="container mx-auto px-6 py-12 max-w-7xl">
                {/* Header Section */}
                <m.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1 w-8 bg-primary rounded-full" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Teaching Profile</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            My Skills
                        </h1>
                        <p className="text-muted-foreground mt-3 text-lg max-w-2xl leading-relaxed">
                            Curate and manage the expertise you're sharing with the Wibi community.
                        </p>
                    </div>
                    <Link href="/profile/skills/new">
                        <Button className="rounded-2xl px-6 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-semibold gap-2">
                            <Plus className="h-4 w-4 stroke-3" />
                            Add New Skill
                        </Button>
                    </Link>
                </m.div>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center gap-10 mb-16"
                >
                    <SessionFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        placeholder="Search your skills catalog..."
                    />

                    {categories.length > 1 && (
                        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full max-w-5xl">
                            <TabsList className="flex h-16 w-full p-2 bg-card/20 backdrop-blur-3xl border border-border/20 rounded-full shadow-2xl shadow-black/10 overflow-x-auto no-scrollbar">
                                {categories.map((cat) => (
                                    <TabsTrigger
                                        key={cat}
                                        value={cat}
                                        className="flex-1 min-w-[120px] rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-500 data-[state=active]:bg-linear-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] data-[state=inactive]:hover:bg-muted/30"
                                    >
                                        {cat}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}
                </m.div>

                {/* Error State */}
                {error && (
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <ErrorState
                            title="Sync Error"
                            message={error}
                            onRetry={() => window.location.reload()}
                        />
                    </m.div>
                )}

                {/* Main Content */}
                {isLoadingUserSkills ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-[2.5rem] border border-border/50 bg-card/30 h-[400px] animate-pulse" />
                        ))}
                    </div>
                ) : filteredSkills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredSkills.map((skill: UserSkill, index: number) => (
                                <m.div
                                    key={skill.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: index * 0.03, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <Card className="group relative flex flex-col h-full rounded-[1.75rem] border border-border/40 bg-card/40 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-card/60 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.2)] overflow-hidden">
                                        <CardHeader className="p-5 pb-3">
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                            Active Skill
                                                        </span>
                                                    </div>
                                                    <CardTitle className="text-lg font-semibold tracking-tight text-foreground/90 group-hover:text-primary transition-colors truncate">
                                                        {skill.skill?.name || (skill as any).name}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs font-semibold text-muted-foreground/80 mt-1 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                        {skill.skill?.category || (skill as any).category}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="px-5 py-1 space-y-3">
                                            <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/20 border border-border/10 transition-colors group-hover:bg-muted/40">
                                                <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-border/30 text-[10px] text-foreground font-bold">
                                                    {user?.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Expert Mentor</span>
                                                    <span className="text-xs font-bold text-foreground/90 truncate">{user?.full_name || 'Anonymous User'}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 py-3 border-y border-border/20">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        < Zap className="h-3 w-3" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">Hourly Rate</span>
                                                    </div>
                                                    <div className="flex items-baseline gap-1 mt-0.5">
                                                        <span className="text-lg font-bold text-secondary">{skill.hourly_rate || 1}</span>
                                                        <span className="text-[10px] font-bold opacity-70 tracking-tighter">CRS</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-0.5 items-end text-right">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">Experience</span>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-foreground/80 mt-0.5">{skill.years_of_experience || 0} Years</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 py-1">
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/30 border border-border/10">
                                                    <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                                                    <span className="text-xs font-bold text-foreground">
                                                        {skill.average_rating ? skill.average_rating.toFixed(1) : "5.0"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/30 border border-border/10">
                                                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="text-xs font-bold text-foreground">
                                                        {skill.total_sessions || 0} <span className="text-[8px] opacity-60 font-bold">SESS</span>
                                                    </span>
                                                </div>
                                                <Badge className="ml-auto bg-background/80 backdrop-blur-sm text-foreground border-border/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                                    {skill.level}
                                                </Badge>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="p-5 pt-3 mt-auto">
                                            <div className="flex flex-col gap-2 w-full">
                                                <Link href={`/profile/skills/${skill.skill_id}/edit`} className="w-full">
                                                    <Button
                                                        variant="secondary"
                                                        className="w-full h-11 rounded-xl bg-muted/40 hover:bg-muted text-foreground text-xs font-bold gap-2 transition-all"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit Skill Details
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full h-10 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-all text-[9px] font-bold uppercase tracking-widest"
                                                    onClick={() => handleDelete(skill.skill_id)}
                                                    disabled={deletingId === skill.skill_id}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                                    Delete Skill
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </m.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <m.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <EmptyState
                            icon={BookOpen}
                            title={searchQuery ? "No matching skills found" : "Your Teaching Catalog is Empty"}
                            description={searchQuery ? "Try adjusting your search or category filters." : "Inspire others by sharing your unique expertise. Add your first skill now."}
                            action={!searchQuery ? {
                                label: 'Start Teaching',
                                onClick: () => router.push('/profile/skills/new'),
                            } : undefined}
                            variant="card"
                        />
                    </m.div>
                )}
            </main>
        </div>
    );
}
