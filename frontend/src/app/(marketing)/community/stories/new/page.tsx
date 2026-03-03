'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateStoryForm } from '@/components/features/community/CreateStoryForm';

export default function CreateStoryPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 px-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <div className="w-full max-w-3xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-foreground hover:bg-muted">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                    <h1 className="text-2xl font-bold mb-6 text-foreground">Share Your Success Story</h1>
                    <p className="text-muted-foreground mb-8 text-[15px]">
                        Inspire the community by sharing your learning or teaching journey.
                    </p>

                    <CreateStoryForm onSuccess={() => router.push('/community/stories')} />
                </div>
            </div>
        </div>
    );
}
