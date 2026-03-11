'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { m, useScroll, useTransform, useMotionValue, useInView, animate } from "framer-motion";
import { Search, ArrowRight, Zap, Users } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useRef, useEffect } from "react";
import dynamic from 'next/dynamic';

const DotLottieReact = dynamic(
    () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-transparent" />
    }
);

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    useEffect(() => {
        if (inView) {
            animate(count, value, {
                duration: duration,
                ease: "easeOut"
            });
        }
    }, [inView, value, count, duration]);

    return <m.span ref={ref}>{rounded}</m.span>;
}

const containerVariants = {
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

export function HeroSection() {
    const { isAuthenticated } = useAuthStore();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="relative w-full min-h-[90dvh] pt-20 pb-12 overflow-hidden bg-background flex items-center justify-center">

            {/* Subtle dynamic dot grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-20 pointer-events-none" />

            {/* Glowing Accent - Positioned differently for Desktop vs Mobile */}
            <div className="absolute left-1/2 lg:left-auto lg:right-0 top-1/2 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF7020]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <m.div
                className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12"
                initial="initial"
                animate="animate"
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Text Area - Left Aligned on Desktop, Centered on Mobile */}
                    <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 w-full relative z-20">

                        <div className="space-y-4 md:space-y-6 max-w-2xl lg:max-w-none">
                            <m.h1
                                className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-bold tracking-tighter leading-[1.05] text-foreground"
                                variants={itemVariants}
                            >
                                Stop Paying. <br className="hidden lg:block" />
                                Start <span className="text-[#FF7020]">Exchanging.</span>
                            </m.h1>

                            <m.p
                                className="mx-auto lg:mx-0 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium"
                                variants={itemVariants}
                            >
                                Waktunya berbagi ilmu tanpa batas. Gunakan waktu sebagai alat tukar untuk belajar apa pun dari para ahli di komunitas kami.
                            </m.p>
                        </div>

                        {/* CTA Button - Fancy Desktop Style, Centered for Mobile */}
                        <m.div
                            variants={itemVariants}
                            className="w-full lg:max-w-xl group/cta"
                        >
                            <Link href={isAuthenticated ? "/dashboard" : "/login"} className="inline-block relative">
                                <m.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative z-10"
                                >
                                    <Button className="h-14 md:h-16 px-10 md:px-12 rounded-[1.25rem] bg-foreground hover:bg-primary text-background hover:text-white font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 border-none shadow-lg">
                                        <span className="relative z-10">{isAuthenticated ? "Go to Dashboard" : "Start Journey Now"}</span>
                                        <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center group-hover/cta:bg-white/20 transition-colors duration-500">
                                            <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                    </Button>
                                </m.div>

                                {/* Desktop Accent Rings */}
                                <div className="absolute -inset-3 border border-white/5 rounded-[1.75rem] transition-all duration-700 group-hover/cta:border-[#FF7020]/30 group-hover/cta:-inset-4 opacity-0 lg:opacity-50 pointer-events-none" />
                                <div className="absolute -inset-0.5 bg-[#FF7020] rounded-[1.25rem] blur-2xl opacity-0 group-hover/cta:opacity-20 transition-opacity duration-700 pointer-events-none hidden lg:block" />
                            </Link>
                        </m.div>

                        {/* Stats - ONLY visible on Desktop (lg) */}
                        <m.div
                            className="hidden lg:flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 text-sm text-muted-foreground"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Users className="h-4 w-4 text-[#FF7020]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-foreground font-semibold text-base">
                                        <AnimatedCounter value={1200} />+
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Active Peers</span>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-border" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-orange-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-foreground font-semibold text-base">
                                        <AnimatedCounter value={15000} />+
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Hours Exchanged</span>
                                </div>
                            </div>
                        </m.div>
                    </div>

                    {/* Animation Area: Right on Desktop, Below on Mobile */}
                    <div className="lg:col-span-5 relative w-full h-[300px] md:h-[400px] lg:h-[550px] flex items-center justify-center mt-4 lg:mt-0 z-10 transition-all duration-500">
                        <m.div
                            className="w-full h-full relative group flex items-center justify-center lg:justify-end lg:scale-110 xl:scale-125"
                            variants={itemVariants}
                        >
                            <m.div
                                className="relative w-full h-full max-w-[500px] lg:max-w-[750px] flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(255,112,32,0.15)]"
                                animate={{
                                    y: [0, -15, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <DotLottieReact
                                    src="/Learning.json"
                                    loop
                                    autoplay
                                    className="w-full h-full object-contain"
                                />
                            </m.div>
                        </m.div>
                    </div>

                </div>
            </m.div>

        </section>
    );
}
