'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { m } from "framer-motion";
import { Zap, BookOpen, TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import { Footer, Header } from "@/components/layout";
import dynamic from 'next/dynamic';
import { useAuthStore } from "@/stores/auth.store";

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />
  }
);

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header/Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />
        <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top_right,var(--tw-linear-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-linear(ellipse_at_bottom_left,var(--tw-linear-stops))] from-secondary/5 via-transparent to-transparent opacity-40" />
        
        <m.div 
          className="relative mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <m.div className="space-y-8" variants={fadeInUp}>
              <div className="space-y-6">
                <m.div variants={fadeInUp}>
                  <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-primary/30 text-primary bg-primary/5 w-fit">
                    🎓 Welcome to Wibi
                  </Badge>
                </m.div>

                <m.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
                  variants={fadeInUp}
                >
                  <span className="text-foreground">Your Time Is</span>
                  <br />
                  <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse-slow">
                    Valuable
                  </span>
                </m.h1>

                <m.p 
                  className="max-w-[640px] text-lg text-muted-foreground leading-relaxed"
                  variants={fadeInUp}
                >
                  Platform peer-to-peer skill exchange untuk pelajar. Belajar dan ajarkan skill tanpa uang, hanya dengan waktu. Bergabunglah dengan komunitas kami.
                </m.p>
              </div>

              <m.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={fadeInUp}
              >
                <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8 font-semibold flex items-center gap-2">
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/marketplace" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-semibold">
                    Explore Skills
                  </Button>
                </Link>
              </m.div>

              {/* Trust Indicators */}
              <m.div 
                className="flex flex-col sm:flex-row gap-6 pt-4 text-sm text-muted-foreground"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span>1,200+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                    <Zap className="h-4 w-4 text-secondary" />
                  </div>
                  <span>15K+ Hours Exchanged</span>
                </div>
              </m.div>
            </m.div>

            {/* Right - Hero Image */}
            <m.div 
              className="flex items-center justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative w-full max-w-[600px] aspect-square">
                <DotLottieReact
                  src="/Learning.json"
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </div>
            </m.div>
          </div>
        </m.div>
      </section>

      {/* How It Works */}
      <section className="relative w-full py-16 md:py-24 lg:py-28 border-t border-border/40">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <m.div 
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <m.div variants={fadeInUp}>
              <Badge className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                How It Works
              </Badge>
            </m.div>
            <m.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              Time Banking Made Simple
            </m.h2>
            <m.p 
              className="max-w-[700px] text-muted-foreground text-lg"
              variants={fadeInUp}
            >
              1 hour teaching = 1 Time Credit = 1 hour learning. No money involved, pure skill exchange.
            </m.p>
          </m.div>

          <m.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                step: "1",
                title: "List Your Skills",
                description: "Create your profile and showcase skills you can teach. Set your availability and teaching style.",
                icon: BookOpen,
                color: "from-primary/20 to-primary/5"
              },
              {
                step: "2",
                title: "Book Sessions",
                description: "Browse marketplace and book sessions with experienced tutors. Choose time that fits your schedule.",
                icon: Zap,
                color: "from-secondary/20 to-secondary/5"
              },
              {
                step: "3",
                title: "Earn & Learn",
                description: "Earn time credits by teaching. Spend them to learn from other skilled tutors in our community.",
                icon: TrendingUp,
                color: "from-accent/20 to-accent/5"
              },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <m.div key={idx} variants={fadeInUp}>
                  <Card className="relative h-full flex flex-col overflow-hidden group hover:border-primary transition-all duration-300">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <CardHeader className="relative pb-4 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-primary mb-1">Step {item.step}</div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative pt-0">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>

                    {/* Accent line on hover */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="relative w-full py-16 md:py-24 lg:py-28 border-t border-border/40">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <m.div 
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <m.div variants={fadeInUp}>
              <Badge className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary border-secondary/20">
                Popular Skills
              </Badge>
            </m.div>
            <m.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              Explore What's Popular
            </m.h2>
            <m.p 
              className="max-w-[700px] text-muted-foreground text-lg"
              variants={fadeInUp}
            >
              Browse the most sought-after skills taught by our community members.
            </m.p>
          </m.div>

          <m.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                emoji: "📐",
                title: "Mathematics",
                description: "Algebra, Calculus, Statistics",
                category: "Academic",
                tutors: "25+"
              },
              {
                emoji: "💻",
                title: "Programming",
                description: "Web Dev, Python, Mobile Apps",
                category: "Technical",
                tutors: "18+"
              },
              {
                emoji: "🌐",
                title: "Languages",
                description: "English, Japanese, Korean",
                category: "Language",
                tutors: "30+"
              },
            ].map((skill, idx) => (
              <m.div key={idx} variants={fadeInUp}>
                <Card className="relative h-full flex flex-col group overflow-hidden hover:border-primary transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-3xl">{skill.emoji}</div>
                      <Badge variant="outline" className="text-xs">{skill.tutors} Tutors</Badge>
                    </div>
                    <CardTitle className="text-lg">{skill.title}</CardTitle>
                    <CardDescription className="text-sm">{skill.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1">
                    <Badge className="bg-primary/10 text-primary border-primary/20">{skill.category}</Badge>
                  </CardContent>
                  <CardFooter>
                    <Link href="/marketplace" className="w-full">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                        Explore <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardFooter>

                  {/* Accent line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-secondary/5" />
        
        <m.div 
          className="relative mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex flex-col items-center space-y-8 text-center">
            <m.div variants={fadeInUp}>
              <Badge className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                Get Started Today
              </Badge>
            </m.div>

            <m.h2 
              className="text-5xl md:text-6xl font-bold tracking-tight leading-tight"
              variants={fadeInUp}
            >
              Ready to Exchange Skills?
            </m.h2>

            <m.p 
              className="mx-auto max-w-[600px] text-muted-foreground text-lg leading-relaxed"
              variants={fadeInUp}
            >
              Join 1,200+ students who are already learning and teaching without spending money.
            </m.p>

            <m.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={fadeInUp}
            >
              <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 font-semibold flex items-center justify-center gap-2">
                  {isAuthenticated ? "Go to Dashboard" : "Sign Up Free"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-semibold">
                  Learn More
                </Button>
              </Link>
            </m.div>
          </div>
        </m.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
