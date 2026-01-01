'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'use-license', title: '2. Use License' },
    { id: 'disclaimer', title: '3. Disclaimer' },
    { id: 'limitations', title: '4. Limitations' },
    { id: 'accuracy', title: '5. Accuracy of Materials' },
    { id: 'materials', title: '6. Materials and Content' },
    { id: 'conduct', title: '7. User Conduct' },
    { id: 'time-banking', title: '8. Time Banking System' },
    { id: 'dispute', title: '9. Dispute Resolution' },
    { id: 'termination', title: '10. Termination' },
    { id: 'liability', title: '11. Limitation of Liability' },
    { id: 'indemnification', title: '12. Indemnification' },
    { id: 'privacy', title: '13. Privacy' },
    { id: 'changes', title: '14. Changes to Terms' },
    { id: 'contact', title: '15. Contact Information' },
];

export default function TermsPage() {
    const [activeSection, setActiveSection] = useState('acceptance');
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
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5">
                            Legal
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            Terms of <span className="text-primary">Service</span>
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl">
                            Please read these terms carefully before using Wibi. Last updated: December 2025
                        </p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Table of Contents Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-2">
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Table of Contents</h3>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => {
                                                setActiveSection(section.id);
                                                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                                                activeSection === section.id
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                            }`}
                                        >
                                            {activeSection === section.id && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                                            <span className={activeSection === section.id ? '' : 'ml-6'}>{section.title}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-3 space-y-8">
                        {/* 1. Acceptance of Terms */}
                        <div id="acceptance">
                            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing and using Wibi ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </div>

                        {/* 2. Use License */}
                        <div id="use-license">
                            <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Permission is granted to temporarily download one copy of the materials (information or software) on Wibi for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Modifying or copying the materials</li>
                                <li>Using the materials for any commercial purpose or for any public display</li>
                                <li>Attempting to decompile or reverse engineer any software contained on Wibi</li>
                                <li>Removing any copyright or other proprietary notations from the materials</li>
                                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                            </ul>
                        </div>

                        {/* 3. Disclaimer */}
                        <div id="disclaimer">
                            <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The materials on Wibi are provided on an 'as is' basis. Wibi makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </div>

                        {/* 4. Limitations */}
                        <div id="limitations">
                            <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In no event shall Wibi or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Wibi, even if Wibi or an authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </div>

                        {/* 5. Accuracy of Materials */}
                        <div id="accuracy">
                            <h2 className="text-2xl font-bold text-foreground mb-4">5. Accuracy of Materials</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The materials appearing on Wibi could include technical, typographical, or photographic errors. Wibi does not warrant that any of the materials on the Platform are accurate, complete, or current. Wibi may make changes to the materials contained on the Platform at any time without notice.
                            </p>
                        </div>

                        {/* 6. Materials and Content */}
                        <div id="materials">
                            <h2 className="text-2xl font-bold text-foreground mb-4">6. Materials and Content</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Users are responsible for all content they post on Wibi. By posting content, you grant Wibi a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content. You represent and warrant that:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>You own or have the necessary rights to the content you post</li>
                                <li>Your content does not violate any third-party rights</li>
                                <li>Your content is not illegal, defamatory, or harmful</li>
                                <li>Your content does not contain malware or malicious code</li>
                            </ul>
                        </div>

                        {/* 7. User Conduct */}
                        <div id="conduct">
                            <h2 className="text-2xl font-bold text-foreground mb-4">7. User Conduct</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Users agree not to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Harass, threaten, or intimidate other users</li>
                                <li>Post offensive, abusive, or discriminatory content</li>
                                <li>Engage in fraudulent or deceptive practices</li>
                                <li>Attempt to gain unauthorized access to the Platform</li>
                                <li>Spam or send unsolicited messages</li>
                                <li>Violate any applicable laws or regulations</li>
                            </ul>
                        </div>

                        {/* 8. Time Banking System */}
                        <div id="time-banking">
                            <h2 className="text-2xl font-bold text-foreground mb-4">8. Time Banking System</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                The Time Banking system operates as follows:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>New users receive 3 free time credits upon registration</li>
                                <li>1 hour of service = 1 time credit, regardless of the service type</li>
                                <li>Credits are earned by teaching and spent by learning</li>
                                <li>Credits do not expire and can be accumulated</li>
                                <li>Wibi reserves the right to adjust the credit system if necessary</li>
                            </ul>
                        </div>

                        {/* 9. Dispute Resolution */}
                        <div id="dispute">
                            <h2 className="text-2xl font-bold text-foreground mb-4">9. Dispute Resolution</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In the event of a dispute between users, Wibi will attempt to mediate. If mediation fails, the dispute will be resolved according to Indonesian law. Users agree to submit to the exclusive jurisdiction of the courts in Jakarta, Indonesia.
                            </p>
                        </div>

                        {/* 10. Termination */}
                        <div id="termination">
                            <h2 className="text-2xl font-bold text-foreground mb-4">10. Termination</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Wibi may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, if you breach any of these Terms of Service or engage in conduct that Wibi deems harmful to the community.
                            </p>
                        </div>

                        {/* 11. Limitation of Liability */}
                        <div id="liability">
                            <h2 className="text-2xl font-bold text-foreground mb-4">11. Limitation of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To the fullest extent permitted by law, Wibi shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform, even if Wibi has been advised of the possibility of such damages.
                            </p>
                        </div>

                        {/* 12. Indemnification */}
                        <div id="indemnification">
                            <h2 className="text-2xl font-bold text-foreground mb-4">12. Indemnification</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You agree to indemnify and hold harmless Wibi and its officers, directors, employees, and agents from any claim, demand, or damage arising out of your use of the Platform or violation of these Terms of Service.
                            </p>
                        </div>

                        {/* 13. Privacy */}
                        <div id="privacy">
                            <h2 className="text-2xl font-bold text-foreground mb-4">13. Privacy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Your use of Wibi is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information.
                            </p>
                        </div>

                        {/* 14. Changes to Terms */}
                        <div id="changes">
                            <h2 className="text-2xl font-bold text-foreground mb-4">14. Changes to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Wibi reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes.
                            </p>
                        </div>

                        {/* 15. Contact Information */}
                        <div id="contact">
                            <h2 className="text-2xl font-bold text-foreground mb-4">15. Contact Information</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                If you have any questions about these Terms of Service, please contact us at:
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                                <p className="text-muted-foreground">
                                    <strong>Email:</strong> halo@wibi.com<br />
                                    <strong>Address:</strong> Bogor, Indonesia<br />
                                    <strong>Phone:</strong> +62 812-9510-1836
                                </p>
                            </div>
                        </div>

                        {/* Acceptance */}
                        <div className="bg-primary/10 border border-primary/30 p-6 rounded-lg mt-8">
                            <p className="text-foreground font-semibold mb-2">
                                By using Wibi, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Last updated: December 2025
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden border-t border-border/40 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Ready to Join <span className="text-primary">Wibi</span>?
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
                            By signing up, you agree to our Terms of Service and Privacy Policy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/register">
                                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                    Sign Up Now
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-border hover:bg-muted">
                                    Contact Us
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
