'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageSquare, BookOpen, Award } from 'lucide-react';

const features = [
    {
        title: "Forum Diskusi",
        href: "/community/forum",
        icon: <MessageSquare />,
        actions: ["Mulai Diskusi Baru", "Jelajahi Topik"],
        about: "Bergabunglah dalam diskusi aktif bersama ribuan pelajar. Tanya, jawab, dan berbagi pengalaman belajarmu."
    },
    {
        title: "Success Stories",
        href: "/community/stories",
        icon: <BookOpen />,
        actions: ["Baca Cerita Inspiratif", "Bagikan Kisahmu"],
        about: "Temukan inspirasi dari pelajar Wibi yang telah berhasil meraih tujuan mereka melalui komunitas."
    },
    {
        title: "Endorsements",
        href: "/community/endorsements",
        icon: <Award />,
        actions: ["Lihat Endorsement", "Minta Endorsement"],
        about: "Dapatkan pengakuan atas skill dan kontribusimu dari sesama anggota komunitas dan mentor."
    },
];

export function CommunityFeatures() {
    const [headingText, setHeadingText] = useState("");
    const sectionRef = useRef<HTMLElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !hasAnimated.current) {
                hasAnimated.current = true;
                let i = 0;
                const text = "Jelajahi Fitur Komunitas Wibi";
                const interval = setInterval(() => {
                    setHeadingText(text.slice(0, i));
                    i++;
                    if (i > text.length) clearInterval(interval);
                }, 60);
            }
        }, { threshold: 0.2 });

        if (sectionRef.current) {
            obs.observe(sectionRef.current);
        }

        const currentRef = sectionRef.current;
        return () => {
            if (currentRef) obs.unobserve(currentRef);
        };
    }, []);

    return (
        <section ref={sectionRef} className="bg-background py-24 px-6 md:px-12 w-full">
            <div className="max-w-7xl mx-auto">
                {/* Part 1: Heading */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <h2 className="text-5xl md:text-6xl font-medium text-foreground leading-tight tracking-tight">
                        {headingText}
                        <span className="animate-pulse">|</span>
                    </h2>
                </div>

                {/* Part 2: Feature Cards Grid */}
                <div className="border-t border-border mt-10 mb-0" />

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                    {/* Feature Cards */}
                    {features.map((feature, idx) => (
                        <Link href={feature.href} key={idx} className="relative overflow-hidden block pt-8 px-4 md:px-6 pb-10 flex-col group cursor-pointer hover:bg-muted transition-colors duration-500">
                            {/* Hover Highlight Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

                            <div className="relative z-10 w-8 h-8 text-3xl mb-5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="relative z-10 text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                            <div className="relative z-10 space-y-1 mb-6">
                                {feature.actions.map((action, aIdx) => (
                                    <div key={aIdx} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer py-1 transition-colors">
                                        <ArrowUpRight size={14} />
                                        {action}
                                    </div>
                                ))}
                            </div>

                            <div className="relative z-10 border-t border-border my-6 group-hover:border-primary/20 transition-colors duration-500" />

                            <div className="relative z-10 mt-auto">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary/70 transition-colors duration-500">Tentang Fitur Ini</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-500">
                                    {feature.about}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
