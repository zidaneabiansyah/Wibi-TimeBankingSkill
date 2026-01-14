'use client';

import { TemplateList } from '@/components/template';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';

export default function TemplatesPage() {
    return (
        <div className="container py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-4">
                <Link href="/profile">
                    <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Profile
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Session Templates</h1>
                        <p className="text-muted-foreground">
                            Manage reusable configurations for your teaching sessions.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-border/50" />

            {/* List */}
            <TemplateList />
        </div>
    );
}
