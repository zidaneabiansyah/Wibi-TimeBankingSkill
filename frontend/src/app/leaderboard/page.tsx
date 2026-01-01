'use client';

import { Metadata } from 'next';
import { LeaderboardTabs } from '@/components/badge/LeaderboardTabs';
import { Header, Footer } from '@/components/layout';
import { motion } from 'framer-motion';
import { Trophy, Target, Star, TrendingUp } from 'lucide-react';

/**
 * Leaderboard page - dedicated view for community rankings
 */
export default function LeaderboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            
            <main className="flex-1">
                <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                    <div className="container mx-auto px-4 py-8 space-y-12">
                        {/* Hero Section */}
                        <motion.div 
                            className="text-center space-y-4 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Community Rankings</h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                Bersaing dengan pengguna lain, kumpulkan badge, dan tunjukkan pencapaianmu di komunitas Wibi.
                            </p>
                        </motion.div>

                        {/* Leaderboards Content */}
                        <motion.section 
                            className="max-w-5xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <LeaderboardTabs limit={20} />
                        </motion.section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
