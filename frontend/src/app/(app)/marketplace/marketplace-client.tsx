'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { m, AnimatePresence, Variants, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    Users,
    Star,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    ArrowRight,
    Zap,
    TrendingUp,
    Heart,
    Activity,
    X,
} from 'lucide-react';
import { useSkillStore } from '@/stores/skill.store';
import { SkillCategory, Skill } from '@/types';

const categories: { label: string; value: SkillCategory }[] = [
    { label: 'Academic', value: 'academic' },
    { label: 'Technical', value: 'technical' },
    { label: 'Creative', value: 'creative' },
    { label: 'Language', value: 'language' },
    { label: 'Sports', value: 'sports' },
    { label: 'Other', value: 'other' },
];

const getSkillImage = (skill: Skill) => {
    const images: Record<string, string> = {
        academic: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop",
        technical: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop",
        creative: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2670&auto=format&fit=crop",
        language: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2573&auto=format&fit=crop",
        sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2670&auto=format&fit=crop",
        other: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
    };
    return images[skill.category] || images.other;
};

const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

function AnimatedCounter({ value, duration = 2, decimals = 0 }: { value: number; duration?: number; decimals?: number }) {
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) =>
        decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString()
    );

    React.useEffect(() => {
        if (inView) {
            animate(count, value, {
                duration: duration,
                ease: "easeOut"
            });
        }
    }, [inView, value, count, duration]);

    return <m.span ref={ref}>{rounded}</m.span>;
}


function MarketplaceSkeleton() {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Bento Grid Skeleton matching the real UI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-auto lg:min-h-[480px]">
                {/* Block A Skeleton (Main Big One) */}
                <div className="lg:col-span-8 bg-card border border-border/80 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-center">
                    <div className="h-12 w-2/3 bg-muted rounded-2xl mb-8" />
                    <div className="h-6 w-1/2 bg-muted rounded-xl mb-12" />
                    <div className="h-16 w-full max-w-xl bg-background border border-border/50 rounded-2xl" />
                </div>

                {/* Block B Skeletons (Two Right Ones) */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    <div className="flex-1 bg-card border border-border/80 rounded-[2.5rem] p-10">
                        <div className="h-4 w-24 bg-muted rounded-full mb-4" />
                        <div className="h-8 w-32 bg-muted rounded-xl mb-10" />
                        <div className="h-px bg-border/50 w-full mb-6" />
                        <div className="flex justify-between">
                            <div className="h-8 w-20 bg-muted/60 rounded-lg" />
                            <div className="h-8 w-20 bg-muted/60 rounded-lg" />
                        </div>
                    </div>
                    <div className="h-44 bg-card border border-border/80 rounded-[2.5rem]" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="h-[420px] bg-muted/20 border border-border/40 rounded-[2.5rem]" />
                ))}
            </div>
        </div>
    );
}

export function MarketplaceClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [offset, setOffset] = useState(0);
    const gridRef = React.useRef<HTMLDivElement>(null);
    const topRef = React.useRef<HTMLDivElement>(null);
    const limit = 9;

    const {
        skills,
        isLoading: storeLoading,
        error,
        skillsTotal,
        fetchSkills
    } = useSkillStore();

    // Localized loading check — skeleton ONLY on very first page load
    // Initialize based on whether we already have data to show (prevents flash on remount)
    const [isFirstMount, setIsFirstMount] = useState(() => skills.length === 0);
    const isInitialLoading = storeLoading && isFirstMount;
    const showSkeleton = isInitialLoading;
    const isBackgroundSyncing = storeLoading && !isFirstMount;

    // Debounce search query — waits 400ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Single effect: reset offset AND fetch in one go to avoid double-fetch.
    // When debouncedSearch or selectedCategory changes, reset to page 0 first,
    // then always fetch with the current (or newly reset) offset.
    const isFilterChange = React.useRef(false);
    useEffect(() => {
        let fetchOffset = offset;
        if (isFilterChange.current) {
            fetchOffset = 0;
            setOffset(0);
            isFilterChange.current = false;
        }
        fetchSkills({
            search: debouncedSearch || undefined,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            offset: fetchOffset,
            limit
        }).finally(() => {
            setIsFirstMount(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, selectedCategory, offset]);

    // Mark that filters changed so the next effect run resets the offset
    const prevFilters = React.useRef({ debouncedSearch, selectedCategory });
    useEffect(() => {
        if (
            prevFilters.current.debouncedSearch !== debouncedSearch ||
            prevFilters.current.selectedCategory !== selectedCategory
        ) {
            isFilterChange.current = true;
            prevFilters.current = { debouncedSearch, selectedCategory };
        }
    }, [debouncedSearch, selectedCategory]);

    const handlePageChange = (newOffset: number) => {
        setOffset(newOffset);
        // Defer scroll to ensure it fires after React state update
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Fallback: also try document.documentElement
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 50);
    };

    const totalPages = Math.ceil(skillsTotal / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    // --- "Lifestyle / Realistic" Card Component ---
    const SkillCard = ({ skill }: { skill: Skill }) => {
        const bgImage = getSkillImage(skill);

        return (
            <Link href={`/marketplace/${skill.id}`} className="block group">
                <div className="relative h-[420px] rounded-3xl overflow-hidden bg-card border border-border/60 flex flex-col transition-all duration-500 hover:border-orange-500/30 hover:shadow-2xl hover:-translate-y-1">

                    <div className="relative h-[220px] overflow-hidden shrink-0 bg-muted">
                        <Image
                            src={bgImage}
                            alt={skill.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Subtle linear fade into content area */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/50" />

                        {/* Category badge — top left */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                {skill.category}
                            </span>
                        </div>

                        {/* Like button — top right */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-card/50 hover:bg-card/80 backdrop-blur-xl border border-border shadow-sm text-foreground transition-all group/fav"
                        >
                            <Heart className="w-4 h-4 group-hover/fav:fill-primary transition-colors" />
                        </button>

                    </div>

                    {/* Bottom: Content Section */}
                    <div className="flex flex-col flex-1 px-5 pt-8 pb-5">
                        {/* Title */}
                        <h3 className="text-lg font-black text-foreground leading-tight tracking-tight mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">
                            {skill.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-auto leading-relaxed font-medium">
                            {skill.description || `The fastest way to master ${skill.name} through community exchange.`}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/60">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                <Users className="w-3.5 h-3.5 text-orange-500/80" />
                                <span>{skill.total_teachers} teachers</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                <Star className="w-3.5 h-3.5 text-orange-500/80" />
                                <span>0 learners</span>
                            </div>
                            <div className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-muted rounded-lg border border-border/20">
                                <Zap className="w-3 h-3 text-orange-500" />
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Popular</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <Button
                            variant="outline"
                            className="mt-3 w-full h-10 bg-transparent border-border text-muted-foreground font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:bg-orange-600 hover:text-white hover:border-orange-600 group-hover:border-border"
                        >
                            Explore Teachers
                        </Button>
                    </div>
                </div>
            </Link>
        );
    };


    return (
        <div ref={topRef} className="text-foreground selection:bg-orange-500/30">
            <div className="container mx-auto px-4 pt-6 pb-16 max-w-7xl">

                {error && (
                    <div className="mb-8 p-6 bg-destructive/10 border border-destructive/20 rounded-4xl text-center">
                        <Activity className="w-10 h-10 text-destructive mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground mb-2 uppercase">Sync Error</h3>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button
                            onClick={() => fetchSkills()}
                            className="bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl px-10"
                        >
                            Retry Connection
                        </Button>
                    </div>
                )}

                {showSkeleton ? (
                    <div className="min-h-[800px]">
                        <MarketplaceSkeleton />
                    </div>
                ) : (
                    <>
                        {/* --- Bento Dashboard Hero --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-16 h-auto lg:min-h-[480px]">
                            {/* Block A: Core Platform Info */}
                            <m.div
                                variants={itemVariants}
                                className="lg:col-span-8 bg-card border border-border/80 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-center relative overflow-hidden text-left"
                            >
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-linear(circle_at_center,var(--tw-linear-stops))] from-orange-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />

                                <div className="z-10 relative">
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="h-px w-12 bg-border" />
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-foreground leading-[0.95]">
                                        EXCHANGE TIME.<br />
                                        <span className="text-orange-500">MASTER SKILLS.</span>
                                    </h1>

                                    <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed">
                                        Join the decentralized marketplace where <span className="text-foreground">knowledge thrives.</span> Teach what you love to earn credits, then spend them to learn from others.
                                    </p>

                                    <div className="w-full max-w-2xl">
                                        <div className="relative group/search">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/search:text-orange-500 transition-colors duration-300" />
                                            <Input
                                                placeholder="Search skills, topics, or experts..."
                                                className="h-16 bg-background/70 border-border hover:border-muted-foreground/30 focus-visible:ring-2 focus-visible:ring-orange-600/30 focus-visible:border-orange-600/50 text-base pl-14 pr-14 rounded-2xl transition-all duration-300 font-medium text-foreground placeholder:text-muted-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted hover:bg-orange-600 flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-200"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </m.div>

                            {/* Block B: Real-time Stats */}
                            <m.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-5">
                                <div className="flex-1 bg-card border border-border/80 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-muted-foreground/30 transition-colors cursor-default">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-[10px] uppercase font-mono tracking-widest mb-1 font-bold">Global Ledger</span>
                                            <span className="text-3xl font-black text-foreground"><AnimatedCounter value={skillsTotal} /> Skills</span>
                                        </div>
                                        <Activity className="w-5 h-5 text-orange-500 animate-pulse" />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-border pb-4">
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-tighter font-bold">Total Members</span>
                                                <span className="text-xl font-bold text-foreground"><AnimatedCounter value={8294} /></span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-tighter font-bold">Avg Rating</span>
                                                <span className="text-xl font-bold text-orange-500"><AnimatedCounter value={4.9} decimals={1} />/5</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground px-0 font-mono text-[10px] uppercase tracking-widest group font-bold">
                                            View Full Analytics <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="h-44 bg-card border border-border/80 rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:bg-background transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <TrendingUp className="w-24 h-24 text-foreground" />
                                    </div>
                                    <h3 className="font-mono text-muted-foreground text-[10px] uppercase tracking-widest mb-4 font-bold">Trending Now</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Python', 'Design', 'Yoga'].map(tag => (
                                            <span key={tag} className="px-4 py-1.5 rounded-xl bg-orange-600/5 border border-orange-600/10 text-orange-500 text-xs font-bold hover:bg-orange-600 hover:text-white transition-colors" onClick={() => setSearchQuery(tag)}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </m.div>
                        </div>

                        {/* --- Navigation Bar --- */}
                        <m.div variants={itemVariants} className="relative mb-12">
                            <div className="bg-background/95 backdrop-blur-2xl border border-border/80 rounded-2xl p-2.5 flex items-center justify-between shadow-xl">
                                <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1 pl-1">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted font-bold'}`}
                                    >
                                        All Systems
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => setSelectedCategory(cat.value)}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedCategory === cat.value ? 'bg-muted text-orange-500 border border-border' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="pl-4 border-l border-border ml-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="text-muted-foreground hover:text-orange-500 hover:bg-muted flex gap-3 px-5 py-5 rounded-xl transition-all"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Filters</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Filter Portal */}
                            <AnimatePresence>
                                {showFilters && (
                                    <m.div
                                        initial={{ opacity: 0, height: 0, y: -20 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -20 }}
                                        className="mt-4 bg-card border border-border rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-10 overflow-hidden"
                                    >
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-black">Expertise Level</label>
                                            <Select defaultValue="all">
                                                <SelectTrigger className="bg-background border-border rounded-2xl h-12 text-xs font-bold font-mono text-muted-foreground"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    <SelectItem value="all">ALL LEVELS</SelectItem>
                                                    <SelectItem value="beginner">BEGINNER</SelectItem>
                                                    <SelectItem value="expert">EXPERT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] font-black">Sort Protocol</label>
                                            <Select defaultValue="popular">
                                                <SelectTrigger className="bg-background border-border rounded-2xl h-12 text-xs font-bold font-mono text-muted-foreground"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    <SelectItem value="popular">MOST POPULAR</SelectItem>
                                                    <SelectItem value="newest">LATEST ARRIVALS</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </m.div>

                        {/* --- Listing Grid Area --- */}
                        <div ref={gridRef} className="relative min-h-[600px] mt-20">
                            {/* Sleek Background Syncing Indicator */}
                            <AnimatePresence>
                                {isBackgroundSyncing && (
                                    <m.div
                                        initial={{ opacity: 0, scaleX: 0 }}
                                        animate={{ opacity: 1, scaleX: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute -top-10 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-orange-500 to-transparent z-40 origin-center"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Grid — always mounted, no dimming */}
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-32"
                            >
                                {skills.map((skill) => (
                                    <SkillCard key={skill.id} skill={skill} />
                                ))}
                            </div>

                            {/* Empty state — only shows when not loading and no results */}
                            <AnimatePresence>
                                {!storeLoading && skills.length === 0 && (
                                    <m.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[3rem] bg-muted/10"
                                    >
                                        <Activity className="w-12 h-12 text-muted-foreground mb-6" />
                                        <h3 className="text-3xl font-black text-foreground mb-2 uppercase tracking-tighter italic">No Nodes Detected</h3>
                                        <p className="text-muted-foreground text-sm font-mono tracking-wide max-w-sm text-center mb-10 font-bold">Searching the grid... No matches for your current parameters.</p>
                                        <Button
                                            variant="outline"
                                            className="h-14 px-12 border-orange-600/50 text-orange-500 hover:bg-orange-600 hover:text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all"
                                            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                        >
                                            Reset Grid
                                        </Button>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}

                {/* --- Pagination --- */}
                <m.div variants={itemVariants} className="flex justify-center mt-6">
                    <div className="inline-flex items-center gap-2 p-2.5 bg-card/60 backdrop-blur rounded-2xl border border-border shadow-2xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-xl text-muted-foreground hover:text-orange-500 hover:bg-muted disabled:opacity-30 transition-all shadow-none"
                            disabled={currentPage <= 1 || storeLoading}
                            onClick={() => handlePageChange((currentPage - 2) * limit)}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <div className="px-8 font-black tabular-nums text-foreground text-lg tracking-tighter">
                            {currentPage} <span className="text-muted-foreground text-sm font-normal mx-1">/</span> {totalPages || 1}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-xl text-muted-foreground hover:text-orange-500 hover:bg-muted disabled:opacity-30 transition-all shadow-none"
                            disabled={currentPage >= totalPages || storeLoading}
                            onClick={() => handlePageChange(currentPage * limit)}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                </m.div>
            </div>
        </div>
    );
}
