'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { m, Variants } from "framer-motion";

const containerVariants: Variants = {
    initial: { opacity: 0 },
    whileInView: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    whileInView: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
};

export function CTASection() {
    const { isAuthenticated } = useAuthStore();

    return (
        <section className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden border-t border-border/10 bg-background">
            {/* Subtle background glow */}
            <div className="absolute inset-x-0 bottom-0 h-full w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            <m.div
                className="relative mx-auto max-w-screen-xl px-6 sm:px-12 lg:px-16"
                variants={containerVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
            >
                <m.div
                    className="flex flex-col items-center space-y-8 text-center bg-card/30 backdrop-blur-sm border border-border/50 rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-xl transition-all duration-500 hover:border-primary/20 hover:bg-card/40 group"
                    variants={itemVariants}
                >
                    <m.div
                        className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary bg-primary/5 mb-2 shadow-sm"
                        variants={itemVariants}
                    >
                        Get Started Today
                    </m.div>

                    <m.h2
                        className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-foreground"
                        variants={itemVariants}
                    >
                        Ready to Exchange Skills?
                    </m.h2>

                    <m.p
                        className="mx-auto max-w-[40rem] text-muted-foreground text-lg sm:text-xl font-medium leading-relaxed"
                        variants={itemVariants}
                    >
                        Join 1,200+ students who are already learning and teaching without spending money.
                    </m.p>

                    <m.div
                        className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto"
                        variants={itemVariants}
                    >
                        <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="w-full sm:w-auto px-10 h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                                    {isAuthenticated ? "Go to Dashboard" : "Sign Up Free"}
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </m.div>
                        </Link>
                        <Link href="/how-it-works" className="w-full sm:w-auto">
                            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 h-14 rounded-full font-bold text-base hover:bg-muted/50 border-border/50">
                                    Learn More
                                </Button>
                            </m.div>
                        </Link>
                    </m.div>
                </m.div>
            </m.div>
        </section>
    );
}
