'use client';

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Clock,
  Heart,
  ArrowLeftRight,
  Zap,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTAButtons } from "@/components/marketing/CTAButtons";
import ScrollFeatures from "@/components/marketing/ScrollFeatures";

const principles = [
  {
    title: "Equality in Time",
    description: "Every hour is valued equally, regardless of the skillset. A truly democratic exchange.",
    icon: Clock,
    color: "from-orange-500/20 to-transparent",
    border: "border-orange-500/20"
  },
  {
    title: "Inherent Value",
    description: "Every member brings unique wisdom. We celebrate the diversity of human knowledge.",
    icon: Heart,
    color: "from-blue-500/20 to-transparent",
    border: "border-blue-500/20"
  },
  {
    title: "Pure Reciprocity",
    description: "Helping others directly fuels your own growth. A perfect cycle of mutual support.",
    icon: ArrowLeftRight,
    color: "from-purple-500/20 to-transparent",
    border: "border-purple-500/20"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* --- Hero Section --- */}
        <section className="pt-40 pb-24 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 mb-10"
            >
              <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-400">The Exchange Protocol</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent"
            >
              MASTER THE<br />
              <span className="text-orange-500 drop-shadow-[0_0_40px_rgba(249,115,22,0.4)]">EXCHANGE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed mb-14"
            >
              Wibi transforms time into a global ledger of wisdom.
              No money, no barriers—just pure decentralized learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Button size="lg" className="h-16 px-12 bg-orange-600 hover:bg-orange-500 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-600/20 transition-all hover:scale-110 active:scale-95">
                Initialize Profile
              </Button>
              <Button variant="outline" className="h-16 px-12 border-zinc-800 bg-transparent text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all">
                Protocol Stats
              </Button>
            </motion.div>
          </div>
        </section>

        {/* --- Principles Bento Grid --- */}
        <section className="py-32 px-6 sm:px-12 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-xl">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase italic leading-none">Core OS Principles</h2>
                <p className="text-zinc-500 text-lg font-medium">The foundational architecture that powers the Wibi ecosystem.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principles.map((p, i) => (
                <div key={i} className={`group relative p-12 rounded-[3rem] bg-zinc-900/30 border ${p.border} overflow-hidden transition-all duration-700 hover:bg-zinc-900 hover:-translate-y-4`}>
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${p.color} blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-black/60 border border-white/10 flex items-center justify-center mb-10 shadow-3xl group-hover:rotate-12 transition-transform duration-700">
                      <p.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight italic">{p.title}</h3>
                    <p className="text-zinc-500 text-base font-medium leading-relaxed">{p.description}</p>
                  </div>

                  <div className="absolute bottom-6 right-10 text-white/5 font-black text-8xl select-none group-hover:text-white/10 transition-colors duration-1000">
                    0{i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Interactive Scroll Workflow Section --- */}
        <section className="relative z-10 py-32 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
            <div className="text-center mb-32">
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 text-white italic underline decoration-orange-500/50 underline-offset-[12px] uppercase">The Workflow.</h2>
              <p className="text-zinc-500 font-mono text-[11px] uppercase tracking-[0.4em]">Sequential Protocol Implementation</p>
            </div>
          </div>

          <ScrollFeatures />
        </section>

        {/* --- FAQ Bento --- */}
        <section className="py-32 px-6 sm:px-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Sidebar Heading */}
              <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-32 h-fit">
                <div className="p-12 rounded-[3.5rem] bg-orange-600 text-black flex flex-col justify-between aspect-square lg:aspect-video xl:aspect-auto xl:h-[500px] shadow-2xl">
                  <TrendingUp className="w-16 h-16 xl:w-20 xl:h-20 mb-8" />
                  <div>
                    <h2 className="text-6xl xl:text-7xl font-black tracking-tight leading-[0.8] mb-6 uppercase italic">SYSTEM<br />QUERY.</h2>
                    <p className="font-bold text-lg leading-tight opacity-90">Common operational questions regarding the wibi protocol.</p>
                  </div>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="lg:col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { q: "How do I earn initial credits?", a: "New accounts are pre-loaded with 3 Genesis Credits. After depletion, services must be rendered to earn more." },
                  { q: "What if I have no skills?", a: "Value is subjective. From language practice to project feedback, everyone possesses tradable wisdom." },
                  { q: "Do credits expire?", a: "No. Credits are stored perpetually in your secure ledger until utilized for learning." },
                  { q: "Is the system virtual?", a: "Exchanges can be physical (in-person) or digital (video-link), defined during the booking protocol." },
                  { q: "Are ratings verified?", a: "Yes. All ratings are tied to completed sessions, ensuring a 100% authentic reputation index." },
                  { q: "How many skills?", a: "You can broadcast unlimited skills. We encourage multiple expertise nodes per user profile." }
                ].map((item, i) => (
                  <div key={i} className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-all group hover:bg-zinc-900">
                    <h3 className="text-white font-black text-lg uppercase tracking-tight mb-6 group-hover:text-orange-500 transition-colors italic leading-none">0{i + 1}. {item.q}</h3>
                    <p className="text-zinc-500 text-base font-medium leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-40 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-[4rem] bg-zinc-900 border border-zinc-800 p-16 md:p-32 text-center shadow-3xl">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

              <div className="relative z-10">
                <Star className="w-16 h-16 text-orange-500 mx-auto mb-10 animate-pulse" />
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent uppercase italic leading-none">
                  READY TO DEVIATE?
                </h2>
                <p className="max-w-xl mx-auto text-zinc-400 text-xl md:text-3xl font-medium mb-16 leading-tight">
                  The future of learning is circular. Join the revolution.
                </p>
                <CTAButtons />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
