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
        loading: () => <div className="w-full h-full bg-[#121212] animate-pulse rounded-[3rem] border border-[#222]" />
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
        <section ref={containerRef} className="relative w-full min-h-[85vh] md:min-h-[80vh] pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-[#0B0B0B] flex items-center">

            {/* Extremely subtle static dot grid background - no gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

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
                                className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-white"
                                variants={itemVariants}
                            >
                                Stop Paying. <br />
                                Start <span className="text-transparent bg-clip-text bg-white border-b-4 border-[#FF7020] pb-1">Exchanging.</span>
                            </m.h1>

                            <m.p
                                className="max-w-xl text-lg sm:text-lg md:text-xl text-gray-400 leading-relaxed font-medium"
                                variants={itemVariants}
                            >
                                Your time is the new currency. Teach what you know to earn temporal credits, and spend them to learn absolutely anything from experts.
                            </m.p>
                        </div>

                        {/* Modernized Search/Action Bar */}
                        <m.div
                            variants={itemVariants}
                            className="w-full max-w-lg relative group"
                        >
                            <div className="flex flex-col sm:flex-row items-center p-2 bg-[#121212] border border-[#2A2A2A] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:border-[#555]">

                                <div className="flex-1 w-full flex items-center px-4 py-3 sm:py-0">
                                    <Search className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="What do you want to master?"
                                        className="bg-transparent border-none outline-none text-white text-base w-full placeholder:text-gray-500 font-medium"
                                    />
                                </div>

                                <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto mt-2 sm:mt-0 relative">
                                    <Button size="lg" className="w-full sm:w-auto rounded-xl px-8 h-12 bg-white hover:bg-[#FF7020] text-black hover:text-white font-bold text-sm sm:text-base transition-colors duration-300 overflow-hidden group/btn">
                                        <span className="relative z-10 flex items-center gap-2">
                                            {isAuthenticated ? "Dashboard" : "Get Started"}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </m.div>

                        {/* Hard-hitting Stats */}
                        <m.div
                            className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 text-sm text-gray-400"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-base">
                                        <AnimatedCounter value={1200} />+
                                    </span>
                                    <span className="text-xs uppercase tracking-wider font-semibold">Active Peers</span>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-[#222] hidden sm:block" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center">
                                    <Zap className="h-4 w-4 text-[#FF7020]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-base">
                                        <AnimatedCounter value={15000} />+
                                    </span>
                                    <span className="text-xs uppercase tracking-wider font-semibold">Hours Exchanged</span>
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
