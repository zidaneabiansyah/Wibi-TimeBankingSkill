"use client";

import { useEffect, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from 'next/link';
import AccordionTeam from "@/components/marketing/about/AccordionTeam";
import ImpactStats from "@/components/marketing/about/ImpactStats";
import CtaFaqSection from "@/components/marketing/about/CtaFaqSection";
import { Sparkles, HeartHandshake, Globe } from "lucide-react";

// ── DATA ─────────────────────────────────────────────────────────────────────



const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const VALUES = [
  {
    title: "Semangat Berbagi",
    desc: "Kami percaya ilmu tumbuh saat dibagikan. Setiap mentor di Wibi hadir untuk saling menginspirasi.",
    icon: <HeartHandshake className="h-5 w-5" />,
    gradient: "from-emerald-500/30 via-emerald-400/10 to-transparent",
    pattern: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]"
  },
  {
    title: "Tumbuh Bersama",
    desc: "Belajar bukan soal kompetisi. Kami menciptakan ruang aman di mana setiap progres dihargai.",
    icon: <Sparkles className="h-5 w-5" />,
    gradient: "from-primary/30 via-orange-400/10 to-transparent",
    pattern: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]"
  },
  {
    title: "Inklusif & Bermakna",
    desc: "Wibi terbuka untuk semua tanpa batas geografis atau ekonomi, dengan materi yang relevan untuk kehidupan nyata.",
    icon: <Globe className="h-5 w-5" />,
    gradient: "from-rose-500/30 via-pink-400/10 to-transparent",
    pattern: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
  },
];



// ── HOOK: useScrollProgress ───────────────────────────────────────────────────
function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function ValueCard({ icon, title, desc, gradient, pattern, index }: { icon?: React.ReactNode, title: string, desc: string, gradient: string, pattern: string, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(ref);
  return (
    <div
      ref={ref}
      className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card/20 hover:border-border/80 hover:bg-card/40 transition-all duration-500 cursor-default shadow-2xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Decorative Top Area */}
      <div className={`h-40 w-full relative overflow-hidden ${pattern} ${gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-700`}>
        {/* Glass overlay layer for the wave aesthetic */}
        <div className="absolute inset-0 bg-white/2 backdrop-blur-[2px]" />

        {/* Subtle mesh lines */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />

        {/* Gradient fade into the background */}
        <div className="absolute -bottom-2 left-0 right-0 h-24 bg-linear-to-t from-background group-hover:from-card/40 to-transparent z-10 transition-colors duration-500" />
      </div>

      {/* Card Content Area */}
      <div className="px-8 pb-8 flex flex-col relative z-20 flex-1">
        {/* Icon */}
        <div className="mb-6 -mt-8 flex justify-start">
          <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground shadow-xl group-hover:scale-110 transition-transform duration-500 group-hover:border-primary group-hover:text-primary z-20">
            {icon}
          </div>
        </div>

        {/* Texts */}
        <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight leading-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-[15px]">{desc}</p>
      </div>
    </div>
  );
}


// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Smooth scroll setup for lenis or similar (optional, here we rely on CSS smooth)
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero parallax scale + opacity as next section covers it
  // More aggressive zoom out: Start at 1, scale down to 0.6 faster
  const heroScale = Math.max(0.6, 1 - scrollY * 0.0008);
  const heroOpacity = Math.max(0, 1 - scrollY * 0.002);

  const statsRef = useRef<HTMLDivElement>(null);
  const statsVisible = useScrollReveal(statsRef);

  const visiRef = useRef<HTMLDivElement>(null);
  const visiVisible = useScrollReveal(visiRef);

  return (
    <>
      {/* Global Animations & Textures */}
      <style jsx global>{`

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 9s ease-in-out infinite reverse; }
        .animate-marquee { animation: marquee 20s linear infinite; }

        /* Noise texture overlay */
        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <main className={`bg-background overflow-x-hidden text-foreground ${plusJakartaSans.className}`}>

        {/* ── HERO (sticky) ────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden noise pt-24"
          style={{
            background: "linear-gradient(135deg, var(--background) 0%, var(--card) 50%, var(--background) 100%)",
            zIndex: 0,
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-20 animate-float"
            style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
          />
          <div
            className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full opacity-15 animate-float-slow"
            style={{ background: "radial-gradient(circle, var(--color-orange-400, oklch(0.7 0.2 45)), transparent 70%)" }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Content */}
          <div
            className="relative z-10 text-center px-6 max-w-5xl mx-auto"
            style={{ transform: `scale(${heroScale})`, opacity: heroOpacity }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-3 leading-none tracking-tight">
              Waktu{" "}
              <span
                className="relative inline-block"
                style={{ WebkitTextStroke: "2px var(--primary)", color: "transparent" }}
              >
                Indonesia
              </span>
              <br />
              <span className="text-primary">Berbagi</span> Ilmu
            </h1>

            <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
              Kami hadir untuk menghubungkan para pelajar dengan mentor terbaik di seluruh Indonesia —
              satu ilmu, satu langkah, satu waktu.
            </p>

            {/* Scroll indicator */}
            <div className="mt-6 flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <div className="w-px h-12 bg-linear-to-b from-primary to-transparent animate-pulse" />
            </div>
          </div>
        </section>

        {/* ── CONTENT WRAPPER (covers hero on scroll) ──────────────────── */}
        <div className="relative z-10 bg-background">

          {/* ── MARQUEE DIVIDER ──────────────────────────────────────────── */}
          <div className="bg-primary py-4 overflow-hidden border-y-4 border-orange-500/30">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="text-black font-black text-lg mx-8 uppercase tracking-widest">
                  Berbagi Ilmu ✦ Tumbuh Bersama ✦ Belajar Tanpa Batas ✦
                </span>
              ))}
            </div>
          </div>

          {/* ── VISI & MISI ────────────────────────────────────────────── */}
          <section className="bg-background py-32 px-6">
            <div
              ref={visiRef}
              className={`max-w-6xl mx-auto transition-all duration-700 ${visiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Left: Visual */}
                <div className="relative">
                  <div className="aspect-square rounded-3xl overflow-hidden relative border border-border">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')" }}
                    />
                    {/* Blur Overlay */}
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[6px]" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-foreground p-12">
                        <div className="text-8xl font-black opacity-20 absolute top-8 left-8 mix-blend-overlay">W</div>
                        <div className="text-8xl font-black opacity-20 absolute bottom-8 right-8 mix-blend-overlay">I</div>
                        <div className="relative z-10">
                          <p className="text-3xl font-bold italic leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                            "Ilmu yang dibagi,<br />tak pernah berkurang"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -right-6 bg-card border border-border text-foreground rounded-2xl px-6 py-4 shadow-2xl">
                    <div className="text-3xl font-black text-primary">Tukar Ilmu</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Dengan Ilmu</div>
                  </div>
                </div>

                {/* Right: Text */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8 leading-tight">
                    Membuat Pendidikan Lebih Terjangkau untuk <span className="text-primary">Semua</span>
                  </h2>

                  <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                    <p>
                      Kami memulai Wibi dari satu ide sederhana: bagaimana kalau siswa bisa saling membantu belajar tanpa terhalang uang? Time Banking mewujudkannya dengan menghargai waktu setiap orang secara setara.
                    </p>
                    <p>
                      Entah kamu jago matematika, bisa banyak bahasa, atau bisa ngajarin gitar, skill kamu tetap punya nilai. Dan selalu ada orang lain yang bisa ngajarin kamu hal baru sebagai gantinya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS ─────────────────────────────────────────────────── */}
          <ImpactStats />

          {/* ── VALUES ────────────────────────────────────────────────── */}
          <section className="bg-background py-32 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-primary text-sm font-bold uppercase tracking-widest">Core Values</span>
                <h2 className="text-5xl font-black text-foreground mt-3">
                  Nilai yang Kami<br />
                  <span className="text-primary">Junjung Tinggi</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VALUES.map((v, i) => (
                  <ValueCard key={i} {...v} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* ── TEAM ──────────────────────────────────────────────────── */}
          <AccordionTeam />


          {/* ── CTA ───────────────────────────────────────────────────── */}
          {/* ── CTA + FAQ ─────────────────────────────────────────────── */}
          <CtaFaqSection />

        </div>{/* end content wrapper */}
      </main>
    </>
  );
}

