'use client';

import { TemplateList } from '@/components/template';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { FileText, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplateForm } from '@/components/template/TemplateForm';

function TemplatesContent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Session Templates</h1>
                        </div>
                        <p className="text-muted-foreground ml-8">
                            Create and manage reusable session configurations for faster skill sharing.
                        </p>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button 
                            className="flex-1 md:flex-none gap-2 rounded-full"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            New Template
                        </Button>
                        <Link href="/profile" className="flex-1 md:flex-none">
                            <Button variant="ghost" className="w-full gap-2">
                                <ExternalLink className="h-4 w-4" />
                                My Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-card/50 border border-border/40 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                    <TemplateList />
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Template</DialogTitle>
                        </DialogHeader>
                        <TemplateForm onSuccess={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}

export default function TemplatesPage() {
    return (
        <ProtectedRoute>
            <TemplatesContent />
        </ProtectedRoute>
    );
}
