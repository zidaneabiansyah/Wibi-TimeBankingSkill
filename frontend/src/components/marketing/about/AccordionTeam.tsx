"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  img: string;
}

const team: TeamMember[] = [
  {
    name: "Zidane Abiansyah",
    role: "Founder & CEO",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Adrian Maulana",
    role: "Co-Founder & COO",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Bayu Setia Bakti",
    role: "Head of Learning",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Muhammad Rajib",
    role: "Community Manager",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop"
  },
];

export default function AccordionTeam() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="bg-background py-24 px-6 border-y border-border">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

        {/* Left Side: Text Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-widest">
            Tim Kami
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-foreground leading-tight tracking-tight">
            Kenali Orang-orang<br />di Balik <span className="text-orange-500">Wibi</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            Digerakkan oleh passion, dipandu oleh misi yang sama — membuat ilmu bisa diakses oleh
            siapapun tanpa terhalang biaya. Bergabunglah dengan kami untuk menciptakan dampak nyata.
          </p>
        </div>

        {/* Right Side: Accordion Cards */}
        <div
          className="flex-1 w-full flex h-[480px] gap-4"
          onMouseLeave={() => setActiveIndex(0)}
        >
          {team.map((member, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group transform-gpu will-change-[flex,transform]"
                style={{
                  flex: isActive ? 3.5 : 1,
                  transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)" // smoother transition curve
                }}
              >
                {/* Background Image using Next.js Image for better performance */}
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-in-out transform-gpu"
                  style={{
                    transform: isActive ? "scale(1.05) translateZ(0)" : "scale(1) translateZ(0)",
                  }}
                  priority={idx === 0}
                />

                {/* Dark Overlay for inactive state */}
                <div
                  className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${isActive ? "opacity-0" : "opacity-100"
                    }`}
                />

                {/* Bottom Gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* Vertical Text (Inactive) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100 delay-200"
                      }`}
                  >
                    <span
                      className="text-white font-bold whitespace-nowrap tracking-wider text-lg"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {member.name}
                    </span>
                  </div>

                  {/* Horizontal Info (Active) */}
                  <div
                    className={`transition-all duration-500 transform ${isActive ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-8 pointer-events-none"
                      }`}
                  >
                    <div className="w-8 h-1 bg-primary mb-4 rounded-full" />
                    <h3 className="text-2xl font-black text-white mb-1 shadow-black drop-shadow-lg">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
