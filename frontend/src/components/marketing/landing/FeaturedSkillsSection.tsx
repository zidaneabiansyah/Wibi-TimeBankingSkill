'use client';

import Link from "next/link";
import { ArrowRight, Calculator, Terminal, Globe2 } from "lucide-react";
import { m } from "framer-motion";

const skills = [
    {
        icon: Calculator,
        title: "Mathematics",
        description: "Algebra, Calculus, Statistics",
        category: "Academic",
        tutors: "25+",
    },
    {
        icon: Terminal,
        title: "Programming",
        description: "Web Dev, Python, Mobile Apps",
        category: "Technical",
        tutors: "18+",
    },
    {
        icon: Globe2,
        title: "Languages",
        description: "English, Japanese, Korean",
        category: "Language",
        tutors: "30+",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
};

export function FeaturedSkillsSection() {
    return (
        <section className="relative w-full py-24 md:py-32 bg-background border-t border-border overflow-hidden">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 md:mb-20">
                    <m.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Minimalist Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full border border-[#FF7020]/30 bg-[#FF7020]/10 text-[#FF7020] text-xs font-semibold tracking-widest uppercase mb-6 sm:mb-8 hover:bg-[#FF7020]/20 transition-colors cursor-default">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7020]" />
                            Popular Skills
                        </div>

                        <h2 className="text-4xl md:text-[2.75rem] font-extrabold text-foreground tracking-tight">
                            Explore What's Popular
                        </h2>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="md:text-right"
                    >
                        <p className="text-muted-foreground text-lg md:text-xl max-w-md leading-relaxed md:ml-auto">
                            Browse the most sought-after skills taught by our community members.
                        </p>
                    </m.div>
                </div>

                {/* Animated Cards Grid */}
                <m.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-10%" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {skills.map((skill, idx) => {
                        const Icon = skill.icon;
                        return (
                            <m.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -6, scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="group relative flex flex-col p-8 sm:p-10 rounded-3xl bg-card border border-border hover:border-border/80 shadow-md hover:shadow-2xl transition-all duration-400"
                            >
                                {/* Top Layout: Icon & Category badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-muted transition-all duration-500 shadow-lg">
                                        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" strokeWidth={1.5} />
                                    </div>

                                    {/* Category Badge - Top Right */}
                                    <div className="inline-flex items-center rounded-full border border-[#B34000]/60 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-[#FF7020] bg-[#FF7020]/5 group-hover:bg-[#FF7020]/10 transition-colors duration-300">
                                        {skill.category}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 mb-4">
                                        <div className="h-[1px] w-6 bg-border group-hover:w-10 group-hover:bg-orange-500/50 transition-all duration-500" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-orange-500 transition-colors duration-300">
                                        {skill.title}
                                    </h3>
                                    <p className="text-muted-foreground text-base leading-relaxed mb-4 group-hover:text-foreground transition-colors duration-300">
                                        {skill.description}
                                    </p>
                                </div>

                                {/* Explore Link Area */}
                                <div className="mt-10 pt-6 border-t border-border flex justify-between items-center group-hover:border-border/80 transition-colors duration-300">
                                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-orange-500 transition-colors duration-300">
                                        Explore Skills
                                    </span>

                                    {/* Animated Arrow */}
                                    <Link href="/marketplace" className="w-10 h-10 rounded-full border border-border bg-muted flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all duration-300 cursor-pointer">
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" strokeWidth={2.5} />
                                    </Link>
                                </div>

                                {/* Subtle internal hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF7020]/0 via-[#FF7020]/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
                            </m.div>
                        );
                    })}
                </m.div>

                {/* View All Button */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 flex justify-center"
                >
                    <Link href="/marketplace" className="group inline-flex items-center gap-3 px-8 h-14 rounded-full bg-foreground text-background font-semibold text-base hover:bg-foreground/90 transition-colors duration-300">
                        View All Categories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </m.div>

            </div>
        </section>
    );
}
