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
        loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-[3rem] border border-border" />
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
        <section ref={containerRef} className="relative w-full min-h-[85vh] md:min-h-[80vh] pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-background flex items-center">

            {/* Subtle dynamic dot grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

            {/* Glowing Accent behind the visual */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF7020]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <m.div
                className="relative z-10 mx-auto w-full max-w-screen-xl px-4 sm:px-8 lg:px-12"
                initial="initial"
                animate="animate"
                variants={containerVariants}
            >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">

                    {/* Left Content Area (7 columns) */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 md:space-y-8 w-full relative z-20">

                        <div className="space-y-4 md:space-y-6">
                            <m.h1
                                className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-black tracking-tighter leading-[1.02] text-foreground"
                                variants={itemVariants}
                            >
                                Stop Paying. <br />
                                Start <span className="text-[#FF7020]">Exchanging.</span>
                            </m.h1>

                            <m.p
                                className="max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium"
                                variants={itemVariants}
                            >
                                Your time is the new currency. Teach what you know to earn temporal credits, and spend them to learn absolutely anything from experts.
                            </m.p>
                        </div>

                        {/* Premium Modern CTA Button */}
                        <m.div
                            variants={itemVariants}
                            className="w-full max-w-xl group/cta"
                        >
                            <Link href={isAuthenticated ? "/dashboard" : "/login"} className="inline-block relative">
                                <m.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative z-10"
                                >
                                    <Button className="h-16 px-12 rounded-[1.25rem] bg-foreground hover:bg-orange-600 text-background hover:text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-4 border-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-12px_rgba(255,112,32,0.4)]">
                                        <span className="relative z-10">{isAuthenticated ? "Go to Dashboard" : "Start Journey"}</span>
                                        <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center group-hover/cta:bg-white/20 transition-colors duration-500">
                                            <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                    </Button>
                                </m.div>

                                {/* Refined Outer Accent Ring */}
                                <div className="absolute -inset-3 border border-white/5 rounded-[1.75rem] transition-all duration-700 group-hover/cta:border-[#FF7020]/30 group-hover/cta:-inset-4 opacity-50 pointer-events-none" />
                                <div className="absolute -inset-0.5 bg-[#FF7020] rounded-[1.25rem] blur-2xl opacity-0 group-hover/cta:opacity-20 transition-opacity duration-700 pointer-events-none" />
                            </Link>
                        </m.div>

                        {/* Hard-hitting Stats */}
                        <m.div
                            className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 text-sm text-muted-foreground"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Users className="h-4 w-4 text-foreground" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-foreground font-bold text-base">
                                        <AnimatedCounter value={1200} />+
                                    </span>
                                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Active Peers</span>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-border hidden sm:block" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-orange-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-foreground font-bold text-base">
                                        <AnimatedCounter value={15000} />+
                                    </span>
                                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Hours Exchanged</span>
                                </div>
                            </div>
                        </m.div>
                    </div>

                    {/* Right Content Area: Learning Lottie Animation (5 columns) */}
                    <div className="lg:col-span-5 relative w-full h-[350px] lg:h-[550px] flex items-center justify-center mt-8 lg:mt-0 z-10 hidden sm:flex">
                        <m.div
                            className="w-full h-full relative group flex items-center justify-center transform lg:-translate-x-12"
                            variants={itemVariants}
                        >
                            <m.div
                                className="relative w-[130%] h-[130%] lg:w-[150%] lg:h-[150%] max-w-[900px] flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(255,112,32,0.15)]"
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
                                    className="w-full h-full object-contain scale-110 md:scale-125"
                                />
                            </m.div>
                        </m.div>
                    </div>

                </div>
            </m.div>

        </section>
    );
}
