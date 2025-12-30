'use client';

import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { AvailabilityForm } from '@/components/profile/AvailabilityForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CalendarDays } from 'lucide-react';

function AvailabilityContent() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex flex-col space-y-6">
                    {/* Breadcrumb / Back button */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Page Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <CalendarDays className="h-8 w-8 text-primary" />
                                Teaching Availability
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Set your weekly schedule to let students know when you're available for sessions.
                            </p>
                        </div>
                    </div>

                    {/* Availability Form */}
                    <div className="mt-6">
                        <AvailabilityForm />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AvailabilityPage() {
    return (
        <ProtectedRoute>
            <AvailabilityContent />
        </ProtectedRoute>
    );
}
