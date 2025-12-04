import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
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
              <Link href="/how-it-works" className="px-4 py-2 text-sm font-medium rounded-lg text-primary bg-primary/10">How It Works</Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">About</Link>
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
      <section className="w-full py-16 md:py-24 lg:py-32 bg-linear-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              How Time Banking Works
            </h1>
            <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
              Time Banking is a reciprocity-based work trading system where time is the principal currency.
              1 hour of service = 1 time credit, regardless of the service performed.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Core Principles</h2>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Time Banking is built on five core values that make it a unique and powerful system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex flex-col items-center text-center h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-4 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Everyone's Time is Equal</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  One hour of service is worth one time credit, regardless of the service performed. 
                  Teaching calculus = teaching guitar = helping with English.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-4 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Everyone Has Value</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Everyone has something to offer. Time Banking recognizes that everyone, 
                  regardless of age or background, has valuable skills to share.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-4 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                    <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5" />
                    <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Reciprocity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Helping others is rewarded with credits that can be used to receive help in return. 
                  This creates a sustainable cycle of giving and receiving.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-4 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </div>
                <CardTitle className="text-lg">No Money Involved</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Time Banking operates completely outside the monetary system. 
                  No cash changes hands, making skills accessible to everyone.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-4 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Transparency</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All exchanges are tracked and visible. The platform provides a clear record of 
                  credits earned and spent, ensuring fairness and accountability.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center h-full bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-4 flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Community Building</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Time Banking strengthens communities by creating networks of mutual support. 
                  It connects people who might not otherwise meet and builds social capital.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Step-by-Step Guide</h2>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Getting started with Time Banking is easy. Follow these simple steps to begin exchanging skills.
            </p>
          </div>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <h3 className="text-2xl font-bold">Create Your Profile</h3>
                  <p className="text-muted-foreground">
                    Sign up and create your profile. Add your personal information, school details, and a short bio. 
                    This helps others in the community get to know you.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3" alt="Create Profile" className="w-full h-auto" />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0" alt="List Skills" className="w-full h-auto" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <h3 className="text-2xl font-bold">List Your Skills</h3>
                  <p className="text-muted-foreground">
                    Add the skills you can teach others. Include your experience level, a description of what you can teach, 
                    and your availability. Be specific about what you can offer.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <h3 className="text-2xl font-bold">Browse the Marketplace</h3>
                  <p className="text-muted-foreground">
                    Explore skills offered by other students. Filter by category, level, or search for specific topics. 
                    Find tutors who can help you learn the skills you're interested in.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" alt="Browse Marketplace" className="w-full h-auto" />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4" alt="Book Sessions" className="w-full h-auto" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    4
                  </div>
                  <h3 className="text-2xl font-bold">Book Sessions</h3>
                  <p className="text-muted-foreground">
                    Request a session with a tutor. Specify the date, time, duration, and whether you prefer online or in-person. 
                    The tutor will approve your request, and the session will be scheduled.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    5
                  </div>
                  <h3 className="text-2xl font-bold">Exchange Time Credits</h3>
                  <p className="text-muted-foreground">
                    When you teach, you earn time credits. When you learn, you spend credits. The system automatically tracks your balance. 
                    New users start with 3 free credits to get started.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img src="https://images.unsplash.com/photo-1553729459-efe14ef6055d" alt="Exchange Credits" className="w-full h-auto" />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952" alt="Rate and Review" className="w-full h-auto" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="space-y-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    6
                  </div>
                  <h3 className="text-2xl font-bold">Rate and Review</h3>
                  <p className="text-muted-foreground">
                    After each session, both the tutor and student rate and review each other. This builds trust in the community 
                    and helps others make informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Got questions about Time Banking? Here are answers to some common questions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">How do I earn my first credits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  New users start with 3 free credits to help you get started. After that, you earn credits by teaching or helping other students with your skills.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">What if I don't have any skills to teach?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Everyone has something valuable to offer! Whether it's academic subjects, hobbies, languages, or even basic computer skills, you likely have knowledge that others would appreciate.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Can I save up credits for later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Yes! Credits don't expire, so you can save them for when you need them. Some users teach multiple sessions first, then use their accumulated credits for learning later.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Are online sessions available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Absolutely! You can choose between online or in-person sessions. Online sessions can be conducted through video calls, making it convenient for everyone.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">What if a session doesn't go well?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If you have issues with a session, you can report it through our platform. Our community guidelines ensure a respectful and productive environment for everyone.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Can I teach or learn multiple skills?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Yes! You can list as many skills as you want to teach, and learn as many as you're interested in. This versatility is what makes Time Banking so powerful.
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
              Ready to Start <span className="text-primary">Time Banking</span>?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Join our community today and start exchanging skills with other students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Sign Up Now
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
