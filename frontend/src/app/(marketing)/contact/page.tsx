import type { Metadata } from 'next';
import { Mail, Phone, MapPin, FileText, MessageSquare, Bug, ExternalLink, Instagram, Twitter, Linkedin, Github } from 'lucide-react';
import { ContactForm } from './contact-client';
import { FAQAccordion } from './faq-accordion';
import Link from 'next/link';

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
        <div className="min-h-screen bg-background font-['Plus_Jakarta_Sans']">
            {/* Header/Hero Section */}
            <section className="w-full pt-16 md:pt-24 lg:pt-32 pb-12">
                <div className="mx-auto max-w-4xl px-6 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-[56px] font-medium tracking-tight text-foreground">
                        Contact <span className="italic font-light">Us</span>
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        We&apos;re here to help! Whether you have questions, feedback, or need support, our team is ready to assist you.
                    </p>
                </div>
            </section>

            {/* Main Contact Area */}
            <section className="w-full max-w-6xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start bg-card rounded-3xl p-8 md:p-12 border border-border/40 shadow-sm">
                    
                    {/* Left Column: Info */}
                    <div className="space-y-12">
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                            Get in <span className="italic font-light">touch</span>
                        </h2>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Email:</p>
                                <a href="mailto:halo@wibi.com" className="text-lg md:text-xl font-medium text-foreground hover:text-primary transition-colors">
                                    halo@wibi.com
                                </a>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Phone:</p>
                                <a href="tel:+6281295101836" className="text-lg md:text-xl font-medium text-foreground hover:text-primary transition-colors">
                                    +62 812-9510-1836
                                </a>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Address:</p>
                                <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed max-w-xs">
                                    Bogor, Jawa Barat, Indonesia
                                </p>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="pt-4">
                            <p className="text-sm text-muted-foreground mb-4">Follow Us</p>
                            <div className="flex items-center gap-4">
                                <Link href="#" className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-foreground">
                                    <Instagram className="w-4 h-4" />
                                </Link>
                                <Link href="#" className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-foreground">
                                    <Twitter className="w-4 h-4 fill-current" />
                                </Link>
                                <Link href="#" className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-foreground">
                                    <Linkedin className="w-4 h-4" />
                                </Link>
                                <Link href="#" className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-foreground">
                                    <Github className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="flex-1 w-full">
                        <ContactForm />
                    </div>
                </div>
            </section>

            {/* CTA Moneta-style Banner */}
            <section className="w-full max-w-7xl mx-auto px-6 mb-24 flex justify-center">
                <div className="bg-primary/90 rounded-3xl overflow-hidden relative shadow-lg w-full">
                    {/* Background Grid Pattern (Subtle) */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px', color: 'var(--primary-foreground)' }}></div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between relative z-10 px-8 py-16 md:p-20 lg:p-24 gap-12">
                        
                        {/* Left Content */}
                        <div className="w-full md:w-1/2 space-y-8 text-white">
                            <h2 className="text-4xl md:text-5xl lg:text-[50px] font-medium leading-[1.15] tracking-tight text-primary-foreground">
                                Ready to Transform Your <span className="italic font-light">Time Banking Experience?</span>
                            </h2>
                            <p className="text-primary-foreground/80 text-base md:text-lg max-w-md leading-relaxed font-light">
                                Experience the future of skill exchange with our cutting-edge SaaS platform. Start optimizing your time operations today!
                            </p>
                            <Link href="/auth/register" className="inline-flex items-center justify-center bg-background text-foreground font-semibold h-14 px-8 rounded-full hover:bg-muted transition-transform hover:scale-105 shadow-xl">
                                Join now
                                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </Link>
                        </div>

                        {/* Right Content - Mockup Cards */}
                        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative min-h-[300px] md:min-h-full mr-0 md:mr-10">
                            {/* Card 1 (Back, Rotated) */}
                            <div className="absolute top-4 right-12 md:-right-8 shadow-2xl rounded-3xl bg-background w-[260px] h-[380px] p-6 flex flex-col justify-between transform -rotate-12 translate-y-10 scale-90 md:scale-100 transition-transform duration-500 hover:-rotate-6 hover:translate-y-8 opacity-90 border border-border">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-[2px]">
                                            <div className="w-2.5 h-4 bg-primary rounded-sm transform -rotate-12"></div>
                                            <div className="w-2.5 h-4 bg-primary rounded-sm transform -rotate-12"></div>
                                            <div className="w-2.5 h-4 bg-primary rounded-sm transform -rotate-12"></div>
                                        </div>
                                        <span className="font-bold text-primary tracking-tight">Wibi</span>
                                    </div>
                                    {/* Chip mockup */}
                                    <div className="w-10 h-8 rounded border border-border bg-muted/50 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-x-2 top-2 h-[1px] bg-border"></div>
                                        <div className="absolute inset-x-2 bottom-2 h-[1px] bg-border"></div>
                                        <div className="absolute inset-y-2 left-3 w-[1px] bg-border"></div>
                                        <div className="absolute inset-y-2 right-3 w-[1px] bg-border"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-full h-10 bg-primary/10 rounded-full"></div>
                                    <div className="w-3/4 h-10 bg-primary/10 rounded-full"></div>
                                    <div className="pt-2">
                                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Skill Points</p>
                                        <p className="font-mono text-xl tracking-widest text-primary">1234 5678</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Card 2 (Front, Straight) */}
                            <div className="absolute top-0 right-4 md:-right-16 shadow-2xl rounded-3xl bg-background w-[280px] h-[400px] p-6 flex flex-col justify-between transform rotate-3 translate-y-4 scale-95 md:scale-105 transition-transform duration-500 hover:rotate-0 hover:-translate-y-2 border border-border z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-[2px]">
                                            <div className="w-3 h-5 bg-primary rounded-sm transform -rotate-12"></div>
                                            <div className="w-3 h-5 bg-primary rounded-sm transform -rotate-12"></div>
                                            <div className="w-3 h-5 bg-primary rounded-sm transform -rotate-12"></div>
                                        </div>
                                        <span className="font-bold text-xl text-primary tracking-tight">Wibi</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        {/* Chip mockup */}
                                        <div className="w-12 h-9 rounded-md border border-border bg-muted/50 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute w-[80%] h-[1px] bg-border top-1/4"></div>
                                            <div className="absolute w-[80%] h-[1px] bg-border bottom-1/4"></div>
                                            <div className="absolute h-[80%] w-[1px] bg-border left-1/3"></div>
                                            <div className="absolute h-[80%] w-[1px] bg-border right-1/3"></div>
                                        </div>
                                        {/* Contactless icon */}
                                        <svg className="w-5 h-5 text-muted-foreground rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 21.37a11.96 11.96 0 0 0 0-18.74"></path><path d="M12 18.63a7 7 0 0 0 0-13.26"></path><path d="M15.5 15.89a2 2 0 0 0 0-7.78"></path></svg>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="w-full h-12 bg-primary/10 rounded-full"></div>
                                    <div className="w-4/5 h-12 bg-primary/10 rounded-full"></div>
                                    <div className="pt-2 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-1">Card number</p>
                                            <p className="font-mono text-2xl tracking-[0.15em] text-primary">1234 0000</p>
                                        </div>
                                        <p className="font-mono text-sm tracking-widest text-primary">4352</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ and Resources Section */}
            <section className="w-full max-w-6xl mx-auto px-6 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* FAQ Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground text-base">Quick answers to common questions about Wibi.</p>
                        </div>

                        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/40 shadow-sm">
                            <FAQAccordion items={faqItems} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-foreground tracking-tight">Quick Resources</h3>
                        <div className="grid gap-4">
                            <a
                                href="/how-it-works"
                                className="flex items-center gap-4 p-5 bg-card hover:bg-muted/30 border border-border/40 rounded-2xl transition-all group shadow-sm"
                            >
                                <div className="p-3 rounded-full bg-primary/10 group-hover:scale-110 transition-transform">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">Documentation</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">Detailed platform guides</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>

                            <a
                                href="/community"
                                className="flex items-center gap-4 p-5 bg-card hover:bg-muted/30 border border-border/40 rounded-2xl transition-all group shadow-sm"
                            >
                                <div className="p-3 rounded-full bg-purple-500/10 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-5 h-5 text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">Community Forum</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">Ask the community</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>

                            <a
                                href="#"
                                className="flex items-center gap-4 p-5 bg-card hover:bg-muted/30 border border-border/40 rounded-2xl transition-all group shadow-sm"
                            >
                                <div className="p-3 rounded-full bg-emerald-500/10 group-hover:scale-110 transition-transform">
                                    <Bug className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">System Status</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">Check system health</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="w-full bg-zinc-950 text-white pt-20 pb-24 px-6 lg:px-16 mt-0">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight">
                        Stay Ahead with Community <br/>
                        <span className="italic font-light text-zinc-300">Insights and Updates</span>
                    </h2>
                    <p className="text-zinc-400 text-sm md:text-base max-w-xl font-light">
                        Subscribe to our newsletter for expert tips, updates, and the latest trends in time banking and skill sharing.
                    </p>
                    
                    {/* Newsletter Input Form */}
                    <form className="w-full max-w-lg flex flex-col sm:flex-row gap-3 mt-4">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-zinc-500 transition-colors"
                            required
                        />
                        <button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 font-medium text-sm transition-colors shadow-lg"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
