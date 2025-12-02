import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Time Banking Logo" className="h-8 w-8 rounded-md" />
              <span className="text-xl font-bold">Time Banking</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-medium hover:underline underline-offset-4">Marketplace</Link>
            <Link href="/how-it-works" className="text-sm font-medium text-primary hover:underline underline-offset-4">How It Works</Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              How Time Banking Works
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Time Banking is a reciprocity-based work trading system where time is the principal currency.
              1 hour of service = 1 time credit, regardless of the service performed.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Core Principles</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Time Banking is built on five core values that make it a unique and powerful system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m16 10-4 4-4-4" />
                  </svg>
                </div>
                <CardTitle>Everyone's Time is Equal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  One hour of service is worth one time credit, regardless of the service performed. 
                  Teaching calculus = teaching guitar = helping with English.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <CardTitle>Everyone Has Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Everyone has something to offer. Time Banking recognizes that everyone, 
                  regardless of age or background, has valuable skills to share.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5" />
                    <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    <path d="M15 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                </div>
                <CardTitle>Reciprocity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Helping others is rewarded with credits that can be used to receive help in return. 
                  This creates a sustainable cycle of giving and receiving.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </div>
                <CardTitle>No Money Involved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Time Banking operates completely outside the monetary system. 
                  No cash changes hands, making skills accessible to everyone regardless of financial status.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All exchanges are tracked and visible. The platform provides a clear record of 
                  credits earned and spent, ensuring fairness and accountability.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <CardTitle>Community Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Time Banking strengthens communities by creating networks of mutual support. 
                  It connects people who might not otherwise meet and builds social capital.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Step-by-Step Guide</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Getting started with Time Banking is easy. Follow these simple steps to begin exchanging skills.
            </p>
          </div>
          <div className="space-y-8">
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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Got questions about Time Banking? Here are answers to some common questions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>How do I earn my first credits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  New users start with 3 free credits to help you get started. After that, you earn credits by teaching or helping other students with your skills.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What if I don't have any skills to teach?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Everyone has something valuable to offer! Whether it's academic subjects, hobbies, languages, or even basic computer skills, you likely have knowledge that others would appreciate.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I save up credits for later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Credits don't expire, so you can save them for when you need them. Some users teach multiple sessions first, then use their accumulated credits for learning later.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Are online sessions available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! You can choose between online or in-person sessions. Online sessions can be conducted through video calls, making it convenient for everyone.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What if a session doesn't go well?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have issues with a session, you can report it through our platform. Our community guidelines ensure a respectful and productive environment for everyone.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I teach or learn multiple skills?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can list as many skills as you want to teach, and learn as many as you're interested in. This versatility is what makes Time Banking so powerful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Start Time Banking?</h2>
            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
              Join our community today and start exchanging skills with other students.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">Sign Up Now</Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">Explore Skills</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Time Banking Logo" className="h-6 w-6 rounded-md" />
                <span className="text-lg font-bold">Time Banking</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform peer-to-peer skill exchange untuk pelajar menggunakan sistem Time Banking.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/marketplace" className="text-muted-foreground hover:text-foreground">Marketplace</Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">How It Works</Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Connect</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Time Banking Skill Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
