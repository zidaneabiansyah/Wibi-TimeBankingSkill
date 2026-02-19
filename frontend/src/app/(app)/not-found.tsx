import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { FileQuestion } from 'lucide-react';

export default function AppNotFound() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
                <div className="flex max-w-md flex-col items-center gap-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <FileQuestion className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Page Not Found</h2>
                        <p className="text-muted-foreground">
                            The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard">
                            <Button>Go to Dashboard</Button>
                        </Link>
                        <Link href="/marketplace">
                            <Button variant="outline">Browse Skills</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
