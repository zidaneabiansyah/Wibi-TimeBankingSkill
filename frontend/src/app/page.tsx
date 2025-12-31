'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Zap, BookOpen, TrendingUp, Users, Star, ArrowRight } from "lucide-react";

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
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Image 
                  src="/wibi.png" 
                  alt="Wibi Logo" 
                  width={28} 
                  height={28} 
                  className="rounded-md"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Wibi</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">Marketplace</Link>
              <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">Community</Link>
              <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">How It Works</Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">About</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent opacity-40" />
        
        <motion.div 
          className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div className="space-y-8" variants={fadeInUp}>
              <div className="space-y-6">
                <motion.div variants={fadeInUp}>
                  <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-primary/30 text-primary bg-primary/5 w-fit">
                    🎓 Welcome to Wibi
                  </Badge>
                </motion.div>

                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
                  variants={fadeInUp}
                >
                  <span className="text-foreground">Your Time Is</span>
                  <br />
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse-slow">
                    Valuable
                  </span>
                </motion.h1>

                <motion.p 
                  className="max-w-[540px] text-lg text-muted-foreground leading-relaxed"
                  variants={fadeInUp}
                >
                  Platform peer-to-peer skill exchange untuk pelajar. Belajar dan ajarkan skill tanpa uang, hanya dengan waktu. Bergabunglah dengan komunitas kami.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={fadeInUp}
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto px-8 font-semibold flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/marketplace" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-semibold">
                    Explore Skills
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
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
              </motion.div>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div 
              className="flex items-center justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative w-full max-w-[500px] aspect-square">
                <Image 
                  src="/undraw_sharing-knowledge_2jx3.svg" 
                  alt="Students exchanging skills" 
                  fill 
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 border-t border-border/40">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                How It Works
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              Time Banking Made Simple
            </motion.h2>
            <motion.p 
              className="max-w-[700px] text-muted-foreground text-lg"
              variants={fadeInUp}
            >
              1 hour teaching = 1 Time Credit = 1 hour learning. No money involved, pure skill exchange.
            </motion.p>
          </motion.div>

          <motion.div 
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
                <motion.div key={idx} variants={fadeInUp}>
                  <Card className="relative h-full flex flex-col overflow-hidden group hover:border-primary transition-all duration-300">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <CardHeader className="relative pb-4 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
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
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 border-t border-border/40">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary border-secondary/20">
                Popular Skills
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              Explore What's Popular
            </motion.h2>
            <motion.p 
              className="max-w-[700px] text-muted-foreground text-lg"
              variants={fadeInUp}
            >
              Browse the most sought-after skills taught by our community members.
            </motion.p>
          </motion.div>

          <motion.div 
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
              <motion.div key={idx} variants={fadeInUp}>
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
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
        
        <motion.div 
          className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex flex-col items-center space-y-8 text-center">
            <motion.div variants={fadeInUp}>
              <Badge className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                Get Started Today
              </Badge>
            </motion.div>

            <motion.h2 
              className="text-5xl md:text-6xl font-bold tracking-tight leading-tight"
              variants={fadeInUp}
            >
              Ready to Exchange Skills?
            </motion.h2>

            <motion.p 
              className="mx-auto max-w-[600px] text-muted-foreground text-lg leading-relaxed"
              variants={fadeInUp}
            >
              Join 1,200+ students who are already learning and teaching without spending money.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={fadeInUp}
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 font-semibold flex items-center justify-center gap-2">
                  Sign Up Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-semibold">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 md:py-24 border-t border-border/40">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Image 
                    src="/wibi.png" 
                    alt="Wibi Logo" 
                    width={20} 
                    height={20} 
                    className="rounded-md"
                  />
                </div>
                <span className="text-lg font-bold text-primary">Wibi</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Peer-to-peer skill exchange platform using Time Banking system.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors duration-200">Marketplace</Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors duration-200">How It Works</Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">About Us</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors duration-200">FAQ</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">Contact</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">Terms</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Connect</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Wibi Time Banking. All rights reserved. • <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link> • <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
