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
import { useSkillStore } from '@/stores/skill.store';
import type { Skill, UserSkill } from '@/types';
import { TeacherAvailability } from '@/components/features/marketplace/TeacherAvailability';
import { FavoriteButton } from '@/components/shared/favorite';

export default function SkillDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const skillId = Number(params.skillId);
    const { recommendations, fetchRecommendations } = useSkillStore();

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

                // Fetch recommendations
                fetchRecommendations(4);
            } catch (err: any) {
                setError(err.message || 'Failed to load skill');
            } finally {
                setIsLoading(false);
            }
        };

        if (skillId) {
            fetchData();
        }
    }, [skillId, fetchRecommendations]);

    const handleBookSession = (userSkillId: number) => {
        if (!isAuthenticated) {
            router.push('/login?redirect=' + encodeURIComponent(`/book/${userSkillId}`));
            return;
        }
        router.push(`/book/${userSkillId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-20">
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-600 border-t-transparent"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !skill) {
        return (
            <div className="min-h-screen pt-24 pb-20">
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-32 bg-zinc-900/50 border border-zinc-800/80 rounded-[2rem] max-w-2xl mx-auto">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                            </svg>
                        </div>
                        <p className="text-xl font-bold text-white mb-8">{error || 'Skill not found'}</p>
                        <Link href="/marketplace">
                            <Button className="bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest rounded-xl px-8 h-12">
                                Back to Marketplace
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb & Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                        <Link href="/marketplace" className="hover:text-orange-500 transition-colors flex items-center gap-2 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Marketplace
                        </Link>
                        <span className="text-zinc-800">/</span>
                        <span className="text-zinc-300">{skill.name}</span>
                    </nav>
                </div>

                {/* Hero Section — Editorial & High Impact */}
                <div className="relative mb-20">
                    <div className="relative flex flex-col md:flex-row gap-16 items-center md:items-start text-center md:text-left">
                        {/* Icon Box — Sharp & Floating */}
                        <div className="shrink-0">
                            <div className="relative w-56 h-56 bg-zinc-950 border-2 border-zinc-800 rounded-[2.8rem] flex items-center justify-center text-8xl shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden group">
                                <span className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                                    {skill.icon ? skill.icon : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-4">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
                                <Badge className="bg-zinc-900 text-zinc-500 border border-zinc-800 font-black text-[9px] uppercase tracking-[0.2em] rounded-md px-3 py-1 pointer-events-none">
                                    {skill.category}
                                </Badge>
                                <div className="h-px w-8 bg-zinc-800" />
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-[calc(-0.06em)] leading-[0.85] mb-8 uppercase">
                                {skill.name}
                            </h1>

                            <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl mb-12 font-medium tracking-tight">
                                {skill.description || 'Elevate your expertise and master this essential skill with our community experts.'}
                            </p>

                            {/* Stats — Refined Contrast */}
                            <div className="flex flex-wrap items-center gap-12">
                                {[
                                    {
                                        label: 'Teachers',
                                        value: skill.total_teachers || 0,
                                        color: 'bg-[#1a2638] text-blue-500',
                                        icon: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>
                                    },
                                    {
                                        label: 'Learners',
                                        value: skill.total_learners || 0,
                                        color: 'bg-[#152e21] text-emerald-500',
                                        icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>
                                    },
                                    {
                                        label: 'Credit/hour',
                                        value: skill.min_rate || 1,
                                        color: 'bg-[#2a1b12] text-orange-600',
                                        icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>
                                    }
                                ].map((stat, idx) => (
                                    <div key={idx} className="flex items-center gap-5">
                                        <div className={`flex h-14 w-14 items-center justify-center rounded-[1.2rem] ${stat.color} border border-white/5`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                {stat.icon}
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-3xl font-black text-white leading-none tracking-tighter mb-1">{stat.value}</div>
                                            <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.15em]">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Separator — Sharp Detail */}
                <div className="relative flex items-center gap-4 mb-20 overflow-hidden">
                    <div className="h-px flex-1 bg-zinc-900" />
                    <span className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] px-4">Direct Access</span>
                    <div className="h-px flex-1 bg-zinc-900" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT: Teachers */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Available Teachers</h2>
                                <p className="text-zinc-500 text-sm font-medium mt-1">
                                    {teachers.length > 0
                                        ? `${teachers.length} teacher${teachers.length > 1 ? 's' : ''} ready to help you learn`
                                        : 'Be the first to teach this skill!'
                                    }
                                </p>
                            </div>
                            {teachers.length > 0 && (
                                <span className="text-xs font-bold text-zinc-600 bg-zinc-800 px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0">
                                    {teachers.length} found
                                </span>
                            )}
                        </div>

                        {teachers.length === 0 ? (
                            <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl p-12 text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">No teachers available yet</h3>
                                <p className="text-zinc-500 mb-8 max-w-sm mx-auto text-sm">
                                    Be the first to share your knowledge! Add this skill to your profile and start teaching others.
                                </p>
                                <Link href="/profile/skills">
                                    <Button className="h-12 px-8 bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest rounded-xl transition-transform hover:scale-105">
                                        Add This Skill
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {teachers.map((teacher) => (
                                    <div key={teacher.id} className="group bg-zinc-900/40 border border-zinc-800/60 hover:border-orange-500/30 rounded-2xl p-5 transition-all duration-300">
                                        {/* Top row: avatar, name/email, badge */}
                                        <div className="flex items-center gap-4 mb-4">
                                            {/* Avatar */}
                                            <div className="relative shrink-0">
                                                <div className="h-11 w-11 rounded-xl bg-zinc-800 flex items-center justify-center text-white text-base font-black ring-1 ring-zinc-700 group-hover:ring-orange-500/40 transition-all">
                                                    {teacher.user?.full_name?.charAt(0).toUpperCase() || 'T'}
                                                </div>
                                                {teacher.is_available && (
                                                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-zinc-900" />
                                                )}
                                            </div>

                                            {/* Name + Email */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-white truncate leading-tight">{teacher.user?.full_name || 'Unknown'}</h4>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600 shrink-0">
                                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                                    </svg>
                                                    <span className="text-[11px] text-zinc-500 truncate">{teacher.user?.email || 'No email'}</span>
                                                </div>
                                            </div>

                                            {/* Level badge + Fav */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700/50">{teacher.level}</span>
                                                <FavoriteButton teacherId={teacher.user?.id ?? teacher.user_id} size="sm" />
                                            </div>
                                        </div>

                                        {/* Bottom row: stats + book */}
                                        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                    {teacher.average_rating?.toFixed(1) || 'New'}
                                                </div>
                                                <span className="text-[11px] text-zinc-500">{teacher.total_sessions || 0} sessions</span>
                                                <div className="flex items-center gap-1 text-[11px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    <span className="font-black text-white">{teacher.hourly_rate || 1}</span>
                                                    <span className="text-zinc-500">cr/hr</span>
                                                </div>
                                            </div>
                                            <Button
                                                className={`h-9 px-5 font-bold text-xs uppercase tracking-widest rounded-xl transition-all ${teacher.is_available
                                                    ? 'bg-orange-600 hover:bg-orange-500 text-black shadow-md shadow-orange-500/20'
                                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                                    }`}
                                                onClick={() => handleBookSession(teacher.id)}
                                                disabled={!teacher.is_available}
                                            >
                                                {teacher.is_available ? 'Book Session' : 'Unavailable'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Sidebar — High Contrast Editorial */}
                    <div className="space-y-10">
                        <div className="sticky top-24 space-y-10">

                            {/* Become a Teacher CTA — High Impact Invitation */}
                            <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-zinc-900 bg-zinc-950 p-10 group">
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-colors duration-1000" />

                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <span className="h-px w-4 bg-orange-500/40" />
                                        Opportunities
                                    </p>
                                    <Badge className="bg-orange-600 text-black font-black text-[9px] uppercase tracking-tighter rounded-full px-2 py-0 border-none">
                                        High Demand
                                    </Badge>
                                </div>

                                <h3 className="text-3xl font-bold text-white leading-tight mb-6 tracking-tight">
                                    Ready to teach <span className="text-zinc-500">{skill.name}</span>?
                                </h3>

                                <p className="text-sm text-zinc-500 leading-relaxed mb-10 font-medium">
                                    Your expertise is in high demand. Start earning premium <span className="text-white italic">time credits</span> while sharing your authentic knowledge.
                                </p>

                                <div className="space-y-6 mb-12">
                                    {[
                                        { t: 'Instant Credits', d: 'Earn per session', i: '⚡' },
                                        { t: 'Global Access', d: 'Teach from anywhere', i: '🌍' },
                                    ].map((b, i) => (
                                        <div key={i} className="flex items-center gap-5">
                                            <div className="h-11 w-11 bg-zinc-900 rounded-2xl flex items-center justify-center text-xl border border-white/5">{b.i}</div>
                                            <div>
                                                <p className="text-xs font-bold text-white uppercase tracking-tight">{b.t}</p>
                                                <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{b.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/profile/skills" className="block w-full">
                                    <Button className="w-full h-12 bg-white hover:bg-orange-600 hover:text-white text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">
                                        Start Teaching Now
                                    </Button>
                                </Link>
                            </div>

                            {/* Similar Skills — Editorial List */}
                            <div className="bg-zinc-950 border-2 border-zinc-900 rounded-[2.5rem] p-10">
                                <div className="mb-10 flex items-center justify-between">
                                    <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Complementary</h3>
                                    <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                                </div>

                                <div className="space-y-4 mb-10">
                                    {recommendations
                                        .filter(r => r.id !== skillId)
                                        .slice(0, 4)
                                        .map((rec) => (
                                            <Link key={rec.id} href={`/marketplace/${rec.id}`} className="group flex items-center gap-5 p-2 rounded-xl transition-all">
                                                <div className="h-12 w-12 shrink-0 rounded-[1rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:border-zinc-700">
                                                    {rec.icon || '🎓'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-white uppercase tracking-tighter truncate group-hover:text-orange-500 transition-colors">{rec.name}</p>
                                                    <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.1em]">{rec.category}</p>
                                                </div>
                                                <div className="flex items-center overflow-hidden w-4 group-hover:w-6 transition-all duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800 group-hover:text-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300">
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </Link>
                                        ))}
                                </div>

                                <Link href="/marketplace" className="block w-full">
                                    <Button variant="ghost" className="w-full h-12 text-zinc-600 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-900 transition-all">
                                        Network Inventory
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust Banner — Sharp & Typographic */}
                            <div className="px-6 py-4 border-l border-zinc-900 flex flex-col gap-2">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Consensus Verified</h4>
                                <p className="text-[10px] font-bold text-zinc-700 leading-tight uppercase tracking-wider">
                                    Transactional integrity maintained via time-banking protocol.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
