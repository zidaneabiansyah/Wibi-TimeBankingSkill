import type { Metadata } from 'next';
import { Footer, Header } from "@/components/layout";
import { HeroSection, HowItWorksSection, FeaturedSkillsSection, CTASection, PrinciplesSection } from "@/components/marketing/landing";

export const metadata: Metadata = {
  title: 'Wibi - Waktu Indonesia Berbagi Ilmu | Time Banking Skill Exchange',
  description: 'Platform peer-to-peer skill exchange untuk pelajar. Belajar dan ajarkan skill tanpa uang, hanya dengan waktu. Join 1,200+ students exchanging skills.',
  keywords: ['time banking', 'skill exchange', 'peer learning', 'student community', 'free education', 'skill sharing'],
  openGraph: {
    title: 'Wibi - Your Time Is Valuable',
    description: 'Exchange skills with peers using time as currency. No money, just knowledge sharing.',
    type: 'website',
    images: ['/wibi.png'],
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <FeaturedSkillsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
