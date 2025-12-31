'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateStoryForm } from '@/components/community/CreateStoryForm';

export default function CreateStoryPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="w-full max-w-3xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
                    <h1 className="text-2xl font-bold mb-6">Share Your Success Story</h1>
                    <p className="text-muted-foreground mb-8">
                        inspire the community by sharing your learning or teaching journey.
                    </p>

                    <CreateStoryForm onSuccess={() => router.push('/community/stories')} />
                </div>
            </div>
        </div>
    );
}
