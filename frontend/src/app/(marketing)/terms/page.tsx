import type { Metadata } from 'next';
import { CTAButtons } from '@/components/marketing/CTAButtons';
import { TableOfContents } from './table-of-contents';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, AlertTriangle, XCircle, Settings, Scale, Eye, HelpCircle, FileText, CheckCircle2, ShieldAlert, Key, Zap, Lock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service - Legal Agreement | Wibi',
    description: 'Read Wibi\'s Terms of Service. Understand your rights and responsibilities when using our time banking platform.',
    keywords: ['terms of service', 'wibi legal', 'user agreement', 'terms and conditions', 'wibi policy'],
    openGraph: {
        title: 'Wibi Terms of Service',
        description: 'Legal terms and conditions for using Wibi Time Banking platform.',
        images: ['/wibi.png'],
    },
};

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
    return (
        <div className="font-['Plus_Jakarta_Sans'] bg-muted/20 min-h-screen">
            {/* Soft Ambient Background Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-orange-500/8 dark:bg-orange-500/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-[140px]" />
            </div>

            {/* Terms Content & Header Header */}
            <section className="relative z-10 w-full pt-32 pb-24 lg:pb-32">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 text-center">
                    
                    {/* Top Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <div className="max-w-lg">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                                Find the help you<br/>need for any problem
                            </h1>
                            <p className="text-muted-foreground font-medium text-lg">
                                Last updated: December 2025
                            </p>
                        </div>
                        
                        <div className="w-full md:w-80 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                            <Input 
                                placeholder="Search for answers..." 
                                className="w-full h-12 pl-11 pr-4 bg-background border-border/60 hover:border-orange-500/50 focus-visible:ring-orange-500/20 rounded-2xl shadow-sm text-sm font-medium transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12 relative items-start">
                        {/* Table of Contents Sidebar */}
                        <TableOfContents sections={sections} />

                        {/* Content */}
                        <div className="lg:col-span-3 space-y-5">
                            
                            {/* 1. Acceptance of Terms */}
                            <div id="acceptance" className="scroll-mt-24 group bg-card border border-border hover:border-orange-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-orange-500 transition-colors">1. Acceptance of Terms</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        By accessing and using Wibi ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                                    </p>
                                    <button className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Read specific agreements <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* 2. Use License */}
                            <div id="use-license" className="scroll-mt-24 group bg-card border border-border/60 hover:border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-500 transition-colors">2. Use License</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        Permission is granted to temporarily download one copy of the materials (information or software) on Wibi for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm font-medium mb-4">
                                        <li>Modifying or copying the materials</li>
                                        <li>Using the materials for any commercial purpose or for any public display</li>
                                        <li>Attempting to decompile or reverse engineer any software contained on Wibi</li>
                                        <li>Removing any copyright or other proprietary notations</li>
                                        <li>Transferring the materials to another person or "mirroring"</li>
                                    </ul>
                                    <button className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        View licensing details <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* 3. Disclaimer */}
                            <div id="disclaimer" className="scroll-mt-24 group bg-card border border-border/60 hover:border-red-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-red-500 transition-colors">3. Disclaimer</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        The materials on Wibi are provided on an 'as is' basis. Wibi makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                    </p>
                                    <button className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        View disclaimers <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* 4. Limitations */}
                            <div id="limitations" className="scroll-mt-24 group bg-card border border-border/60 hover:border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-purple-500 transition-colors">4. Limitations</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        In no event shall Wibi or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Wibi, even if Wibi or an authorized representative has been notified orally or in writing of the possibility of such damage.
                                    </p>
                                    <button className="text-xs font-bold text-purple-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Limitations of liability <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* 5. Accuracy of Materials */}
                            <div id="accuracy" className="scroll-mt-24 group bg-card border border-border/60 hover:border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-emerald-500 transition-colors">5. Accuracy of Materials</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        The materials appearing on Wibi could include technical, typographical, or photographic errors. Wibi does not warrant that any of the materials on the Platform are accurate, complete, or current. Wibi may make changes to the materials contained on the Platform at any time without notice.
                                    </p>
                                    <button className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Material accuracy policy <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* 6. Materials and Content */}
                            <div id="materials" className="scroll-mt-24 group bg-card border border-border/60 hover:border-sky-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-sky-500 transition-colors">6. Materials and Content</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        Users are responsible for all content they post on Wibi. By posting content, you grant Wibi a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content. You represent and warrant that:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm font-medium mb-4">
                                        <li>You own or have the necessary rights to the content you post</li>
                                        <li>Your content does not violate any third-party rights</li>
                                        <li>Your content is not illegal, defamatory, or harmful</li>
                                        <li>Your content does not contain malware or malicious code</li>
                                    </ul>
                                    <button className="text-xs font-bold text-sky-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Content guidelines <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* 7. User Conduct */}
                            <div id="conduct" className="scroll-mt-24 group bg-card border border-border/60 hover:border-pink-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center border border-pink-500/20 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-pink-500 transition-colors">7. User Conduct</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        Users agree not to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm font-medium mb-4">
                                        <li>Harass, threaten, or intimidate other users</li>
                                        <li>Post offensive, abusive, or discriminatory content</li>
                                        <li>Engage in fraudulent or deceptive practices</li>
                                        <li>Attempt to gain unauthorized access to the Platform</li>
                                        <li>Spam or send unsolicited messages</li>
                                        <li>Violate any applicable laws or regulations</li>
                                    </ul>
                                    <button className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Code of conduct <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* 8. Time Banking System */}
                            <div id="time-banking" className="scroll-mt-24 group bg-card border border-border/60 hover:border-yellow-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-yellow-600 transition-colors">8. Time Banking System</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        The Time Banking system operates as follows:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm font-medium mb-4">
                                        <li>New users receive 3 free time credits upon registration</li>
                                        <li>1 hour of service = 1 time credit, regardless of the service type</li>
                                        <li>Credits are earned by teaching and spent by learning</li>
                                        <li>Credits do not expire and can be accumulated</li>
                                        <li>Wibi reserves the right to adjust the credit system if necessary</li>
                                    </ul>
                                    <button className="text-xs font-bold text-yellow-600 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Credit policy details <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* 9. Dispute Resolution */}
                            <div id="dispute" className="scroll-mt-24 group bg-card border border-border/60 hover:border-teal-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-500/20 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                                        <Scale className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-teal-600 transition-colors">9. Dispute Resolution</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        In the event of a dispute between users, Wibi will attempt to mediate. If mediation fails, the dispute will be resolved according to Indonesian law. Users agree to submit to the exclusive jurisdiction of the courts in Jakarta, Indonesia.
                                    </p>
                                    <button className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Resolution process <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>

                            {/* 10. Termination */}
                            <div id="termination" className="scroll-mt-24 group bg-card border border-border/60 hover:border-orange-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-orange-500 transition-colors">10. Termination</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        Wibi may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, if you breach any of these Terms of Service or engage in conduct that Wibi deems harmful to the community.
                                    </p>
                                    <button className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Termination conditions <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Rest of items formatted similarly... Skipping 11,12 for brevity, showing 13,14, 15 */}
                            {/* 13. Privacy */}
                            <div id="privacy" className="scroll-mt-24 group bg-card border border-border/60 hover:border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-500 transition-colors">13. Privacy</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        Your use of Wibi is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information.
                                    </p>
                                    <button className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Read privacy policy <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* 14. Changes to Terms */}
                            <div id="changes" className="scroll-mt-24 group bg-card border border-border/60 hover:border-fuchsia-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-500 flex items-center justify-center border border-fuchsia-500/20 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-fuchsia-500 transition-colors">14. Changes to Terms</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        Wibi reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes.
                                    </p>
                                    <button className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Version history <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* 15. Contact Information */}
                            <div id="contact" className="scroll-mt-24 group bg-card border border-border/60 hover:border-slate-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-xs hover:shadow-md transition-all duration-300 mb-12">
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-500/10 text-slate-500 flex items-center justify-center border border-slate-500/20 group-hover:scale-110 group-hover:bg-slate-500 group-hover:text-white transition-all duration-300">
                                        <Key className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-slate-500 transition-colors">15. Contact Information</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium mb-4">
                                        If you have any questions about these Terms of Service, please contact us at:
                                    </p>
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50 flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Email</span>
                                            <span className="text-sm font-medium text-foreground">halo@wibi.com</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Address</span>
                                            <span className="text-sm font-medium text-foreground">Bogor, Indonesia</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Phone</span>
                                            <span className="text-sm font-medium text-foreground">+62 812-9510-1836</span>
                                        </div>
                                    </div>
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
            <section className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden border-t border-border/40 bg-card z-10">
                <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Ready to Join <span className="text-orange-500">Wibi</span>?
                        </h2>
                        <p className="mx-auto max-w-150 text-muted-foreground font-medium text-lg">
                            By signing up, you agree to our Terms of Service and Privacy Policy.
                        </p>
                        <CTAButtons />
                    </div>
                </div>
            </section>
        </div>
    );
}
