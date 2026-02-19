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
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                    Table of Contents
                </h3>
                <nav className="space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => handleClick(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${activeSection === section.id
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                }`}
                        >
                            {activeSection === section.id && <ChevronRight className="h-4 w-4 shrink-0" />}
                            <span className={activeSection === section.id ? '' : 'ml-6'}>{section.title}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
