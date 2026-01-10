'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { MessageSquare, BookOpen, Award, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const LeaderboardTabs = dynamic(
  () => import('@/components/badge/LeaderboardTabs').then((mod) => mod.LeaderboardTabs),
  { ssr: false, loading: () => <div className="h-96 w-full animate-pulse bg-muted rounded-3xl" /> }
);
import { m } from 'framer-motion';
import gsap from 'gsap';
import { Footer, Header } from '@/components/layout';

export default function CommunityPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const orbs = useRef<HTMLDivElement[]>([]);

    // Animate background orbs
    useEffect(() => {
        if (!containerRef.current) return;

        // Create floating animation for orbs
        orbs.current.forEach((orb, index) => {
            const duration = 15 + index * 5;
            const delay = index * 0.5;
            
            gsap.to(orb, {
                y: -30,
                duration: duration,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: delay,
            });

            gsap.to(orb, {
                x: Math.sin(index) * 50,
                duration: duration * 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: delay,
            });
        });

        return () => {
            gsap.killTweensOf(orbs.current);
        };
    }, []);

    const sections = [
        {
            icon: MessageSquare,
            title: 'Forum',
            description: 'Join discussions and share knowledge with the community',
            href: '/community/forum',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: BookOpen,
            title: 'Success Stories',
            description: 'Read inspiring stories from our community members',
            href: '/community/stories',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: Award,
            title: 'Endorsements',
            description: 'Get recognized for your skills by peers',
            href: '/community/endorsements',
            color: 'from-amber-500 to-amber-600',
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main ref={containerRef} className="flex-1 relative overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Orb 1 - Blue */}
                    <div
                        ref={(el) => {
                            if (el) orbs.current[0] = el;
                        }}
                        className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl -top-32 -left-32"
                    />
                    
                    {/* Orb 2 - Purple */}
                    <div
                        ref={(el) => {
                            if (el) orbs.current[1] = el;
                        }}
                        className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/3 -right-32"
                    />
                    
                    {/* Orb 3 - Amber */}
                    <div
                        ref={(el) => {
                            if (el) orbs.current[2] = el;
                        }}
                        className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -bottom-32 left-1/3"
                    />
                </div>

                <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16 py-16 space-y-24 relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <h1 className="text-5xl font-bold tracking-tight">
                            Community <span className="text-primary">Hub</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Connect, learn, and grow together with our vibrant community of learners and mentors.
                        </p>
                    </div>

                    {/* Community Sections Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <div
                                    key={section.title}
                                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-xl hover:border-primary/50"
                                >
                                    {/* Background linear */}
                                    <div
                                        className={`absolute inset-0 bg-linear-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 p-8 flex flex-col h-full">
                                        <div className="mb-6">
                                            <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${section.color} text-white shadow-lg shadow-primary/10`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                            {section.title}
                                        </h2>
                                        <p className="text-muted-foreground mb-6 grow leading-relaxed">
                                            {section.description}
                                        </p>

                                        <Button
                                            onClick={() => router.push(section.href)}
                                            className="w-full h-12 rounded-xl font-semibold"
                                        >
                                            Explore
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Stats Section */}
                    <div className="bg-card/50 border border-border/50 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="space-y-1">
                                <p className="text-5xl font-bold text-primary">1000+</p>
                                <p className="text-muted-foreground font-medium">Active Members</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-5xl font-bold text-primary">500+</p>
                                <p className="text-muted-foreground font-medium">Forum Discussions</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-5xl font-bold text-primary">200+</p>
                                <p className="text-muted-foreground font-medium">Success Stories</p>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <m.section 
                        id="leaderboard"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-12"
                    >
                        <div className="text-center space-y-4 max-w-2xl mx-auto">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                                <Trophy className="h-8 w-8" />
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight italic">Community Rankings</h2>
                            <p className="text-lg text-muted-foreground">
                                Lihat siapa yang memimpin hari ini. Teruslah berkontribusi untuk mendaki tangga peringkat!
                            </p>
                        </div>

                        <div className="bg-card/50 backdrop-blur-md rounded-3xl border border-border/50 p-6 sm:p-12 shadow-2xl shadow-primary/5">
                            <LeaderboardTabs limit={15} />
                        </div>
                    </m.section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
