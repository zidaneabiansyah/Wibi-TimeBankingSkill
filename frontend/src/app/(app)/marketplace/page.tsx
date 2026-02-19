import type { Metadata } from 'next';
import { MarketplaceClient } from './marketplace-client';

export const metadata: Metadata = {
    title: 'Skill Marketplace - Discover & Learn | Wibi',
    description: 'Browse 100+ skills taught by experienced tutors. Find the perfect teacher for mathematics, programming, languages, and more. Exchange time credits for knowledge.',
    keywords: ['skill marketplace', 'find tutors', 'learn skills', 'time banking', 'peer learning'],
    openGraph: {
        title: 'Skill Marketplace - Wibi',
        description: 'Discover skills taught by our community. Exchange time for knowledge.',
        images: ['/wibi.png'],
    },
};

// Server Component - handles initial data and SEO
export default async function MarketplacePage() {
    // TODO: Fetch initial skills data server-side for better SEO
    // const initialSkills = await fetchSkillsServer();

    return <MarketplaceClient />;
}
