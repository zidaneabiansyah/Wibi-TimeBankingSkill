'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { LoadingSpinner } from '@/components/ui/loading';

function SkillsRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get skill ID from query if present (e.g., ?skill=123)
    const skillId = searchParams.get('skill');

    useEffect(() => {
        // Redirect to the actual add skill page
        // If a skill ID is provided, we could potentially pre-select it
        if (skillId) {
            router.replace(`/profile/skills/new?skill=${skillId}`);
        } else {
            router.replace('/profile/skills/new');
        }
    }, [router, skillId]);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-muted-foreground">Redirecting to add skill page...</p>
                </div>
            </main>
        </div>
    );
}

export default function DashboardSkillsPage() {
    return (
        <ProtectedRoute>
            <SkillsRedirectContent />
        </ProtectedRoute>
    );
}
