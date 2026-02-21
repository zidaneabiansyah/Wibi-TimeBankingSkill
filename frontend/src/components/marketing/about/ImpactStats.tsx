"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 12000, suffix: "+", desc: "Pelajar aktif yang telah merasakan manfaat belajar di Wibi" },
  { value: 0, prefix: "Rp ", desc: "Biaya pendaftaran — belajar gratis untuk semua kalangan" },
  { value: 100, suffix: "+", desc: "Mentor berpengalaman dari berbagai industri siap membimbing" },
  { value: 15, suffix: "+", desc: "Bidang ilmu tersedia mulai dari teknologi hingga seni budaya" },
];

function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect(); // only animate once
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function AnimatedNumber({ value, prefix = "", suffix = "", isVisible }: { value: number, prefix?: string, suffix?: string, isVisible: boolean }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCurrentValue(Math.floor(easeOut * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentValue(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, isVisible]);

  return (
    <span>
      {prefix}{currentValue.toLocaleString('id-ID')}{suffix}
    </span>
  );
}

export default function ImpactStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const visible = useScrollReveal(sectionRef);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 px-6 border-y border-stone-800"
      style={{ background: "linear-gradient(135deg, #0c0a09, #1c1917)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Top: Editorial Paragraph */}
        <div 
          className={`space-y-6 transition-all duration-1000 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">
            — Dampak Nyata
          </p>
          
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-light leading-[1.3] text-stone-200">
            Wibi adalah platform edukasi yang membantu para pelajar{" "}
            <em className="font-semibold italic text-stone-100" style={{ fontFamily: "serif" }}>
              menemukan mentor
            </em>
            ,{" "}
            <em className="font-semibold italic text-stone-100" style={{ fontFamily: "serif" }}>
              mengembangkan skill
            </em>
            , dan{" "}
            <em className="font-semibold italic text-stone-100" style={{ fontFamily: "serif" }}>
              meraih potensi
            </em>{" "}
            terbaik mereka.
          </h2>
        </div>

        {/* Bottom: Stats Row */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-y-12 transition-all duration-1000 delay-300 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={`flex flex-col ${
                idx !== 0 ? "md:border-l md:border-stone-800 md:pl-8" : ""
              } ${
                idx % 2 !== 0 ? "border-l border-stone-800 pl-4 md:pl-8" : "pr-4 md:pr-0" // Mobile 2-col handling
              }`}
            >
              <div className="text-4xl md:text-5xl font-black text-primary mb-3 font-mono tracking-tighter">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} isVisible={visible} />
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-[150px]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
