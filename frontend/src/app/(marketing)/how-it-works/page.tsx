'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollFeatures from "@/components/marketing/ScrollFeatures";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans overflow-x-clip">
      {/* Very Subtle Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#ff5500]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* --- Modern Elegant Hero Section --- */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 sm:px-12 flex flex-col items-center justify-center min-h-[65vh] relative overflow-hidden">
          {/* Cinematic Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
               src="https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2564&auto=format&fit=crop" 
               alt="Dark Modern Abstract Pattern" 
               className="w-full h-full object-cover opacity-30 mix-blend-screen"
            />
            {/* Seamless fading gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 w-full flex flex-col items-center mt-10 md:mt-6">
            <motion.h1
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[4rem] sm:text-[5.5rem] md:text-[7.5rem] font-bold tracking-tighter leading-[0.85] mb-8 text-white drop-shadow-2xl"
            >
              Master the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-[#ff5500] to-orange-600">Exchange.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl mx-auto text-zinc-300 text-lg md:text-xl font-medium leading-relaxed mb-12 drop-shadow-md"
            >
              Transform your time into a global ledger of wisdom. No money, no barriers—just decentralized learning in its purest form.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Button size="lg" className="h-14 px-8 bg-white hover:bg-zinc-200 text-black font-bold text-sm rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1">
                Initialize Profile
              </Button>
              <Button variant="outline" className="h-14 px-8 border-white/20 bg-black/50 backdrop-blur-md text-white font-bold text-sm rounded-full hover:bg-white/10 transition-all hover:-translate-y-1">
                View Network Stats
              </Button>
            </motion.div>
          </div>
        </section>

        {/* --- Core OS Principles (Restored Asymmetrical Bento Grid) --- */}
        <section className="py-24 md:py-32 relative border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
            <div className="mb-20">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.9] mb-6">
                Core OS<br />
                <span className="text-zinc-600">Principles</span>
              </h2>
              <div className="w-12 h-1 bg-[#ff5500] mb-6" />
              <p className="text-zinc-400 text-lg max-w-xl font-medium leading-relaxed">
                The foundational architecture that powers the Wibi ecosystem. A departure from generic fiat-based systems.
              </p>
            </div>

            {/* Asymmetrical Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Item 1: Large Span */}
              <div className="md:col-span-12 lg:col-span-8 group relative p-10 md:p-16 rounded-[40px] bg-zinc-950/50 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-700 hover:bg-zinc-900 shadow-2xl">
                <div className="absolute top-0 right-0 p-8 text-[12rem] font-black leading-none text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-700 pointer-events-none select-none italic -mr-8 -mt-12">
                  01
                </div>
                <div className="relative z-10 w-full h-full flex flex-col justify-end">
                  <div className="mb-auto">
                     <span className="inline-block px-4 py-1.5 rounded-full border border-[#ff5500]/20 bg-[#ff5500]/10 text-[#ff5500] text-xs font-bold tracking-widest uppercase mb-12">
                       Axiom I
                     </span>
                  </div>
                  <div>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase italic">Equality in Time</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md font-medium">
                      Every hour is valued equally, regardless of the skillset. A truly democratic exchange of human capital designed for modern resilience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 2: Vertical Stack */}
              <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="flex-1 group relative p-10 rounded-[32px] bg-zinc-950/50 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-700 hover:bg-zinc-900 shadow-xl">
                  <div className="absolute top-0 right-0 p-6 text-[8rem] font-black leading-none text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-700 pointer-events-none select-none italic -mr-4 -mt-6">
                    02
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <span className="inline-block px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase self-start mb-8">
                      Axiom II
                    </span>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3 uppercase italic">Inherent Value</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                        Every member brings unique wisdom. We celebrate diversity and the richness of human knowledge.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 group relative p-10 rounded-[32px] bg-zinc-950/50 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-700 hover:bg-zinc-900 shadow-xl">
                  <div className="absolute top-0 right-0 p-6 text-[8rem] font-black leading-none text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-700 pointer-events-none select-none italic -mr-4 -mt-6">
                    03
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <span className="inline-block px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-[10px] font-bold tracking-widest uppercase self-start mb-8">
                       Axiom III
                    </span>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3 uppercase italic">Pure Reciprocity</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                        Helping others directly fuels your own growth. A perfect, closed-loop cycle of perpetual giving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Interactive Scroll Workflow Section (Retained untouched as requested) --- */}
        <section className="relative z-10 py-32 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
            <div className="text-center mb-32">
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 text-white italic underline decoration-orange-500/50 underline-offset-[12px] uppercase">The Workflow.</h2>
              <p className="text-zinc-500 font-mono text-[11px] uppercase tracking-[0.4em]">Sequential Protocol Implementation</p>
            </div>
          </div>

          <ScrollFeatures />
        </section>

        {/* --- Minimalist Flat FAQ --- */}
        <section className="py-24 md:py-32 px-6 sm:px-12 relative border-t border-zinc-900 bg-[#060606]">
          <div className="max-w-4xl mx-auto relative z-10 w-full">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase italic mb-6">
                SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">QUERY.</span>
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                 Critical operations and knowledge-base regarding the Wibi decentralized time-banking architecture.
              </p>
            </div>

            <div className="flex flex-col gap-4">
               {[
                { q: "How do I earn initial credits?", a: "New accounts are pre-loaded with 3 Genesis Credits. After depletion, services must be rendered to earn more." },
                { q: "What if I have no skills?", a: "Value is subjective. From language practice to project feedback, everyone possesses tradable wisdom." },
                { q: "Do credits expire?", a: "No. Credits are stored perpetually in your secure ledger until utilized for learning." },
                { q: "Is the system virtual?", a: "Exchanges can be physical (in-person) or digital (video-link), defined during the booking protocol." },
                { q: "Are ratings verified?", a: "Yes. All ratings are tied to completed sessions, ensuring a 100% authentic reputation index." }
              ].map((item, i) => (
                <div key={i} className="group flex flex-col sm:flex-row gap-6 p-8 md:p-10 rounded-3xl bg-[#0d0d0d] border border-white/[0.03] hover:border-white/10 transition-all duration-300">
                  <span className="text-zinc-600 font-bold text-xl md:text-2xl font-mono pt-1 shrink-0 group-hover:text-orange-500 transition-colors">
                    0{i+1}.
                  </span>
                  <div>
                    <h3 className="text-white font-bold text-xl md:text-2xl mb-4 leading-tight group-hover:text-zinc-200">{item.q}</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Modern Cinematic CTA --- */}
        <section className="py-32 md:py-48 px-6 relative border-t border-zinc-900 bg-black overflow-hidden flex items-center justify-center min-h-[60vh]">
          {/* Background Image for CTA */}
          <div className="absolute inset-0 z-0 pointer-events-none">
             <img 
               src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2564&auto=format&fit=crop" 
               alt="Dark Tech Abstract Background" 
               className="w-full h-full object-cover opacity-15 mix-blend-screen"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
             <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-transparent" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
            <h2 className="text-5xl md:text-[6rem] font-black tracking-tighter text-white mb-8 drop-shadow-2xl uppercase italic">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-[#ff5500]">Deviate?</span>
            </h2>
            <p className="text-zinc-300 text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Step away from the traditional legacy market and start exchanging pure wisdom today. The decentralized future awaits.
            </p>
            <Button size="lg" className="group h-16 w-full sm:w-auto px-12 bg-white hover:bg-zinc-200 text-black font-black text-[15px] uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-3 mx-auto shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:-translate-y-1">
              Initialize Sequence 
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[#ff5500] transition-colors">
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </span>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
