"use client";

import { useEffect, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from 'next/link';
import AccordionTeam from "@/components/marketing/about/AccordionTeam";
import ImpactStats from "@/components/marketing/about/ImpactStats";
import CtaFaqSection from "@/components/marketing/about/CtaFaqSection";

// ── DATA ─────────────────────────────────────────────────────────────────────



const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const VALUES = [
  {
    title: "Semangat Berbagi",
    desc: "Kami percaya ilmu tumbuh ketika disebarkan. Setiap mentor di Wibi hadir karena dorongan tulus untuk menginspirasi.",
  },
  {
    title: "Tumbuh Bersama",
    desc: "Belajar bukan kompetisi. Kami menciptakan ruang aman di mana setiap langkah kecil dihargai dan dirayakan.",
  },
  {
    title: "Relevan & Aplikatif",
    desc: "Materi yang kami hadirkan bukan sekadar teori — dirancang langsung bisa diterapkan di kehidupan nyata.",
  },
  {
    title: "Inklusif & Merata",
    desc: "Dari Sabang sampai Merauke, Wibi hadir untuk semua — tanpa batas geografis maupun ekonomi.",
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

function ValueCard({ icon, title, desc, index }: { icon?: string, title: string, desc: string, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(ref);
  return (
    <div
      ref={ref}
      className={`group p-8 rounded-3xl border border-stone-800 bg-stone-900 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-default ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {icon && (
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-stone-400 leading-relaxed text-sm">{desc}</p>
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

      <main className={`bg-black overflow-x-hidden text-stone-200 ${plusJakartaSans.className}`}>

        {/* ── HERO (sticky) ────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden noise pt-24"
          style={{
            background: "linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #292524 100%)",
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
            style={{ background: "radial-gradient(circle, #fbbf24, transparent 70%)" }}
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
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white mb-6 leading-none tracking-tight">
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

            <p className="text-stone-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
              Kami hadir untuk menghubungkan para pelajar dengan mentor terbaik di seluruh Indonesia —
              satu ilmu, satu langkah, satu waktu.
            </p>

            {/* Scroll indicator */}
            <div className="mt-6 flex flex-col items-center gap-2 text-stone-500">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-stone-500 to-transparent animate-pulse" />
            </div>
          </div>
        </section>

        {/* ── CONTENT WRAPPER (covers hero on scroll) ──────────────────── */}
        <div className="relative z-10 bg-black">

          {/* ── MARQUEE DIVIDER ──────────────────────────────────────────── */}
          <div className="bg-primary py-4 overflow-hidden border-y-4 border-orange-900/50">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="text-black font-black text-lg mx-8 uppercase tracking-widest">
                  Berbagi Ilmu ✦ Tumbuh Bersama ✦ Belajar Tanpa Batas ✦
                </span>
              ))}
            </div>
          </div>

          {/* ── VISI & MISI ────────────────────────────────────────────── */}
          <section className="bg-black py-32 px-6">
            <div
              ref={visiRef}
              className={`max-w-6xl mx-auto transition-all duration-700 ${
                visiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Left: Visual */}
                <div className="relative">
                  <div className="aspect-square rounded-3xl overflow-hidden relative border border-stone-800">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop')" }}
                    />
                    {/* Blur Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-12">
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
                  <div className="absolute -bottom-6 -right-6 bg-stone-900 border border-stone-800 text-white rounded-2xl px-6 py-4 shadow-2xl">
                    <div className="text-3xl font-black text-primary">Tukar Ilmu</div>
                    <div className="text-xs text-stone-400 uppercase tracking-widest">Dengan Ilmu</div>
                  </div>
                </div>

                {/* Right: Text */}
                <div>
                  <span className="text-primary text-sm font-bold uppercase tracking-widest">Visi & Misi</span>
                  <h2 className="text-5xl font-black text-white mt-3 mb-8 leading-tight">
                    Kami Ada<br />
                    <span className="text-primary">Untuk Apa?</span>
                  </h2>

                  <div className="space-y-8">
                    <div className="border-l-4 border-primary pl-6">
                      <h3 className="text-lg font-bold text-white mb-2"> Visi</h3>
                      <p className="text-stone-400 leading-relaxed">
                        Menjadi platform edukasi terdepan yang memberdayakan setiap individu Indonesia
                        untuk terus belajar, berbagi, dan berkembang tanpa batas waktu dan tempat.
                      </p>
                    </div>
                    <div className="border-l-4 border-amber-600 pl-6">
                      <h3 className="text-lg font-bold text-white mb-2"> Misi</h3>
                      <ul className="text-stone-400 leading-relaxed space-y-2">
                        <li className="flex gap-2"><span className="text-primary">→</span> Menghubungkan pelajar dengan mentor berkualitas di seluruh Indonesia</li>
                        <li className="flex gap-2"><span className="text-primary">→</span> Menghadirkan konten belajar yang relevan, praktis, dan mudah diakses</li>
                        <li className="flex gap-2"><span className="text-primary">→</span> Membangun komunitas belajar yang inklusif dan suportif</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS ─────────────────────────────────────────────────── */}
          <ImpactStats />

          {/* ── VALUES ────────────────────────────────────────────────── */}
          <section className="bg-black py-32 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-primary text-sm font-bold uppercase tracking-widest">Core Values</span>
                <h2 className="text-5xl font-black text-white mt-3">
                  Nilai yang Kami<br />
                  <span className="text-primary">Junjung Tinggi</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

