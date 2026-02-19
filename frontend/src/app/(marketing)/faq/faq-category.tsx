'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    answer: string;
}

interface FAQCategoryProps {
    category: string;
    icon: React.ReactNode;
    questions: Question[];
}

export function FAQCategory({ category, icon, questions }: FAQCategoryProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{category}</h2>
            </div>
            <div className="space-y-3">
                {questions.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-card/50 border border-border/50 rounded-lg hover:border-primary/30 hover:bg-card/80 transition-all duration-200 cursor-pointer overflow-hidden"
                        onClick={() => toggleExpand(item.id)}
                    >
                        <div className="p-4 sm:p-6 flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">
                                {item.question}
                            </h3>
                            <ChevronDown
                                className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>
                        {expandedId === item.id && (
                            <div className="border-t border-border/50 bg-muted/30 px-4 sm:px-6 py-4 animate-in fade-in duration-200">
                                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                                    {item.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
