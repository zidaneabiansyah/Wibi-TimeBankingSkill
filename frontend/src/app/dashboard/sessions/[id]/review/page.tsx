'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { useSessionStore } from '@/stores/session.store';
import ReviewForm from '@/components/review/ReviewForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

function CreateReviewContent() {
    const params = useParams();
    const router = useRouter();
    const sessionId = Number(params.id);
    const { currentSession, fetchSession, isLoading } = useSessionStore();

    useEffect(() => {
        if (sessionId) {
            fetchSession(sessionId);
        }
    }, [sessionId, fetchSession]);

    const handleSuccess = () => {
        router.push('/dashboard/sessions');
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading && !currentSession) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentSession) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Session Not Found</CardTitle>
                            <CardDescription>The session you are looking for does not exist.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => router.push('/dashboard/sessions')}>Back to Sessions</Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    // Verify session is completed
    if (currentSession.status !== 'completed') {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cannot Review Session</CardTitle>
                            <CardDescription>You can only review sessions that have been completed.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => router.back()}>Go Back</Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-6">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={handleCancel}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <h1 className="text-2xl font-bold mt-2">Rate your Session</h1>
                    <p className="text-muted-foreground">
                        How was your experience with {currentSession.teacher?.full_name}?
                    </p>
                </div>

                <ReviewForm 
                    session={currentSession} 
                    onSuccess={handleSuccess} 
                    onCancel={handleCancel} 
                />
            </main>
        </div>
    );
}

export default function CreateReviewPage() {
    return (
        <ProtectedRoute>
            <CreateReviewContent />
        </ProtectedRoute>
    );
}
