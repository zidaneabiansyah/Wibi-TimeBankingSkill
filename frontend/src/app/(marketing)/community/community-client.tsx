'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { m } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const CustomLeaderboard = dynamic(
    () => import('@/components/marketing/community/CustomLeaderboard').then((mod) => mod.CustomLeaderboard),
    { ssr: false, loading: () => <div className="h-96 w-full animate-pulse bg-stone-900 rounded-3xl" /> }
);

import { MessageSquare, BookOpen, Award, ArrowUpRight, ArrowRight, Bookmark, Zap } from 'lucide-react';
import { CommunityFeatures } from '@/components/marketing/community/CommunityFeatures';

const iconMap = {
    MessageSquare,
    BookOpen,
    Award,
};

interface Section {
    icon: string;
    title: string;
    description: string;
    href: string;
    color: string;
}

interface Stat {
    value: string;
    label: string;
}

interface CommunityClientProps {
    sections: Section[];
    stats: Stat[];
}

export function CommunityClient({ sections, stats }: CommunityClientProps) {
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

    return (
        <main ref={containerRef} className={`flex-1 relative overflow-x-clip ${plusJakartaSans.className}`}>
            {/* ── Section 1: Hero with Full Image & Glassmorphism ────────────────── */}
            <section className="relative w-full h-dvh min-h-[700px] overflow-hidden flex flex-col items-center justify-center text-center">
                {/* Full Background Image */}
                <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop"
                    alt="Community Wibi"
                    fill
                    className="object-cover z-0"
                    priority
                />

                {/* Universal Subtle Dark Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-white/40 dark:bg-black/50 z-10 transition-colors duration-500" />

                {/* Center Content */}
                <div className="relative z-20 px-6 max-w-4xl flex flex-col items-center mt-18 md:mt-10">
                    {/* Top small transparent badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur-md border border-stone-200 dark:border-white/10 text-xs font-semibold text-stone-800 dark:text-white/90 mb-6 backdrop-saturate-150 transition-colors duration-500 shadow-sm dark:shadow-none">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Komunitas Berbagi Ilmu #1 di Indonesia</span>
                    </div>

                    <h1 
                        className="text-4xl md:text-5xl lg:text-7xl font-medium text-stone-900 dark:text-white leading-[1.15] tracking-tight transition-colors duration-500"
                        style={{ 
                            filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(0,0,0,0.6))' 
                        }}
                    >
                        Tempat terbaik untuk menemukan<br /> <span className="font-light italic text-primary">Komunitasmu</span>
                    </h1>

                    <p 
                        className="mt-8 text-base md:text-xl text-stone-900 font-medium dark:text-zinc-200 max-w-2xl leading-relaxed transition-colors duration-500"
                        style={{ 
                            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(0,0,0,0.5))' 
                        }}
                    >
                        Sudah siap untuk berkembang? Temukan ribuan pelajar dan mentor untuk saling mendukung dalam perjalanan belajarmu.
                    </p>

                    {/* Search-like CTA Button */}
                    <div className="mt-10 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-stone-200 dark:border-white/20 sm:rounded-full rounded-3xl p-1.5 shadow-2xl w-full sm:w-auto transition-colors duration-500">
                        <span className="text-stone-500 dark:text-zinc-300 font-medium text-sm flex-1 px-4 py-3 sm:py-0 w-full sm:w-auto text-center sm:text-left truncate">
                            Bergabung dengan wibi...
                        </span>
                        <Link 
                            href="/community/forum"
                            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold text-sm px-8 py-3 rounded-full hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors w-full sm:w-auto text-center whitespace-nowrap shadow-md"
                        >
                            Gabung Sekarang
                        </Link>
                    </div>
                </div>
            </section>

            <CommunityFeatures />

            <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16 py-16 space-y-24 relative z-10 bg-background text-foreground">
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
                        <h2 className="text-4xl font-bold tracking-tight text-foreground italic">Community Rankings</h2>
                        <p className="text-lg text-muted-foreground">
                            Lihat siapa yang memimpin hari ini. Teruslah berkontribusi untuk mendaki tangga peringkat!
                        </p>
                    </div>

                    <div className="relative pt-8 mt-12">
                        {/* Translucent background box with border */}
                        <div className="absolute inset-0 bg-card/30 backdrop-blur-xl border border-border rounded-[3rem] -z-10 shadow-2xl ring-1 ring-inset ring-border/5" />

                        <div className="py-8 md:py-12 px-2 sm:px-8">
                            <CustomLeaderboard />
                        </div>
                    </div>
                </m.section>
            </div>
        </main>
    );
}
