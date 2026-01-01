import { Metadata } from 'next';
import { BadgeCollection } from '@/components/badge/BadgeCollection';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LeaderboardTabs } from '@/components/badge/LeaderboardTabs';

export const metadata: Metadata = {
    title: 'Badges & Leaderboard | Wibi',
    description: 'View your badges and compete on leaderboards',
};

/**
 * Badges page - displays user badges and leaderboards
 */
export default function BadgesPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8 space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold">🎮 Gamification</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Earn badges, climb leaderboards, and showcase your achievements
                    </p>
                </div>

                {/* Badges Section */}
                <section className="space-y-6">
                    <BadgeCollection showPin={true} />
                </section>

                {/* Divider */}
                <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

                {/* Leaderboards Section Link */}
                <section className="bg-primary/5 rounded-2xl p-8 md:p-12 border border-primary/10 text-center space-y-6">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary mb-2">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <h2 className="text-3xl font-bold italic">Community Leaderboard</h2>
                        <p className="text-muted-foreground">
                            Lihat siapa yang memimpin komunitas hari ini. Bersainglah dalam kategori Badges, Rarity, Sessions, Rating, dan Credits.
                        </p>
                        <Button size="lg" className="rounded-full px-8 gap-2" asChild>
                            <Link href="/leaderboard">
                                View Full Leaderboard
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Info Section */}
                <section className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-2">🏆 Achievement Badges</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Earn badges by completing sessions, maintaining high ratings, and reaching milestones.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-2">📊 Leaderboards</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Compete with other users across different categories and earn recognition.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold mb-2">💎 Rarity Levels</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Badges have different rarity levels. Collect rare badges to show off your skills!
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
