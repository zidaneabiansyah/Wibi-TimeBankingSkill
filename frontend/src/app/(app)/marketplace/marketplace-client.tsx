'use client';

import React, { useState, useEffect } from 'react';
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

function ListingGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="h-[520px] bg-zinc-900/20 border border-zinc-800/40 rounded-[2.5rem] animate-pulse" />
            ))}
        </div>
    );
}

function MarketplaceSkeleton() {
    return (
        <div className="animate-pulse">
            {/* 1. Bento Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-16 h-auto lg:min-h-[480px]">
                {/* Block A Skeleton */}
                <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-center">
                    <div className="w-12 h-1 bg-zinc-800/50 mb-8 rounded-full" />
                    <div className="w-2/3 h-14 bg-zinc-800/50 mb-4 rounded-2xl" />
                    <div className="w-1/2 h-14 bg-zinc-800/50 mb-12 rounded-2xl" />
                    <div className="w-full max-w-xl h-15 bg-black/40 border border-zinc-800/50 rounded-2xl" />
                </div>

                {/* Block B Skeleton */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    <div className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-10 flex flex-col justify-center">
                        <div className="w-24 h-3 bg-zinc-800/50 mb-4 rounded-full" />
                        <div className="w-32 h-10 bg-zinc-800/50 mb-10 rounded-xl" />
                        <div className="space-y-6 pt-6 border-t border-zinc-800/50">
                            <div className="flex justify-between">
                                <div className="w-20 h-8 bg-zinc-800/30 rounded-lg" />
                                <div className="w-20 h-8 bg-zinc-800/30 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <div className="h-44 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem]" />
                </div>
            </div>

            {/* 2. Navigation Bar Skeleton (CRITICAL: prevents jumping) */}
            <div className="relative mb-12 h-[68px] bg-black/40 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-2.5 flex items-center">
                <div className="flex gap-2 pl-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-24 h-9 bg-zinc-800/50 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* 3. Grid Skeleton */}
            <ListingGridSkeleton />
        </div>
    );
}

export function MarketplaceClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [isFirstMount, setIsFirstMount] = useState(true);
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

    // Fetch skills when debounced search, category, or offset changes
    useEffect(() => {
        fetchSkills({
            search: debouncedSearch || undefined,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            offset,
            limit
        }).finally(() => {
            setIsFirstMount(false);
        });
    }, [debouncedSearch, selectedCategory, fetchSkills, offset]);

    // Reset offset when filters change
    useEffect(() => {
        setOffset(0);
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
                <div className="relative h-[420px] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/60 flex flex-col transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] hover:-translate-y-1">

                    {/* Top: Image Section */}
                    <div className="relative h-[220px] overflow-hidden flex-shrink-0">
                        <img
                            src={bgImage}
                            alt={skill.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Subtle gradient fade into content area */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-zinc-900" />

                        {/* Category badge — top left */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-orange-600 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                {skill.category}
                            </span>
                        </div>

                        {/* Like button — top right */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 backdrop-blur-xl border border-white/10 text-white transition-all group/fav"
                        >
                            <Heart className="w-4 h-4 group-hover/fav:fill-white transition-colors" />
                        </button>

                    </div>

                    {/* Bottom: Content Section */}
                    <div className="flex flex-col flex-1 px-5 pt-8 pb-5">
                        {/* Title */}
                        <h3 className="text-lg font-black text-white leading-tight tracking-tight mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">
                            {skill.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-zinc-500 line-clamp-2 mb-auto leading-relaxed">
                            {skill.description || `The fastest way to master ${skill.name} through community exchange.`}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800/60">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                                <Users className="w-3.5 h-3.5 text-orange-500/80" />
                                <span>{skill.total_teachers} teachers</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400">
                                <Star className="w-3.5 h-3.5 text-orange-500/80" />
                                <span>0 learners</span>
                            </div>
                            <div className="ml-auto flex items-center gap-1 px-2.5 py-1 bg-zinc-800 rounded-lg border border-zinc-700/50">
                                <Zap className="w-3 h-3 text-orange-500" />
                                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-wider">Popular</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <Button
                            variant="outline"
                            className="mt-3 w-full h-10 bg-transparent border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:bg-orange-600 hover:text-black hover:border-orange-600 group-hover:border-zinc-700"
                        >
                            Explore Teachers
                        </Button>
                    </div>
                </div>
            </Link>
        );
    };


    return (
        <div ref={topRef} className="text-zinc-100 selection:bg-orange-500/30">
            <div className="container mx-auto px-4 pt-6 pb-16 max-w-7xl">

                {error && (
                    <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-center">
                        <Activity className="w-10 h-10 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2 uppercase">Sync Error</h3>
                        <p className="text-zinc-400 mb-6">{error}</p>
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
                                className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-center relative overflow-hidden text-left"
                            >
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />

                                <div className="z-10 relative">
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="h-[1px] w-12 bg-zinc-800" />
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-white leading-[0.95]">
                                        EXCHANGE TIME.<br />
                                        <span className="text-orange-500">MASTER SKILLS.</span>
                                    </h1>

                                    <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed">
                                        Join the decentralized marketplace where <span className="text-white">knowledge thrives.</span> Teach what you love to earn credits, then spend them to learn from others.
                                    </p>

                                    <div className="w-full max-w-2xl">
                                        <div className="relative group/search">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within/search:text-orange-500 transition-colors duration-300" />
                                            <Input
                                                placeholder="Search skills, topics, or experts..."
                                                className="h-16 bg-black/70 border-zinc-800 hover:border-zinc-700 focus-visible:ring-2 focus-visible:ring-orange-600/30 focus-visible:border-orange-600/50 text-base pl-14 pr-14 rounded-2xl transition-all duration-300 font-medium text-white placeholder:text-zinc-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-800 hover:bg-orange-600 flex items-center justify-center text-zinc-400 hover:text-black transition-all duration-200"
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
                                <div className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-zinc-700 transition-colors cursor-default">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex flex-col">
                                            <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1 font-bold">Global Ledger</span>
                                            <span className="text-3xl font-black text-white"><AnimatedCounter value={skillsTotal} /> Skills</span>
                                        </div>
                                        <Activity className="w-5 h-5 text-orange-500 animate-pulse" />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                                            <div className="flex flex-col">
                                                <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-tighter font-bold">Total Members</span>
                                                <span className="text-xl font-bold text-white"><AnimatedCounter value={8294} /></span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-tighter font-bold">Avg Rating</span>
                                                <span className="text-xl font-bold text-orange-500"><AnimatedCounter value={4.9} decimals={1} />/5</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="w-full justify-between text-zinc-500 hover:text-white px-0 font-mono text-[10px] uppercase tracking-widest group font-bold">
                                            View Full Analytics <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="h-44 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:bg-zinc-900 transition-colors">
                                    <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <TrendingUp className="w-24 h-24 text-white" />
                                    </div>
                                    <h3 className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest mb-4 font-bold">Trending Now</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Python', 'Design', 'Yoga'].map(tag => (
                                            <span key={tag} className="px-4 py-1.5 rounded-xl bg-orange-600/5 border border-orange-600/10 text-orange-500 text-xs font-bold hover:bg-orange-600 hover:text-black transition-colors" onClick={() => setSearchQuery(tag)}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </m.div>
                        </div>

                        {/* --- Navigation Bar --- */}
                        <m.div variants={itemVariants} className="relative mb-12">
                            <div className="bg-black/95 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1 pl-1">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all ${selectedCategory === 'all' ? 'bg-orange-600 text-black shadow-lg shadow-orange-600/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50 font-bold'}`}
                                    >
                                        All Systems
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => setSelectedCategory(cat.value)}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedCategory === cat.value ? 'bg-zinc-800 text-orange-500 border border-zinc-700' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="pl-4 border-l border-zinc-800 ml-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="text-zinc-400 hover:text-orange-500 hover:bg-zinc-800/50 flex gap-3 px-5 py-5 rounded-xl transition-all"
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
                                        className="mt-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-10 overflow-hidden"
                                    >
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-black">Expertise Level</label>
                                            <Select defaultValue="all">
                                                <SelectTrigger className="bg-black border-zinc-800 rounded-2xl h-12 text-xs font-bold font-mono text-zinc-300"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectItem value="all">ALL LEVELS</SelectItem>
                                                    <SelectItem value="beginner">BEGINNER</SelectItem>
                                                    <SelectItem value="expert">EXPERT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-black">Sort Protocol</label>
                                            <Select defaultValue="popular">
                                                <SelectTrigger className="bg-black border-zinc-800 rounded-2xl h-12 text-xs font-bold font-mono text-zinc-300"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
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
                                        className="absolute -top-10 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent z-40 origin-center"
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
                                        className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/10"
                                    >
                                        <Activity className="w-12 h-12 text-zinc-700 mb-6" />
                                        <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">No Nodes Detected</h3>
                                        <p className="text-zinc-500 text-sm font-mono tracking-wide max-w-sm text-center mb-10 font-bold">Searching the grid... No matches for your current parameters.</p>
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
                    <div className="inline-flex items-center gap-2 p-2.5 bg-zinc-900/60 backdrop-blur rounded-2xl border border-zinc-800 shadow-2xl">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-xl text-zinc-500 hover:text-orange-500 hover:bg-zinc-800 disabled:opacity-30 transition-all shadow-none"
                            disabled={currentPage <= 1 || storeLoading}
                            onClick={() => handlePageChange((currentPage - 2) * limit)}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <div className="px-8 font-black tabular-nums text-white text-lg tracking-tighter">
                            {currentPage} <span className="text-zinc-600 text-sm font-normal mx-1">/</span> {totalPages || 1}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-xl text-zinc-500 hover:text-orange-500 hover:bg-zinc-800 disabled:opacity-30 transition-all shadow-none"
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
