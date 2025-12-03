import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <img src="/wibi.png" alt="Wibi Logo" className="h-7 w-7 rounded-md" />
                </div>
                <span className="text-xl font-bold text-primary">Wibi</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/marketplace" className="px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Marketplace</Link>
              <Link href="/how-it-works" className="px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">How It Works</Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium rounded-lg text-primary bg-primary/10">About</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 flex items-center justify-center">
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
      <section className="w-full py-16 md:py-24 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
      <section className="w-full py-16 md:py-24 bg-background border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
      <section className="w-full py-16 md:py-24 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 mb-4">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">Meet the Founders</h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-[600px] mx-auto">
              A passionate team of students who believe in the power of peer-to-peer learning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-4 flex items-center justify-center text-4xl">
                  👨‍💻
                </div>
                <h3 className="font-semibold text-lg">Wibi Team</h3>
                <p className="text-muted-foreground text-sm">Founder & Developer</p>
                <p className="text-muted-foreground text-xs mt-3">
                  Passionate about creating tools that help students succeed together.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 mx-auto mb-4 flex items-center justify-center text-4xl">
                  👩‍🎨
                </div>
                <h3 className="font-semibold text-lg">Design Team</h3>
                <p className="text-muted-foreground text-sm">UI/UX Designer</p>
                <p className="text-muted-foreground text-xs mt-3">
                  Creating beautiful and intuitive experiences for our users.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 mx-auto mb-4 flex items-center justify-center text-4xl">
                  🤝
                </div>
                <h3 className="font-semibold text-lg">Community</h3>
                <p className="text-muted-foreground text-sm">Community Manager</p>
                <p className="text-muted-foreground text-xs mt-3">
                  Building and nurturing our growing community of learners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Join <span className="text-primary">Our Community</span>?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Start exchanging skills with other students today. It's free to join!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Get Started
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

      {/* Footer */}
      <footer className="w-full py-12 md:py-16 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <img src="/wibi.png" alt="Wibi Logo" className="h-5 w-5 rounded-md" />
                </div>
                <span className="text-lg font-bold text-primary">Wibi</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Platform peer-to-peer skill exchange untuk pelajar menggunakan sistem Time Banking.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">Marketplace</Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Support</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Connect</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Wibi Time Banking. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
