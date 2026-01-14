'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import { useAuthStore } from "@/stores/auth.store";

export default function AboutPage() {
  const { isAuthenticated } = useAuthStore();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-linear-to-b from-background to-muted/30">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5">
              About Us
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Empowering Students Through <span className="text-primary">Skill Exchange</span>
            </h1>
            <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
              Wibi is a peer-to-peer skill exchange platform built for students, by students. 
              We believe everyone has something valuable to teach and learn.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Making Education Accessible to Everyone
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We started Wibi with a simple idea: what if students could help each other learn without 
                the barrier of money? Time Banking makes this possible by valuing everyone's time equally.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're great at math, speak multiple languages, or can teach guitar, your skills 
                have value. And there's always someone who can teach you something new in return.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Free to Use</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Student-Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                      <path d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Community Driven</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-transparent p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-7xl">🎓</div>
                  <p className="text-xl font-semibold text-primary">Learn Together, Grow Together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full py-20 overflow-hidden border-t border-border/40">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Impact</h2>
            <p className="text-muted-foreground text-lg mt-4">Growing community of learners and teachers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">500+</div>
                <p className="text-muted-foreground mt-2">Active Students</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">1,200+</div>
                <p className="text-muted-foreground mt-2">Sessions Completed</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">50+</div>
                <p className="text-muted-foreground mt-2">Skills Available</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary">4.8</div>
                <p className="text-muted-foreground mt-2">Average Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">What We Believe In</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors h-full">
              <CardHeader className="pb-4 flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Equality</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Everyone's time is valued equally. One hour of teaching math is worth the same as one hour of teaching music.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors h-full">
              <CardHeader className="pb-4 flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Trust</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We build trust through transparency, reviews, and a supportive community that holds each other accountable.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors h-full">
              <CardHeader className="pb-4 flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Growth</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We believe in continuous learning and personal development. Every interaction is an opportunity to grow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-16 md:py-24 bg-background border-t border-border/40">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 mb-4">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Meet the Founders</h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-[600px] mx-auto">
              A passionate team of students who believe in the power of peer-to-peer learning.
            </p>
          </div>
          <div className="flex justify-center max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors text-center max-w-xs">
              <CardContent className="pt-8">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-primary/5 mx-auto mb-4 flex items-center justify-center text-4xl">
                  👨‍💻
                </div>
                <h3 className="font-semibold text-lg">Zidane Abiansyah</h3>
                <p className="text-muted-foreground text-sm">Founder & Developer</p>
                <p className="text-muted-foreground text-xs mt-3">
                  Passionate about creating tools that help students succeed together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Join <span className="text-primary">Our Community</span>?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Start exchanging skills with other students today. It's free to join!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-border hover:bg-muted">
                  Explore Skills
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
