'use client';

import Link from 'next/link';
import { MessageSquare, ChevronRight, Users } from 'lucide-react';
import type { ForumCategory } from '@/types';

interface ForumCategoryCardProps {
    category: ForumCategory;
}

export function ForumCategoryCard({ category }: ForumCategoryCardProps) {
    return (
        <Link href={`/community/forum/category/${category.id}`}>
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1">
                {/* Gradient background accent */}
                <div
                    className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-300"
                    style={{ 
                        background: `linear-gradient(135deg, ${category.color} 0%, transparent 60%)`
                    }}
                />

                {/* Content */}
                <div className="relative z-10">
                    {/* Icon and Title */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                                {category.icon || <MessageSquare className="h-6 w-6" />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                                    {category.name}
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{category.thread_count} threads</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Arrow indicator */}
                        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {category.description}
                    </p>

                    {/* Bottom stats bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>{category.thread_count} discussions</span>
                            </div>
                        </div>
                        <span 
                            className="text-xs font-medium px-2 py-1 rounded-full"
                            style={{ backgroundColor: `${category.color}15`, color: category.color }}
                        >
                            View Forum
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

