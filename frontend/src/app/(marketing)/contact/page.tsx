import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, FileText, MessageSquare, Bug, ExternalLink } from 'lucide-react';
import { ContactForm } from './contact-client';
import { FAQAccordion } from './faq-accordion';

export const metadata: Metadata = {
    title: 'Contact Us - Get Help & Support | Wibi',
    description: 'Need help? Contact Wibi support team. Find answers to common questions or reach out directly via email, phone, or our contact form.',
    keywords: ['contact wibi', 'customer support', 'help center', 'wibi support', 'get help'],
    openGraph: {
        title: 'Contact Wibi Support',
        description: 'Get help from our support team. We typically respond within 24 hours.',
        images: ['/wibi.png'],
    },
};

const faqItems = [
    {
        id: 'how-start',
        question: 'How do I get started with Wibi Time Banking?',
        answer: "Getting started is easy! Sign up with your email, complete your profile with your skills and availability, and you're ready to share your expertise or learn from others. Browse the marketplace to find skills you want to learn or offer your own.",
        category: 'Getting Started',
    },
    {
        id: 'how-credits',
        question: 'How does the credit system work?',
        answer: 'You earn credits by teaching or sharing your skills with others. Each hour of teaching typically earns you one credit. You can then spend those credits to learn from others. Credits are your currency in the time banking community.',
        category: 'Credits & Payments',
    },
    {
        id: 'how-book',
        question: 'How do I book a session with someone?',
        answer: 'Find the skill you want to learn in the marketplace, click on the teacher\'s profile, check their availability, and click "Book Session". You\'ll receive a confirmation and a video session link. Make sure you have enough credits before booking.',
        category: 'Sessions',
    },
    {
        id: 'cancel-session',
        question: 'Can I cancel a session?',
        answer: 'Yes, you can cancel sessions up to 24 hours before the scheduled time with no penalty. Cancellations made within 24 hours may result in credit deductions. Always check the cancellation policy.',
        category: 'Sessions',
    },
    {
        id: 'refund-credits',
        question: 'Can I get a refund for my credits?',
        answer: 'Credits are non-refundable by design as they represent time value in our community. However, you can always use them to book sessions or transfer them through community initiatives. Contact support for special cases.',
        category: 'Credits & Payments',
    },
    {
        id: 'safety',
        question: 'How does Wibi ensure my safety?',
        answer: 'We verify all users, conduct background checks for premium teachers, use secure video connections, and monitor all interactions. You can report inappropriate behavior, and our trust & safety team responds within 24 hours.',
        category: 'Safety & Trust',
    },
    {
        id: 'technical-issue',
        question: 'I\'m having technical issues with the video session',
        answer: 'First, try refreshing your browser and checking your internet connection. Clear your browser cache and ensure your camera/microphone permissions are granted. For persistent issues, contact our technical support team with details about your device and browser.',
        category: 'Technical',
    },
    {
        id: 'upload-files',
        question: 'Can I share files or documents during a session?',
        answer: 'Yes! You can upload and share documents, presentations, and images during your session. The teacher can also save these files for future reference. File size limit is 10MB per file.',
        category: 'Features',
    },
];

export default function ContactPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 lg:py-28 bg-linear-to-b from-background to-muted/30">
                <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5">
                            Contact & Support
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            Help & <span className="text-primary">Support Center</span>
                        </h1>
                        <p className="max-w-175 text-muted-foreground text-lg md:text-xl">
                            Find answers to common questions or reach out to our team. We're here to help you make the most of your time banking journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="w-full py-16 md:py-24 lg:py-28 bg-background">
                <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                                <p className="text-muted-foreground mb-8">
                                    Reach out to us through any of these channels. We typically respond within 24 hours.
                                </p>
                            </div>

                            {/* Email */}
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 shrink-0">
                                        <Mail className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Email</h3>
                                        <p className="text-sm text-muted-foreground mt-1">halo@wibi.com</p>
                                        <p className="text-xs text-muted-foreground mt-2">We'll respond within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 shrink-0">
                                        <Phone className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Phone</h3>
                                        <p className="text-sm text-muted-foreground mt-1">+62 812-9510-1836</p>
                                        <p className="text-xs text-muted-foreground mt-2">Monday - Friday, 9AM - 5PM WIB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-200">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 shrink-0">
                                        <MapPin className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Location</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Bogor, Indonesia</p>
                                        <p className="text-xs text-muted-foreground mt-2">Serving students nationwide</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-card/50 border border-border/50 rounded-lg p-6 sm:p-8">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-foreground">Send us a Message</h3>
                                    <p className="text-muted-foreground mt-2">
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </p>
                                </div>
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-16 md:py-24 lg:py-28 bg-muted/30 border-t border-border/40">
                <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* FAQ Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                                <p className="text-muted-foreground text-lg">Quick answers to common questions about Wibi.</p>
                            </div>

                            <FAQAccordion items={faqItems} />
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-foreground">Quick Resources</h3>
                            <div className="grid gap-4">
                                <a
                                    href="/how-it-works"
                                    className="flex items-center gap-4 p-5 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-2xl transition-all group"
                                >
                                    <div className="p-3 rounded-xl bg-blue-500/10 group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground">Documentation</p>
                                        <p className="text-sm text-muted-foreground">Detailed platform guides</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                </a>

                                <a
                                    href="/community"
                                    className="flex items-center gap-4 p-5 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 rounded-2xl transition-all group"
                                >
                                    <div className="p-3 rounded-xl bg-purple-500/10 group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground">Community Forum</p>
                                        <p className="text-sm text-muted-foreground">Ask the community</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                </a>

                                <a
                                    href="#"
                                    className="flex items-center gap-4 p-5 bg-green-500/5 hover:bg-green-500/10 border border-green-500/20 rounded-2xl transition-all group"
                                >
                                    <div className="p-3 rounded-xl bg-green-500/10 group-hover:scale-110 transition-transform">
                                        <Bug className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground">System Status</p>
                                        <p className="text-sm text-muted-foreground">Check system health</p>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
