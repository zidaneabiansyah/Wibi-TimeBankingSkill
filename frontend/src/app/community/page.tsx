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
import { motion } from 'framer-motion';
import gsap from 'gsap';

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
        <div 
            ref={containerRef}
            className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 relative overflow-hidden"
        >
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Orb 1 - Blue */}
                <div
                    ref={(el) => {
                        if (el) orbs.current[0] = el;
                    }}
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-32 -left-32"
                />
                
                {/* Orb 2 - Purple */}
                <div
                    ref={(el) => {
                        if (el) orbs.current[1] = el;
                    }}
                    className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-1/3 -right-32"
                />
                
                {/* Orb 3 - Amber */}
                <div
                    ref={(el) => {
                        if (el) orbs.current[2] = el;
                    }}
                    className="absolute w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -bottom-32 left-1/3"
                />
            </div>

            {/* Main Container - Centered */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center justify-center mb-16 gap-4">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white text-center">
                        Community Hub
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl">
                        Connect, learn, and grow together with our vibrant community
                    </p>
                </div>

                {/* Community Sections Grid - Centered */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.title}
                                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-xl hover:border-primary"
                            >
                                {/* Background linear */}
                                <div
                                    className={`absolute inset-0 bg-linear-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                                />

                                {/* Content */}
                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    {/* Icon */}
                                    <div className="mb-6">
                                        <div className={`inline-flex p-3 rounded-lg bg-linear-to-br ${section.color} text-white`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-muted-foreground mb-6 grow">
                                        {section.description}
                                    </p>

                                    {/* Button */}
                                    <Button
                                        onClick={() => router.push(section.href)}
                                        className="w-full"
                                    >
                                        Explore
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stats Section - Centered */}
                <div className="bg-card rounded-xl border border-border p-8 text-center mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                            <p className="text-muted-foreground">Active Members</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary mb-2">500+</p>
                            <p className="text-muted-foreground">Forum Discussions</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-primary mb-2">200+</p>
                            <p className="text-muted-foreground">Success Stories</p>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Section */}
                <motion.section 
                    id="leaderboard"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight italic">Community Rankings</h2>
                        <p className="text-lg text-muted-foreground">
                            Lihat siapa yang memimpin hari ini. Teruslah berkontribusi untuk mendaki tangga peringkat!
                        </p>
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-4 sm:p-10">
                        <LeaderboardTabs limit={15} />
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
