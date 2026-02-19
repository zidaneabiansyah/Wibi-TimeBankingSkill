import type { Metadata } from 'next';
import { FavoritesClient } from './favorites-client';

export const metadata: Metadata = {
    title: 'Favorite Teachers - My Favorites | Wibi',
    description: 'View and manage your favorite teachers on Wibi Time Banking.',
    keywords: ['favorites', 'favorite teachers', 'bookmarks', 'saved teachers'],
};

export default function FavoritesPage() {
    return <FavoritesClient />;
}
