'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { m } from "framer-motion";
import { Users, Zap, ArrowRight } from "lucide-react";
import dynamic from 'next/dynamic';
import { useAuthStore } from "@/stores/auth.store";

const DotLottieReact = dynamic(
    () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />
    }
);

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export function HeroSection() {
    const { isAuthenticated } = useAuthStore();

    return (
        <section className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />
            <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top_right,var(--tw-linear-stops))] from-primary/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-linear(ellipse_at_bottom_left,var(--tw-linear-stops))] from-secondary/5 via-transparent to-transparent opacity-40" />

            <m.div
                className="relative mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
            >
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <m.div className="space-y-8" variants={fadeInUp}>
                        <div className="space-y-6">
                            <m.div variants={fadeInUp}>
                                <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-primary/30 text-primary bg-primary/5 w-fit">
                                    🎓 Welcome to Wibi
                                </Badge>
                            </m.div>

                            <m.h1
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
                                variants={fadeInUp}
                            >
                                <span className="text-foreground">Your Time Is</span>
                                <br />
                                <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse-slow">
                                    Valuable
                                </span>
                            </m.h1>

                            <m.p
                                className="max-w-160 text-lg text-muted-foreground leading-relaxed"
                                variants={fadeInUp}
                            >
                                Platform peer-to-peer skill exchange untuk pelajar. Belajar dan ajarkan skill tanpa uang, hanya dengan waktu. Bergabunglah dengan komunitas kami.
                            </m.p>
                        </div>

                        <m.div
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                            variants={fadeInUp}
                        >
                            <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto px-8 font-semibold flex items-center gap-2">
                                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/marketplace" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-semibold">
                                    Explore Skills
                                </Button>
                            </Link>
                        </m.div>

                        <m.div
                            className="flex flex-col sm:flex-row gap-6 pt-4 text-sm text-muted-foreground"
                            variants={fadeInUp}
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                <span>1,200+ Active Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                                    <Zap className="h-4 w-4 text-secondary" />
                                </div>
                                <span>15K+ Hours Exchanged</span>
                            </div>
                        </m.div>
                    </m.div>

                    <m.div
                        className="flex items-center justify-center lg:justify-end"
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="relative w-full max-w-150 aspect-square">
                            <DotLottieReact
                                src="/Learning.json"
                                loop
                                autoplay
                                className="w-full h-full"
                            />
                        </div>
                    </m.div>
                </div>
            </m.div>
        </section>
    );
}
