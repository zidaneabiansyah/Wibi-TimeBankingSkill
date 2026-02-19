import type { Metadata } from 'next';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTAButtons } from "@/components/marketing/CTAButtons";
import {
  IconClock,
  IconHeart,
  IconArrowsLeftRight,
  IconCurrencyDollarOff,
  IconEye,
  IconUsers,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: 'How Time Banking Works - Learn the System | Wibi',
  description: 'Understand how time banking works. 1 hour = 1 credit. Exchange skills without money. Learn the core principles and step-by-step guide to get started.',
  keywords: ['time banking', 'how it works', 'skill exchange guide', 'time credits', 'peer learning system'],
  openGraph: {
    title: 'How Time Banking Works - Wibi',
    description: 'Learn how to exchange skills using time as currency. Simple, fair, and free.',
    images: ['/wibi.png'],
  },
};

const features = [
  {
    title: "Everyone's Time is Equal",
    description: "One hour of service is worth one time credit, regardless of the service performed. Teaching calculus = teaching guitar = helping with English.",
    icon: IconClock,
  },
  {
    title: "Everyone Has Value",
    description: "Everyone has something to offer. Time Banking recognizes that everyone, regardless of age or background, has valuable skills to share.",
    icon: IconHeart,
  },
  {
    title: "Reciprocity",
    description: "Helping others is rewarded with credits that can be used to receive help in return. This creates a sustainable cycle of giving and receiving.",
    icon: IconArrowsLeftRight,
  },
  {
    title: "No Money Involved",
    description: "Time Banking operates completely outside the monetary system. No cash changes hands, making skills accessible to everyone.",
    icon: IconCurrencyDollarOff,
  },
  {
    title: "Transparency",
    description: "All exchanges are tracked and visible. The platform provides a clear record of credits earned and spent, ensuring fairness and accountability.",
    icon: IconEye,
  },
  {
    title: "Community Building",
    description: "Time Banking strengthens communities by creating networks of mutual support. It connects people who might not otherwise meet and builds social capital.",
    icon: IconUsers,
  },
];

const steps = [
  {
    number: 1,
    title: "Create Your Profile",
    description: "Sign up and create your profile. Add your personal information, school details, and a short bio. This helps others in the community get to know you.",
    image: "/wibi.png",
    imageAlt: "Create Profile",
  },
  {
    number: 2,
    title: "List Your Skills",
    description: "Add the skills you can teach others. Include your experience level, a description of what you can teach, and your availability. Be specific about what you can offer.",
    image: "/wibi.png",
    imageAlt: "List Skills",
  },
  {
    number: 3,
    title: "Browse the Marketplace",
    description: "Explore skills offered by other students. Filter by category, level, or search for specific topics. Find tutors who can help you learn the skills you're interested in.",
    image: "/wibi.png",
    imageAlt: "Browse Marketplace",
  },
  {
    number: 4,
    title: "Book Sessions",
    description: "Request a session with a tutor. Specify the date, time, duration, and whether you prefer online or in-person. The tutor will approve your request, and the session will be scheduled.",
    image: "/wibi.png",
    imageAlt: "Book Sessions",
  },
  {
    number: 5,
    title: "Exchange Time Credits",
    description: "When you teach, you earn time credits. When you learn, you spend credits. The system automatically tracks your balance. New users start with 3 free credits to get started.",
    image: "/wibi.png",
    imageAlt: "Exchange Credits",
  },
  {
    number: 6,
    title: "Rate and Review",
    description: "After each session, both the tutor and student rate and review each other. This builds trust in the community and helps others make informed decisions.",
    image: "/wibi.png",
    imageAlt: "Rate and Review",
  },
];

const faqs = [
  {
    question: "How do I earn my first credits?",
    answer: "New users start with 3 free credits to help you get started. After that, you earn credits by teaching or helping other students with your skills.",
  },
  {
    question: "What if I don't have any skills to teach?",
    answer: "Everyone has something valuable to offer! Whether it's academic subjects, hobbies, languages, or even basic computer skills, you likely have knowledge that others would appreciate.",
  },
  {
    question: "Can I save up credits for later?",
    answer: "Yes! Credits don't expire, so you can save them for when you need them. Some users teach multiple sessions first, then use their accumulated credits for learning later.",
  },
  {
    question: "Are online sessions available?",
    answer: "Absolutely! You can choose between online or in-person sessions. Online sessions can be conducted through video calls, making it convenient for everyone.",
  },
  {
    question: "What if a session doesn't go well?",
    answer: "If you have issues with a session, you can report it through our platform. Our community guidelines ensure a respectful and productive environment for everyone.",
  },
  {
    question: "Can I teach or learn multiple skills?",
    answer: "Yes! You can list as many skills as you want to teach, and learn as many as you're interested in. This versatility is what makes Time Banking so powerful.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-linear-to-b from-background to-muted/30">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              How Time Banking Works
            </h1>
            <p className="max-w-175 text-muted-foreground text-lg md:text-xl">
              Time Banking is a reciprocity-based work trading system where time is the principal currency.
              1 hour of service = 1 time credit, regardless of the service performed.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Core Principles</h2>
            <p className="max-w-175 text-muted-foreground text-lg">
              Time Banking is built on five core values that make it a unique and powerful system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Step-by-Step Guide</h2>
            <p className="max-w-175 text-muted-foreground text-lg">
              Getting started with Time Banking is easy. Follow these simple steps to begin exchanging skills.
            </p>
          </div>
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2">
                  <div className="space-y-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="rounded-lg overflow-hidden border bg-background">
                    <Image 
                      src={step.image} 
                      alt={step.imageAlt} 
                      width={600} 
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="max-w-175 text-muted-foreground text-lg">
              Got questions about Time Banking? Here are answers to some common questions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <Card key={faq.question} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
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
            <p className="mx-auto max-w-150 text-muted-foreground text-lg">
              Join our community today and start exchanging skills with other students.
            </p>
            <CTAButtons />
          </div>
        </div>
      </section>
    </>
  );
}
