'use client';

import { BookOpen, CalendarHeart, RefreshCcw, ArrowRight } from "lucide-react";
import { m } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HowItWorksSection() {
    return (
        <section className="relative w-full py-24 md:py-32 bg-[#0B0B0B] overflow-hidden font-sans border-t border-[#1A1A1A]">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
                    <m.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        {/* Premium Label */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full border border-[#FF7020]/30 bg-[#FF7020]/10 text-[#FF7020] text-xs font-semibold tracking-widest uppercase mb-6 sm:mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7020] animate-pulse" />
                            How it works
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                            Knowledge exchange, <br />
                            <span className="text-[#FF7020]">simplified.</span>
                        </h2>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="md:text-right"
                    >
                        <p className="text-gray-400 text-lg sm:text-xl max-w-md leading-relaxed md:ml-auto">
                            No money involved. Just pure exchange of value. Teach what you know, learn what you don't.
                        </p>
                    </m.div>
                </div>

                {/* Dashboard-like Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

                    {/* Card 1: Tall Profile */}
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="col-span-1 lg:col-span-5 relative group rounded-[2rem] bg-[#121212] border border-[#222] overflow-hidden flex flex-col min-h-[480px] lg:min-h-[560px] cursor-pointer hover:border-[#444] shadow-2xl transition-all duration-500 hover:-translate-y-1"
                    >
                        {/* Text Content */}
                        <div className="p-8 sm:p-10 flex-1 relative z-10 flex flex-col">
                            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center mb-8 text-gray-500 group-hover:text-white group-hover:border-[#FF7020]/50 transition-all duration-300">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Create Your Profile</h3>
                            <p className="text-[#888] leading-relaxed text-base sm:text-lg">
                                Set up in minutes. Highlight your expertise, set your availability, and let the community know what skills you bring to the table.
                            </p>
                        </div>

                        {/* Abstract Mockup UI 1 (Profile Card) */}
                        <div className="relative mt-auto w-full border-t border-[#1C1C1C] bg-[#0A0A0A] overflow-hidden flex items-end justify-center px-6 pt-10 min-h-[220px]">
                            <div className="w-full max-w-[320px] h-[180px] bg-[#161616] border border-[#222] border-b-0 rounded-t-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 transform group-hover:-translate-y-3 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-[#0A0A0A] border-2 border-[#2A2A2A] relative overflow-hidden">
                                        {/* Avatar placeholder */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF7020]/20 to-transparent" />
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#333]" />
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="h-3.5 bg-[#444] rounded-full w-3/4" />
                                        <div className="h-2.5 bg-[#2A2A2A] rounded-full w-1/2" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-7 w-20 bg-[#FF7020]/10 border border-[#FF7020]/20 rounded-full flex items-center justify-center">
                                        <div className="w-1/2 h-1.5 bg-[#FF7020]/50 rounded-full" />
                                    </div>
                                    <div className="h-7 w-24 bg-[#0A0A0A] border border-[#2A2A2A] rounded-full" />
                                    <div className="h-7 w-16 bg-[#0A0A0A] border border-[#2A2A2A] rounded-full" />
                                </div>
                            </div>

                            {/* Decorative background lines */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[#FF7020]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        </div>
                    </m.div>

                    {/* Right column for 2 horizontal cards */}
                    <div className="col-span-1 lg:col-span-7 flex flex-col gap-4 sm:gap-6">

                        {/* Card 2: Book Sessions */}
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex-1 relative group rounded-[2rem] bg-[#121212] border border-[#222] overflow-hidden flex flex-col sm:flex-row hover:border-[#444] shadow-xl hover:-translate-y-1 transition-all duration-500"
                        >
                            {/* Text Content */}
                            <div className="p-8 sm:p-10 flex-1 relative z-10 flex flex-col justify-center max-w-sm">
                                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center mb-6 text-gray-500 group-hover:text-white group-hover:border-[#FF7020]/50 transition-all duration-300">
                                    <CalendarHeart className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Book Sessions</h3>
                                <p className="text-[#888] leading-relaxed text-base">
                                    Browse the marketplace and lock in 1-on-1 sessions instantly using a seamless calendar.
                                </p>
                            </div>

                            {/* Abstract Mockup UI 2 (Calendar / Slots) */}
                            <div className="w-full sm:w-[320px] lg:w-[360px] h-[220px] sm:h-auto border-t sm:border-t-0 sm:border-l border-[#1C1C1C] bg-[#0A0A0A] relative flex items-center justify-center p-6 lg:p-10 overflow-hidden">
                                <div className="w-full space-y-3 relative z-10 group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                    <div className="flex justify-between items-center p-4 rounded-xl border border-[#2A2A2A] bg-[#161616]">
                                        <span className="text-xs text-gray-500 font-mono tracking-wider">MAR 10 - 10:00 AM</span>
                                        <div className="w-4 h-4 rounded border border-[#444]" />
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl border border-[#FF7020]/30 bg-[#FF7020]/[0.05] shadow-[0_0_20px_rgba(255,112,32,0.08)]">
                                        <span className="text-xs text-[#FF7020] font-mono tracking-wider font-semibold">MAR 10 - 11:30 AM</span>
                                        <div className="w-4 h-4 rounded bg-[#FF7020] shadow-[0_0_10px_rgba(255,112,32,0.4)] flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-black rounded" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl border border-[#2A2A2A] bg-[#161616]">
                                        <span className="text-xs text-gray-500 font-mono tracking-wider">MAR 12 - 02:00 PM</span>
                                        <div className="w-4 h-4 rounded border border-[#444]" />
                                    </div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
                            </div>
                        </m.div>

                        {/* Card 3: Earn & Learn */}
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="flex-1 relative group rounded-[2rem] bg-[#121212] border border-[#222] overflow-hidden flex flex-col sm:flex-row-reverse hover:border-[#444] shadow-xl hover:-translate-y-1 transition-all duration-500"
                        >
                            {/* Text Content */}
                            <div className="p-8 sm:p-10 flex-1 relative z-10 flex flex-col justify-center max-w-sm">
                                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center mb-6 text-gray-500 group-hover:text-white group-hover:border-[#FF7020]/50 transition-all duration-300">
                                    <RefreshCcw className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Earn & Learn</h3>
                                <p className="text-[#888] leading-relaxed text-base">
                                    Teach a skill to earn credits. Spend those identical credits to learn from anyone else.
                                </p>
                            </div>

                            {/* Abstract Mockup UI 3 (Credits / Exchange) */}
                            <div className="w-full sm:w-[320px] lg:w-[360px] h-[220px] sm:h-auto border-t sm:border-t-0 sm:border-r border-[#1C1C1C] bg-[#0A0A0A] relative flex items-center justify-center p-6 lg:p-10">
                                <div className="relative w-40 h-40 flex items-center justify-center group-hover:rotate-[15deg] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                    {/* Abstract Coin/Exchange Circles */}
                                    <div className="absolute inset-0 rounded-full border border-dashed border-[#444] bg-[#0A0A0A] animate-[spin_60s_linear_infinite]" />
                                    <div className="absolute inset-3 rounded-full border border-[#222] bg-[#121212]" />
                                    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#FF7020]/20 to-[#0A0A0A] border border-[#FF7020]/30 shadow-[0_0_40px_rgba(255,112,32,0.15)] flex flex-col items-center justify-center">
                                        <span className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-widest">Balance</span>
                                        <span className="text-3xl font-black text-white leading-none">12<span className="text-[#FF7020]">h</span></span>
                                    </div>

                                    {/* Small orbital dots */}
                                    <div className="absolute top-0 right-1/4 w-3 h-3 bg-[#FF7020] rounded-full shadow-[0_0_10px_rgba(255,112,32,0.8)]" />
                                    <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-gray-500 rounded-full" />
                                </div>
                            </div>
                        </m.div>

                    </div>
                </div>

                {/* Bottom CTA Button */}
                <m.div
                    className="mt-16 sm:mt-24 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Link href="/register">
                        <Button className="group rounded-full bg-white hover:bg-gray-200 text-black px-8 h-14 font-semibold text-base transition-all duration-300">
                            Start Exchanging Value
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </m.div>

            </div>
        </section>
    );
}
