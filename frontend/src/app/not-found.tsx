import { NotFoundDisplay } from '@/components/ui/error-display';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 - Page Not Found | Wibi',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <NotFoundDisplay message="The page you're looking for doesn't exist or has been moved." />
        </div>
    );
}
