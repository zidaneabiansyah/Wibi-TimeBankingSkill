'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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

import { MessageSquare, BookOpen, Award, ArrowUpRight, ArrowRight, Bookmark } from 'lucide-react';
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
        <main ref={containerRef} className={`flex-1 relative overflow-x-hidden ${plusJakartaSans.className}`}>
            {/* ── Section 1: Hero with Frosted Overlay ────────────────── */}
            <section className="relative w-full h-dvh min-h-[600px] overflow-hidden">
                {/* Background Image */}
                <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop"
                    alt="Community Wibi"
                    fill
                    className="object-cover z-0"
                    priority
                />

                {/* Left Side Overlay with Fade to Transparent */}
                <div
                    className="absolute top-0 left-0 h-full w-[55%] bg-background z-10"
                    style={{
                        maskImage: 'linear-gradient(to right, black 55%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 55%, transparent 100%)',
                    }}
                >
                    <div className="p-10 md:p-16 flex flex-col justify-center h-full max-w-xl">
                        <span className="text-xs text-orange-300 uppercase tracking-widest font-semibold mb-4 inline-block">
                            Komunitas Wibi
                        </span>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                            Komunitas Belajar yang Saling <span className="text-primary">Menguatkan</span>
                        </h1>

                        <p className="text-sm text-muted-foreground mt-3 max-w-xs leading-relaxed">
                            Bergabunglah dengan ribuan pelajar dan mentor yang saling mendukung dalam perjalanan belajar mereka.
                        </p>

                        <div className="mt-6">
                            <button className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all inline-block shadow-lg hover:shadow-primary/20">
                                Gabung Sekarang
                            </button>
                        </div>
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

                        <div className="py-12 px-4 sm:px-8">
                            <CustomLeaderboard />
                        </div>
                    </div>
                </m.section>
            </div>
        </main>
    );
}
