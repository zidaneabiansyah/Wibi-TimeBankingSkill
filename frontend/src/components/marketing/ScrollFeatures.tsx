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
        title: "1. Node Activation",
        description: "Initialize your digital presence. Define your areas of expertise and your learning objectives to jumpstart your engine.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
        color: "from-orange-500/20 to-transparent",
        icon: UserCircle2,
        tags: ["Onboarding", "Profile"]
    },
    {
        id: 2,
        number: "02",
        title: "2. Skill Transmission",
        description: "Broadcast your wisdom to the network. List the skills you're ready to teach the community and set your availability nodes.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
        color: "from-blue-500/20 to-transparent",
        icon: Zap,
        tags: ["Marketplace", "Skills"]
    },
    {
        id: 3,
        number: "03",
        title: "3. Discovery Protocol",
        description: "Navigate the marketplace. Find experts who possess the knowledge you seek using our hyper-speed filtering systems.",
        image: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=800&auto=format&fit=crop",
        color: "from-purple-500/20 to-transparent",
        icon: Search,
        tags: ["Search", "Filters"]
    },
    {
        id: 4,
        number: "04",
        title: "4. Secure Booking",
        description: "Initialize an exchange. Schedule sessions directly through our encrypted protocol and await confirmation nodes.",
        image: "https://images.unsplash.com/photo-1506784919156-50b3e6486043?q=80&w=800&auto=format&fit=crop",
        color: "from-green-500/20 to-transparent",
        icon: Calendar,
        tags: ["Scheduling", "Sessions"]
    },
    {
        id: 5,
        number: "05",
        title: "5. Credit Mining",
        description: "Earn and spend time credits. 1 Hour = 1 Credit. No fiat currency, just pure value exchange in the wibi ledger.",
        image: "https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=800&auto=format&fit=crop",
        color: "from-yellow-500/20 to-transparent",
        icon: Coins,
        tags: ["Ledger", "Exchange"]
    },
    {
        id: 6,
        number: "06",
        title: "6. Community Consensus",
        description: "Verify quality through ratings. Build your reputation index and climb the community leaderboards.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
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
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 w-full h-full bg-zinc-950"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-40 mix-blend-overlay`} />
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                fill
                                                className="object-cover opacity-60"
                                                priority
                                            />
                                            {/* Glow Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                            {/* Large Icon Overlay */}
                                            <div className="absolute bottom-12 right-12 w-24 h-24 bg-orange-600/30 backdrop-blur-3xl border border-orange-500/40 rounded-[2rem] flex items-center justify-center shadow-3xl">
                                                <step.icon className="w-12 h-12 text-orange-500" />
                                            </div>

                                            {/* Tag in Image */}
                                            <div className="absolute top-12 left-12 px-6 py-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/90">Step {step.number}</span>
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
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <h3 className="text-4xl md:text-6xl font-black text-white mb-8 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase italic tracking-tighter leading-none">
                    {step.title.split(". ")[1]}
                </h3>

                <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-xl mb-12">
                    {step.description}
                </p>

                <div className="flex flex-wrap gap-3">
                    {step.tags.map((tag: string) => (
                        <span key={tag} className="px-6 py-2.5 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-orange-500 hover:border-orange-500/30 transition-all cursor-default">
                            #{tag}
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
