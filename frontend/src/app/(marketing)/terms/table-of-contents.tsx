'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface Section {
    id: string;
    title: string;
}

interface TableOfContentsProps {
    sections: Section[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
    const [activeSection, setActiveSection] = useState('acceptance');

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sections]);

    const handleClick = (sectionId: string) => {
        setActiveSection(sectionId);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border shadow-xs rounded-2xl p-5 sticky top-24 pointer-events-auto">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6">
                    Getting Started
                </h3>
                <nav className="space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => handleClick(section.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-3 font-medium ${activeSection === section.id
                                    ? 'bg-orange-500/10 text-orange-600 font-bold border border-orange-500/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                                }`}
                        >
                            <span className="shrink-0 flex items-center justify-center">
                                {/* Use an active dot instead of Chevron for cleaner look */}
                                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSection === section.id ? 'bg-orange-600 scale-100' : 'bg-transparent scale-0'}`} />
                            </span>
                            <span className="truncate">{section.title}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Need More Help Card */}
            <div className="bg-card border border-border shadow-xs rounded-2xl p-6 sticky top-[80vh]">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z"/>
                        <path d="M22 2 11 13"/>
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Need more help?</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                    Cant find the answer youre looking for? Our support team is here to help.
                </p>
                <button className="w-full py-3 px-4 bg-foreground text-background hover:bg-orange-600 hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95">
                    Submit Ticket
                </button>
            </div>
        </div>
    );
}
