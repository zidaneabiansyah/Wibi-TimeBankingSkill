import type { Metadata } from 'next';
import { MessageSquare, BookOpen, Award, Trophy } from 'lucide-react';
import { CommunityClient } from './community-client';

export const metadata: Metadata = {
    title: 'Community Hub - Connect & Learn Together | Wibi',
    description: 'Join the Wibi community. Participate in forums, read success stories, earn endorsements, and compete on leaderboards.',
    keywords: ['wibi community', 'student forum', 'success stories', 'leaderboard', 'peer learning community'],
    openGraph: {
        title: 'Wibi Community Hub',
        description: 'Connect, learn, and grow together with our vibrant community of learners and mentors.',
        images: ['/wibi.png'],
    },
};

const sections = [
    {
        icon: 'MessageSquare',
        title: 'Forum',
        description: 'Join discussions and share knowledge with the community',
        href: '/community/forum',
        color: 'from-blue-500 to-blue-600',
    },
    {
        icon: 'BookOpen',
        title: 'Success Stories',
        description: 'Read inspiring stories from our community members',
        href: '/community/stories',
        color: 'from-purple-500 to-purple-600',
    },
    {
        icon: 'Award',
        title: 'Endorsements',
        description: 'Get recognized for your skills by peers',
        href: '/community/endorsements',
        color: 'from-amber-500 to-amber-600',
    },
];

const stats = [
    { value: '1000+', label: 'Active Members' },
    { value: '500+', label: 'Forum Discussions' },
    { value: '200+', label: 'Success Stories' },
];

export default function CommunityPage() {
    return <CommunityClient sections={sections} stats={stats} />;
}
