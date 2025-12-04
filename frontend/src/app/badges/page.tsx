import { Metadata } from 'next';
import { BadgeCollection } from '@/components/badge/BadgeCollection';
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

                {/* Leaderboards Section */}
                <section className="space-y-6">
                    <LeaderboardTabs limit={10} />
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
