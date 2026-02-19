import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Zap, TrendingUp, Shield, Users, Lock } from 'lucide-react';
import { FAQCategory } from './faq-category';

export const metadata: Metadata = {
    title: 'FAQ - Frequently Asked Questions | Wibi',
    description: 'Find answers to common questions about Wibi Time Banking. Learn about credits, sessions, safety, and how to get started.',
    keywords: ['wibi faq', 'time banking questions', 'how to use wibi', 'wibi help', 'common questions'],
    openGraph: {
        title: 'Wibi FAQ - Get Your Questions Answered',
        description: 'Everything you need to know about using Wibi Time Banking platform.',
        images: ['/wibi.png'],
    },
};

const categoryIcons = {
    'Getting Started': HelpCircle,
    'Skills & Teaching': Zap,
    'Sessions & Learning': TrendingUp,
    'Credits & Transactions': Shield,
    'Reviews & Ratings': Users,
    'Safety & Community': Lock,
};

const faqData = [
    {
        category: 'Getting Started',
        questions: [
            {
                id: 'gs-1',
                question: 'How do I create an account on Wibi?',
                answer: 'Creating an account is simple! Click the "Sign Up" button on the homepage, fill in your email, password, and basic information. You\'ll receive a confirmation email to verify your account. Once verified, you can start exploring the platform.',
            },
            {
                id: 'gs-2',
                question: 'Is there a cost to join Wibi?',
                answer: 'No! Wibi is completely free to join. There are no membership fees, subscription costs, or hidden charges. You only exchange time credits for skills.',
            },
            {
                id: 'gs-3',
                question: 'How many credits do I start with?',
                answer: 'New users start with 3 free time credits. This gives you enough to book your first session and get a feel for how the platform works.',
            },
            {
                id: 'gs-4',
                question: 'What is a time credit?',
                answer: 'A time credit represents one hour of service. Whether you\'re teaching calculus or guitar, one hour = one credit. This makes the system fair and equal for everyone.',
            },
        ],
    },
    {
        category: 'Skills & Teaching',
        questions: [
            {
                id: 'st-1',
                question: 'What skills can I teach?',
                answer: 'You can teach any skill you\'re knowledgeable about! This includes academic subjects (math, languages, science), hobbies (music, art, sports), technical skills (programming, design), and more. Be honest about your expertise level.',
            },
            {
                id: 'st-2',
                question: 'How do I add a skill I can teach?',
                answer: 'Go to your profile, click "Add New Skill," select from our skill categories, set your proficiency level, and add a description of what you can teach. You can add as many skills as you want.',
            },
            {
                id: 'st-3',
                question: 'Can I edit or delete my skills?',
                answer: 'Yes! You can edit your skill descriptions, availability, and other details anytime. You can also mark skills as unavailable if you\'re temporarily unable to teach them.',
            },
            {
                id: 'st-4',
                question: 'How do I earn credits?',
                answer: 'You earn credits by teaching other students. When you complete a session as a teacher, you receive time credits equal to the session duration. For example, a 1-hour session = 1 credit earned.',
            },
        ],
    },
    {
        category: 'Sessions & Learning',
        questions: [
            {
                id: 'sl-1',
                question: 'How do I book a session?',
                answer: 'Browse the marketplace, find a skill you want to learn, select a tutor, and click "Request Session." Specify your preferred date, time, duration, and whether you want online or in-person. The tutor will review and approve your request.',
            },
            {
                id: 'sl-2',
                question: 'Can I choose between online and in-person sessions?',
                answer: 'Yes! When booking a session, you can specify your preference. Some tutors may offer both options, while others might specialize in one. Check the tutor\'s profile for their available session types.',
            },
            {
                id: 'sl-3',
                question: 'What happens if I need to cancel a session?',
                answer: 'You can cancel sessions up to 24 hours before the scheduled time. Your credits will be refunded. Cancellations within 24 hours may result in credit loss depending on the tutor\'s policy.',
            },
            {
                id: 'sl-4',
                question: 'How long are sessions?',
                answer: 'Sessions can be any duration you and the tutor agree on. Most sessions are 1-2 hours, but you can book shorter or longer sessions based on your needs and the tutor\'s availability.',
            },
        ],
    },
    {
        category: 'Credits & Transactions',
        questions: [
            {
                id: 'ct-1',
                question: 'Do credits expire?',
                answer: 'No! Your time credits never expire. You can save them for as long as you want and use them whenever you\'re ready to book a session.',
            },
            {
                id: 'ct-2',
                question: 'What happens if I run out of credits?',
                answer: 'If you run out of credits, you can\'t book new sessions until you earn more by teaching. Consider listing a skill you can teach to earn credits quickly.',
            },
            {
                id: 'ct-3',
                question: 'Can I see my transaction history?',
                answer: 'Yes! Go to your dashboard and click "Transaction History" to see all your credit transactions. You can see when you earned or spent credits and the reason for each transaction.',
            },
            {
                id: 'ct-4',
                question: 'What if there\'s a dispute about credits?',
                answer: 'If there\'s a disagreement about a session or credits, you can report it through the platform. Our support team will review the case and make a fair decision based on session details and reviews.',
            },
        ],
    },
    {
        category: 'Reviews & Ratings',
        questions: [
            {
                id: 'rr-1',
                question: 'How does the rating system work?',
                answer: 'After each session, both the tutor and student can rate each other on a scale of 1-5 stars and leave written reviews. These ratings help build trust in the community.',
            },
            {
                id: 'rr-2',
                question: 'Can I see reviews before booking?',
                answer: 'Absolutely! You can view a tutor\'s average rating, number of reviews, and read individual reviews from past students. This helps you make an informed decision.',
            },
            {
                id: 'rr-3',
                question: 'What if I receive a bad review?',
                answer: 'You can respond to reviews and explain your perspective. If you believe a review is unfair or violates our guidelines, you can report it to our support team.',
            },
            {
                id: 'rr-4',
                question: 'Are reviews anonymous?',
                answer: 'No, reviews show the reviewer\'s name and profile. This ensures accountability and helps build a trustworthy community.',
            },
        ],
    },
    {
        category: 'Safety & Community',
        questions: [
            {
                id: 'sc-1',
                question: 'Is my personal information safe?',
                answer: 'Yes! We take privacy seriously. Your personal information is encrypted and only shared with tutors/students you interact with. We never sell your data to third parties.',
            },
            {
                id: 'sc-2',
                question: 'What should I do if I feel unsafe?',
                answer: 'Your safety is our priority. If you feel unsafe or uncomfortable, you can block users, report them, and contact our support team immediately. We have community guidelines to keep everyone safe.',
            },
            {
                id: 'sc-3',
                question: 'Are there community guidelines?',
                answer: 'Yes! All users must follow our community guidelines which promote respect, honesty, and safety. Violations can result in warnings or account suspension.',
            },
            {
                id: 'sc-4',
                question: 'How do I report inappropriate behavior?',
                answer: 'You can report users or sessions through the platform. Click the report button on their profile or session, describe the issue, and our team will investigate.',
            },
        ],
    },
];

export default function FAQPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24 lg:py-28 bg-linear-to-b from-background to-muted/30">
                <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 text-primary bg-primary/5">
                            FAQ
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </h1>
                        <p className="max-w-175 text-muted-foreground text-lg md:text-xl">
                            Find answers to common questions about Wibi, Time Banking, and how to get started.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="w-full py-16 md:py-24 lg:py-28 bg-background">
                <div className="mx-auto max-w-4xl px-6 sm:px-12 lg:px-16">
                    <div className="space-y-12">
                        {faqData.map((category) => {
                            const Icon = categoryIcons[category.category as keyof typeof categoryIcons];
                            return (
                                <FAQCategory
                                    key={category.category}
                                    category={category.category}
                                    icon={<Icon className="h-5 w-5" />}
                                    questions={category.questions}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden border-t border-border/40 bg-muted/30">
                <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Still Have <span className="text-primary">Questions</span>?
                        </h2>
                        <p className="mx-auto max-w-150 text-muted-foreground text-lg">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/contact">
                                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                    Contact Support
                                </Button>
                            </Link>
                            <Link href="/community/forum">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-border hover:bg-muted">
                                    Join Community Forum
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
