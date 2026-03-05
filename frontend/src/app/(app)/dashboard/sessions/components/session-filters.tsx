'use client';

import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { m } from 'framer-motion';

interface SessionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

export function SessionFilters({ searchQuery, onSearchChange, placeholder }: SessionFiltersProps) {
    return (
        <div className="flex flex-col gap-6 mb-8 w-full max-w-5xl" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group w-full"
            >
                {/* Visual glow effect on focus */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-primary/30 to-secondary/30 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />

                <div className="relative flex items-center">
                    <div className="absolute left-6 text-muted-foreground/40 group-focus-within:text-primary transition-colors duration-300">
                        <Search className="h-6 w-6" />
                    </div>

                    <Input
                        placeholder={placeholder || "Search by title, name, or expertise..."}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="h-18 pl-18 pr-8 bg-card/40 backdrop-blur-2xl border-border/40 rounded-full focus:ring-0 focus:border-primary/40 transition-all text-lg placeholder:text-muted-foreground/30 font-bold shadow-2xl shadow-black/10 group-hover:bg-card/60 group-hover:border-border/60"
                    />
                </div>
            </m.div>
        </div>
    );
}
