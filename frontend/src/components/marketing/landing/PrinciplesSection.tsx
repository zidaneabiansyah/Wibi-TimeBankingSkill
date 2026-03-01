'use client';

import React from "react";
import { m, Variants } from "framer-motion";

const containerVariants: Variants = {
    initial: { opacity: 0 },
    whileInView: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    initial: { opacity: 0, y: 40 },
    whileInView: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
};

const sideItemVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    whileInView: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
};

export function PrinciplesSection() {
    return (
        <section className="py-24 md:py-32 relative border-t border-border bg-background overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] bg-[#ff5500]/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 font-sans">
                <m.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-[3.25rem] font-black tracking-tighter text-foreground leading-[0.9] mb-6">
                        Core<br />
                        <span className="text-[#ff5500]">Principles</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl font-medium leading-relaxed">
                        Time Banking is built on these core values that make it a unique and powerful system.
                    </p>
                </m.div>

                {/* Asymmetrical Bento Grid */}
                <m.div
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                    variants={containerVariants}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Item 1: Large Span */}
                    <m.div
                        className="md:col-span-12 lg:col-span-8 group relative p-10 md:p-16 rounded-[40px] bg-card/50 backdrop-blur-xl border border-border overflow-hidden transition-all duration-700 hover:bg-card shadow-2xl"
                        variants={itemVariants}
                    >
                        <div className="absolute top-0 right-0 p-8 text-[12rem] font-black leading-none text-foreground/[0.02] group-hover:text-foreground/[0.04] transition-colors duration-700 pointer-events-none select-none -mr-8 -mt-12">
                            01
                        </div>
                        <div className="relative z-10 w-full h-full flex flex-col justify-end">
                            <div className="mb-auto">
                                <span className="inline-block px-4 py-1.5 rounded-full border border-[#ff5500]/20 bg-[#ff5500]/10 text-[#ff5500] text-xs font-bold tracking-widest mb-12 uppercase">
                                    Axiom I
                                </span>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">Waktu Setiap Orang Setara</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-md font-medium">
                                    Satu jam layanan bernilai satu kredit waktu, apa pun layanan yang diberikan. Mengajar kalkulus = mengajar gitar = membantu bahasa Inggris.
                                </p>
                            </div>
                        </div>
                    </m.div>

                    {/* Item 2: Vertical Stack */}
                    <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <m.div
                            className="flex-1 group relative p-10 rounded-[32px] bg-card/50 backdrop-blur-xl border border-border overflow-hidden transition-all duration-700 hover:bg-card shadow-xl"
                            variants={sideItemVariants}
                        >
                            <div className="absolute top-0 right-0 p-6 text-[8rem] font-black leading-none text-foreground/[0.02] group-hover:text-foreground/[0.04] transition-colors duration-700 pointer-events-none select-none -mr-4 -mt-6">
                                02
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <span className="inline-block px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400 text-[10px] font-bold tracking-widest self-start mb-8 uppercase">
                                    Axiom II
                                </span>
                                <div>
                                    <h3 className="text-2xl font-black text-foreground mb-3">Semua Orang Berharga</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                        Setiap orang memiliki sesuatu untuk ditawarkan. Time Banking mengakui bahwa setiap orang memiliki keterampilan berharga untuk dibagikan.
                                    </p>
                                </div>
                            </div>
                        </m.div>

                        <m.div
                            className="flex-1 group relative p-10 rounded-[32px] bg-card/50 backdrop-blur-xl border border-border overflow-hidden transition-all duration-700 hover:bg-card shadow-xl"
                            variants={sideItemVariants}
                        >
                            <div className="absolute top-0 right-0 p-6 text-[8rem] font-black leading-none text-foreground/[0.02] group-hover:text-foreground/[0.04] transition-colors duration-700 pointer-events-none select-none -mr-4 -mt-6">
                                03
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <span className="inline-block px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-500 dark:text-purple-400 text-[10px] font-bold tracking-widest self-start mb-8 uppercase">
                                    Axiom III
                                </span>
                                <div>
                                    <h3 className="text-2xl font-black text-foreground mb-3">Tanpa Melibatkan Uang</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                        Time Banking beroperasi sepenuhnya di luar sistem moneter. Tidak ada uang tunai yang berpindah tangan.
                                    </p>
                                </div>
                            </div>
                        </m.div>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
