'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollFeatures from "@/components/marketing/ScrollFeatures";
import { PrinciplesSection } from "@/components/marketing/landing";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-['Plus_Jakarta_Sans'] overflow-x-clip">
      {/* Very Subtle Mesh linear Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#ff5500]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* --- Professional Premium Hero Section --- */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 sm:px-12 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
          {/* Professional Premium Background Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
            {/* 1. Subtle Architectural Image */}
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
              alt="High-end Architectural Glass"
              className="w-full h-full object-cover opacity-[0.12] mix-blend-luminosity grayscale contrast-125 scale-105"
            />

            {/* 2. SaaS Dotted Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.2]"
              style={{
                backgroundImage: `radial-linear(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-linear(ellipse at center, black, transparent 80%)'
              }}
            />

            {/* 3. Matte Noise Texture Overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />

            {/* 4. Soft Radial Focus Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] aspect-square bg-[#ff5500]/3 rounded-full blur-[160px]" />

            {/* 5. Seamless Fading linears */}
            <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-10" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 w-full flex flex-col items-center mt-10 md:mt-6">
            <motion.h1
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-[0.85] mb-8 text-white drop-shadow-2xl"
            >
              How It <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-[#ff5500] to-orange-600">Works.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl mx-auto text-zinc-300 text-lg md:text-xl font-medium leading-relaxed mb-12 drop-shadow-md"
            >
              Ubah waktumu jadi Time Banking—di mana 1 jam waktu = 1 kredit, bikin belajar jadi lebih bebas, tanpa uang, tanpa hambatan, dan sepenuhnya terdesentralisasi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Button
                onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg" className="h-14 px-8 bg-white hover:bg-zinc-200 text-black font-bold text-sm rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1"
              >
                Step by Step
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-14 px-8 border-white/20 bg-black/50 backdrop-blur-md text-white font-bold text-sm rounded-full hover:bg-white/10 transition-all hover:-translate-y-1"
              >
                View Faq
              </Button>
            </motion.div>
          </div>
        </section>

        <PrinciplesSection />

        {/* --- Interactive Scroll Workflow Section (Retained untouched as requested) --- */}
        <section id="workflow" className="relative z-10 py-32 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
            <motion.div
              className="text-center mb-32"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-foreground">Step-by-Step <span className="text-orange-500">Guide</span></h2>
              <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">Memulai Time Banking itu mudah. Ikuti langkah-langkah sederhana ini untuk mulai bertukar keahlian.</p>
            </motion.div>
          </div>

          <ScrollFeatures />
        </section>


        {/* --- Modern Cinematic CTA --- */}
        <section className="py-32 md:py-48 px-6 relative border-t border-zinc-900 bg-background overflow-hidden flex items-center justify-center min-h-[60vh]">
          <div className="max-w-4xl mx-auto text-center relative z-10 w-full flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-8 drop-shadow-2xl">
              Siap Bertukar<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">Waktu?</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Bergabunglah dengan komunitas kami hari ini dan mulailah bertukar keterampilan dengan orang lain.
            </p>
            <Button size="lg" className="group h-16 w-full sm:w-auto px-12 bg-foreground hover:bg-orange-600 text-background hover:text-white font-bold text-[15px] tracking-widest rounded-full transition-all flex items-center justify-center gap-3 mx-auto shadow-[0_0_40px_rgba(0,0,0,0.15)] hover:shadow-[0_0_60px_rgba(255,112,32,0.3)] hover:-translate-y-1">
              Daftar Sekarang!
              <span className="w-8 h-8 rounded-full bg-background text-foreground flex items-center justify-center group-hover:bg-white transition-colors">
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </span>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
