'use client';

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence, Variants } from 'framer-motion';
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

export function MarketplaceClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    const {
        skills,
        isLoading,
        error,
        skillsTotal,
        fetchSkills
    } = useSkillStore();

    // Load initial skills
    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSkills({
                search: searchQuery || undefined,
                category: selectedCategory === 'all' ? undefined : selectedCategory
            });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory, fetchSkills]);

    const handlePageChange = (offset: number) => {
        fetchSkills({ offset });
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };

    const limit = 10;
    const totalPages = Math.ceil(skillsTotal / limit);
    const currentPage = Math.floor((skills.length / limit)) + 1;

    // --- "Lifestyle / Realistic" Card Component (Iteration 10) ---
    const SkillCard = ({ skill }: { skill: Skill }) => {
        const bgImage = getSkillImage(skill);

        return (
            <m.div
                layout
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="group h-full"
            >
                <Link href={`/marketplace/${skill.id}`} className="block h-full">
                    <div className="relative h-[520px] w-full bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-800 transition-all duration-500 hover:border-orange-500/40 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]">

                        {/* 1. Large Realistic Background Image */}
                        <div className="absolute inset-0 z-0">
                            <m.img
                                src={bgImage}
                                alt={skill.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                        </div>

                        {/* 2. Glassmorphic Content Overlay at Bottom */}
                        <div className="absolute bottom-0 inset-x-0 z-10 px-6 pb-6 pt-24 bg-gradient-to-t from-black via-black/95 to-transparent">

                            {/* Floating Icon Box */}
                            <div className="absolute -top-6 left-6 w-12 h-12 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform">
                                {skill.icon}
                            </div>

                            {/* Title & Info */}
                            <div className="mb-4">
                                <h3 className="text-3xl font-black text-white mb-2 leading-tight tracking-tight group-hover:text-orange-500 transition-colors drop-shadow-xl">
                                    {skill.name}
                                </h3>
                                <p className="text-xs font-medium text-zinc-400 line-clamp-2 drop-shadow-md mb-4">
                                    {skill.description || `The fastest way to master ${skill.name} through community exchange.`}
                                </p>

                                {/* Social Stats Block (Requested) */}
                                <div className="flex gap-5 mb-4 opacity-100">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
                                        <Users className="w-3.5 h-3.5 text-orange-500" />
                                        <span>{skill.total_teachers} teachers</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/90">
                                        <Star className="w-3.5 h-3.5 text-orange-500" />
                                        <span>0 learners</span>
                                    </div>
                                </div>
                            </div>

                            {/* Teacher/Expert Row */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                                        <Zap className="w-3 h-3 text-orange-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Community Fav</span>
                                    </div>
                                </div>
                                <Badge className="bg-orange-600 hover:bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full px-4 h-6 border-0 shadow-lg">
                                    {skill.category}
                                </Badge>
                            </div>

                            {/* 3. "Explore Teachers" Button (Requested Style) */}
                            <div className="w-full">
                                <Button variant="outline" className="w-full h-13 bg-transparent border-zinc-700/80 text-white font-black text-xs uppercase tracking-[0.1em] rounded-2xl transition-all hover:bg-white hover:text-black hover:border-white shadow-xl">
                                    Explore Teachers
                                </Button>
                            </div>
                        </div>

                        {/* Like Action */}
                        <button className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/80 backdrop-blur-xl border border-white/10 text-white transition-all group/fav">
                            <Heart className="w-5 h-5 group-hover/fav:fill-white transition-colors" />
                        </button>
                    </div>
                </Link>
            </m.div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100 selection:bg-orange-500/30">
            {/* --- Bento Dashboard Hero --- */}
            <m.div
                className="container mx-auto px-4 pt-32 pb-16 max-w-7xl"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-16 h-auto lg:min-h-[480px]">
                    {/* Block A: Core Platform Info */}
                    <m.div
                        variants={itemVariants}
                        className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-center relative overflow-hidden text-left"
                    >
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />

                        <div className="z-10 relative">
                            <div className="flex items-center gap-2 mb-8">
                                <div className="px-3 py-1 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    Time Banking V2.0
                                </div>
                                <div className="h-[1px] w-12 bg-zinc-800" />
                                <span className="text-zinc-400 text-[10px] uppercase font-mono tracking-widest text-zinc-300">Network Enabled</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white leading-[0.95]">
                                EXCHANGE TIME.<br />
                                <span className="text-orange-500">MASTER SKILLS.</span>
                            </h1>

                            <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed">
                                Join the decentralized marketplace where <span className="text-white">knowledge thrives.</span> Teach what you love to earn credits, then spend them to learn from others.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
                                <div className="relative flex-1 group/search">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/search:text-orange-500 transition-colors" />
                                    <Input
                                        placeholder="Find an expert or a skill..."
                                        className="h-15 bg-black/60 border-zinc-700 hover:border-zinc-600 focus-visible:ring-1 focus-visible:ring-orange-600/50 text-lg pl-12 rounded-2xl transition-all font-medium text-white placeholder:text-zinc-500 shadow-inner"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button size="lg" className="h-15 px-10 bg-orange-600 hover:bg-orange-500 text-black font-black text-base uppercase rounded-2xl shadow-xl shadow-orange-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Explore
                                </Button>
                            </div>
                        </div>
                    </m.div>

                    {/* Block B: Real-time Stats */}
                    <m.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-5">
                        <div className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-zinc-700 transition-colors cursor-default">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex flex-col">
                                    <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-1 font-bold">Global Ledger</span>
                                    <span className="text-3xl font-black text-white">{skillsTotal} Skills</span>
                                </div>
                                <Activity className="w-5 h-5 text-orange-500 animate-pulse" />
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-tighter font-bold">Total Members</span>
                                        <span className="text-xl font-bold text-white">8,294</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-tighter font-bold">Avg Rating</span>
                                        <span className="text-xl font-bold text-orange-500">4.9/5</span>
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

                {/* --- Listing Grid --- */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="h-[520px] bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : skills.length > 0 ? (
                    <m.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
                        <AnimatePresence mode="popLayout">
                            {skills.map((skill) => (
                                <SkillCard key={skill.id} skill={skill} />
                            ))}
                        </AnimatePresence>
                    </m.div>
                ) : (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/10"
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

                {/* --- Pagination --- */}
                {totalPages > 1 && (
                    <m.div variants={itemVariants} className="flex justify-center mt-6">
                        <div className="inline-flex items-center gap-2 p-2.5 bg-zinc-900/60 backdrop-blur rounded-2xl border border-zinc-800 shadow-2xl">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-xl text-zinc-500 hover:text-orange-500 hover:bg-zinc-800 transition-all shadow-none"
                                disabled={currentPage <= 1}
                                onClick={() => handlePageChange((currentPage - 2) * limit)}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>

                            <div className="px-8 font-black tabular-nums text-white text-lg tracking-tighter">
                                {currentPage} <span className="text-zinc-600 text-sm font-normal mx-1">/</span> {totalPages}
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-xl text-zinc-500 hover:text-orange-500 hover:bg-zinc-800 transition-all shadow-none"
                                disabled={currentPage >= totalPages}
                                onClick={() => handlePageChange(currentPage * limit)}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </div>
                    </m.div>
                )}
            </m.div>
        </div>
    );
}
