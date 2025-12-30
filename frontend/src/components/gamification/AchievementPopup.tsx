'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBadgeStore } from '@/stores'
import { Badge } from '@/components/ui/badge'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

export default function AchievementPopup() {
    const { newBadges, clearNewBadges } = useBadgeStore()
    const { width, height } = useWindowSize()
    const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0)

    useEffect(() => {
        if (newBadges.length > 0) {
            // Play sound effect here if desired
            const audio = new Audio('/sounds/achievement.mp3')
            audio.volume = 0.5
            audio.play().catch(() => { }) // Ignore auto-play errors
        }
    }, [newBadges])

    const handleDismiss = () => {
        if (currentBadgeIndex < newBadges.length - 1) {
            setCurrentBadgeIndex(prev => prev + 1)
        } else {
            clearNewBadges()
            setCurrentBadgeIndex(0)
        }
    }

    if (newBadges.length === 0) return null

    const badge = newBadges[currentBadgeIndex]?.badge
    if (!badge) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.15}
                />

                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: -50 }}
                    className="bg-card border-2 border-yellow-400 shadow-2xl rounded-xl p-8 max-w-sm w-full text-center pointer-events-auto relative overflow-hidden"
                >
                    {/* Background Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-transparent animate-pulse" />

                    <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="text-6xl mb-4 inline-block drop-shadow-lg"
                    >
                        {badge.icon}
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent"
                    >
                        Badge Unlocked!
                    </motion.h2>

                    <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl font-semibold mb-2"
                    >
                        {badge.name}
                    </motion.h3>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-muted-foreground mb-6"
                    >
                        {badge.description}
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className="flex justify-center gap-2 mb-6">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                +{badge.bonus_credits} Credits
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                                {badge.rarity} Rarity
                            </Badge>
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="bg-primary text-primary-foreground px-8 py-2 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-primary/25"
                        >
                            {currentBadgeIndex < newBadges.length - 1 ? 'Next Badge' : 'Awesome!'}
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
