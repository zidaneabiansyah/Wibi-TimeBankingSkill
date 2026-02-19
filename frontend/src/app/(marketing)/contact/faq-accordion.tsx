'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { m } from 'framer-motion';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface FAQAccordionProps {
    items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedFAQId, setExpandedFAQId] = useState<string | null>(null);

    const faqCategories = ['All', ...new Set(items.map((item) => item.category))];

    const filteredFAQs =
        selectedCategory === 'All'
            ? items
            : items.filter((item) => item.category === selectedCategory);

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {faqCategories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background border border-border/50 text-muted-foreground hover:bg-muted'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                    <m.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card/50 border border-border/50 rounded-xl overflow-hidden hover:bg-card/80 transition-colors"
                    >
                        <button
                            onClick={() => setExpandedFAQId(expandedFAQId === faq.id ? null : faq.id)}
                            className="w-full p-6 flex items-center justify-between text-left transition-colors"
                        >
                            <div className="flex-1">
                                <p className="font-semibold text-foreground text-lg leading-snug">
                                    {faq.question}
                                </p>
                                <p className="text-xs text-primary font-medium mt-2 uppercase tracking-wider">
                                    {faq.category}
                                </p>
                            </div>
                            <ChevronDown
                                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${expandedFAQId === faq.id ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {expandedFAQId === faq.id && (
                            <m.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-muted/30 border-t border-border/50 p-6"
                            >
                                <p className="text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </p>
                            </m.div>
                        )}
                    </m.div>
                ))}
            </div>
        </>
    );
}
