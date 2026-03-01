"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: "Apa itu Wibi dan bagaimana cara kerjanya?",
    a: "Wibi adalah platform edukasi yang menghubungkan pelajar dengan mentor berpengalaman. Kamu bisa memilih kelas, belajar sesuai jadwalmu, dan berkonsultasi langsung dengan mentor."
  },
  {
    q: "Apakah Wibi gratis untuk digunakan?",
    a: "Pendaftaran di Wibi sepenuhnya gratis. Beberapa kelas premium tersedia dengan biaya terjangkau, namun banyak konten berkualitas yang bisa diakses tanpa biaya."
  },
  {
    q: "Bagaimana cara menjadi mentor di Wibi?",
    a: "Kamu bisa mendaftar sebagai mentor melalui halaman 'Jadi Mentor'. Tim kami akan melakukan review dan onboarding sebelum kamu mulai mengajar."
  },
  {
    q: "Apakah ada sertifikat setelah menyelesaikan kelas?",
    a: "Ya! Setiap pelajar yang menyelesaikan kelas akan mendapatkan sertifikat digital yang bisa diunduh dan dibagikan ke LinkedIn atau portofoliomu."
  },
  {
    q: "Di mana saja Wibi tersedia?",
    a: "Wibi tersedia secara online untuk seluruh Indonesia. Kamu bisa belajar dari mana saja dan kapan saja, cukup dengan koneksi internet."
  },
];

export default function CtaFaqSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section
      className="relative w-full py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--background), var(--card))" }}
    >
      {/* Background Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-12 items-start">

        {/* Left Column: CTA */}
        <div className="w-full lg:w-2/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-400/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Wibi
          </div>

          <h2 className="text-5xl font-black text-foreground leading-tight mb-2 tracking-tight">
            Punya pertanyaan?
          </h2>
          <p className="text-muted-foreground text-2xl font-light">
            Kami siap membantu.
          </p>

          <div className="bg-card/50 border border-border rounded-2xl p-8 mt-8 backdrop-blur-sm shadow-2xl">
            <h3 className="text-foreground font-bold text-xl mb-3">
              Belum menemukan jawaban?
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Kirim pertanyaanmu langsung dan tim kami akan membalas sesegera mungkin.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-xl mt-6 transition-all shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5"
            >
              Hubungi Kami →
            </Link>
          </div>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="w-full lg:w-3/5">
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-2xl overflow-hidden bg-card/5 backdrop-blur-sm transition-colors hover:bg-card/10"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-foreground font-medium text-base pr-4">
                      {faq.q}
                    </span>
                    <div
                      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted transition-transform duration-300 ${isOpen ? "rotate-180 bg-orange-500/20 text-orange-400" : "text-muted-foreground"}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                    <div className="px-6 pb-6 pt-2 text-muted-foreground text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
