'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
    Zap,
    Search,
    Calendar,
    Coins,
    CheckCircle2,
    UserCircle2
} from "lucide-react";

const steps = [
    {
        id: 1,
        number: "01",
        title: "1. Buat Profilmu",
        description: "Daftar dan lengkapi profil kamu—isi data diri, info sekolah, dan bio singkat biar orang lain lebih kenal kamu.",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
        color: "from-orange-500/20 to-transparent",
        icon: UserCircle2,
        tags: ["Onboarding", "Profile"]
    },
    {
        id: 2,
        number: "02",
        title: "2. Tambahkan Skill",
        description: "Masukkan skill yang bisa kamu ajarkan. Tulis level kemampuan, deskripsi singkat, dan jadwal tersedia. Makin spesifik, makin bagus.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
        color: "from-blue-500/20 to-transparent",
        icon: Zap,
        tags: ["Marketplace", "Skills"]
    },
    {
        id: 3,
        number: "03",
        title: "3. Jelajahi Marketplace",
        description: "Cari skill dari siswa lain. Bisa difilter berdasarkan kategori, level, atau topik tertentu. Temukan tutor yang cocok buat kamu.",
        image: "https://images.unsplash.com/photo-1552581234-2612b793393b?q=80&w=800&auto=format&fit=crop",
        color: "from-purple-500/20 to-transparent",
        icon: Search,
        tags: ["Search", "Filters"]
    },
    {
        id: 4,
        number: "04",
        title: "4. Booking Sesi",
        description: "Ajukan sesi ke tutor dengan pilih tanggal, waktu, durasi, serta mau online atau offline. Tutor akan approve, lalu sesi dijadwalkan.",
        image: "https://images.unsplash.com/photo-1506784919156-50b3e6486043?q=80&w=800&auto=format&fit=crop",
        color: "from-green-500/20 to-transparent",
        icon: Calendar,
        tags: ["Scheduling", "Sessions"]
    },
    {
        id: 5,
        number: "05",
        title: "5. Tukar Kredit Waktu",
        description: "Saat kamu mengajar, kamu dapat kredit. Saat belajar, kamu pakai kredit. Saldo tercatat otomatis. User baru mulai dengan 3 kredit gratis.",
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop",
        color: "from-yellow-500/20 to-transparent",
        icon: Coins,
        tags: ["Ledger", "Exchange"]
    },
    {
        id: 6,
        number: "06",
        title: "6. Beri Rating & Review",
        description: "Setelah sesi selesai, tutor dan siswa saling kasih rating dan review. Ini bantu bangun kepercayaan di komunitas.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba027788c0?q=80&w=800&auto=format&fit=crop",
        color: "from-red-500/20 to-transparent",
        icon: CheckCircle2,
        tags: ["Ratings", "Trust"]
    }
];

export default function ScrollFeatures() {
    const [activeCard, setActiveCard] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // useScroll based on the entire length of the component
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "start start"],
    });

    // Animate expansion across the entrance scroll
    const clipPath = useTransform(
        scrollYProgress,
        [0, 0.9],
        ["inset(25% 0 0 0 round 48px)", "inset(0% 0 0 0 round 48px)"]
    );

    // Text opacity: wait until image is fully expanded (0.9 -> 1)
    const textOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
    // Text Y position: slide up from below (50px -> 0)
    const textY = useTransform(scrollYProgress, [0.9, 1], [50, 0]);

    return (
        <div ref={containerRef} className="relative bg-transparent font-sans w-full">
            {/* Height set to accommodate length of scrolling content while image is pinned */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Left Column: Scrolling Text - Flows normally through the scrollable area */}
                    <motion.div style={{ opacity: textOpacity, y: textY }} className="w-full lg:w-1/2 flex flex-col">
                        {steps.map((step, index) => (
                            <FeatureText
                                key={step.id}
                                step={step}
                                index={index}
                                setActiveCard={setActiveCard}
                            />
                        ))}
                    </motion.div>

                    {/* Right Column: Sticky Image - Remains pinned until the end of the section */}
                    <div className="hidden lg:block w-full lg:w-1/2 relative">
                        <div className="sticky top-24 h-[calc(100vh-6rem)] flex items-center justify-center">
                            <motion.div
                                style={{ clipPath }}
                                className="relative w-full max-w-2xl aspect-square bg-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10"
                            >
                                <AnimatePresence mode="wait">
                                    {steps.map((step, index) => index === activeCard && (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="absolute inset-0 w-full h-full bg-zinc-950"
                                        >
                                            <div className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-40 mix-blend-overlay`} />
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                fill
                                                className="object-cover opacity-90 transition-opacity duration-300"
                                            />
                                            {/* Glow Overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

                                            {/* Large Icon Overlay */}
                                            <div className="absolute bottom-12 right-12 w-24 h-24 bg-orange-600/30 backdrop-blur-3xl border border-orange-500/40 rounded-4xl flex items-center justify-center shadow-3xl">
                                                <step.icon className="w-12 h-12 text-orange-500" />
                                            </div>

                                            {/* Tag in Image */}
                                            <div className="absolute top-12 left-12 px-6 py-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                                <span className="text-[10px] font-black tracking-widest text-white/90">Step {step.number}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureText({ step, index, setActiveCard }: { step: any, index: number, setActiveCard: (i: number) => void }) {
    const ref = useRef(null);
    // Intersection detection to switch images
    const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

    useEffect(() => {
        if (isInView) {
            setActiveCard(index);
        }
    }, [isInView, index, setActiveCard]);

    return (
        <div ref={ref} className="min-h-screen flex flex-col justify-center py-20 pr-0 lg:pr-16">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: false, margin: "-30%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <h3 className="text-4xl md:text-6xl font-black text-white mb-8 bg-linear-to-r from-white to-zinc-500 bg-clip-text tracking-tighter leading-none">
                    {step.title.split(". ")[1]}
                </h3>

                <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-xl mb-12">
                    {step.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                    {step.tags.map((tag: string) => (
                        <span key={tag} className="px-6 py-2.5 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-[10px] font-black tracking-[0.2em] text-zinc-400 hover:text-orange-500 hover:border-orange-500/30 transition-all cursor-default">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Mobile Image: Only visible on smaller screens */}
                <div className="block lg:hidden w-full relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
                    <div className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-40 mix-blend-overlay z-10`} />
                    <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10" />
                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-orange-600/30 backdrop-blur-3xl border border-orange-500/40 rounded-3xl flex items-center justify-center z-20 shadow-2xl">
                        <step.icon className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
