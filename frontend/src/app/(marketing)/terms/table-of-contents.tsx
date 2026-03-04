'use client';

import { useState, useEffect } from 'react';

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
        <div className="lg:col-span-1 border-r border-border/60">
            <div className="sticky top-32 pr-8">
                <nav className="space-y-4">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => handleClick(section.id)}
                            className={`w-full text-left py-1 rounded-lg text-[14px] transition-all duration-300 ${activeSection === section.id
                                    ? 'text-orange-600 font-bold'
                                    : 'text-muted-foreground hover:text-foreground font-medium'
                                }`}
                        >
                            <span className="truncate">{section.title}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
