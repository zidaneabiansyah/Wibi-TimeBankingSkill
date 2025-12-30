'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth'
import { progressService } from '@/lib/services/progress.service'
import { toast } from 'sonner'
import { 
    ArrowLeft, 
    BookOpen, 
    Clock, 
    Target, 
    TrendingUp, 
    Award,
    CheckCircle2,
    Circle,
    Loader2,
    GraduationCap
} from 'lucide-react'
import type { ProgressSummary, SkillProgress, Milestone } from '@/types'
import { ProgressMilestones } from '@/components/skills/ProgressMilestones';

// Progress bar component
function ProgressBar({ value, max = 100, className = '' }: { value: number; max?: number; className?: string }) {
    const percentage = Math.min((value / max) * 100, 100)
    return (
        <div className={`w-full bg-muted rounded-full h-3 overflow-hidden ${className}`}>
            <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}

// Skill card component
function SkillProgressCard({ progress }: { progress: SkillProgress }) {
    const levelColors: Record<string, string> = {
        beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
        expert: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{progress.skill_name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            {progress.total_hours_spent.toFixed(1)} hours spent
                        </CardDescription>
                    </div>
                    <Badge className={levelColors[progress.current_level] || 'bg-gray-100'}>
                        {progress.current_level}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress.progress_percentage.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={progress.progress_percentage} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{progress.sessions_completed} sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{progress.milestones?.filter(m => m.is_achieved).length || 0} milestones</span>
                    </div>
                </div>

                {/* Milestones */}
                {progress.milestones && progress.milestones.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">Milestones</p>
                            <span className="text-xs text-muted-foreground">
                                {progress.milestones.filter(m => m.is_achieved).length}/{progress.milestones.length} Achieved
                            </span>
                        </div>
                        <ProgressMilestones 
                            milestones={progress.milestones} 
                            currentProgress={progress.progress_percentage} 
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function ProgressContent() {
    const router = useRouter()
    const [summary, setSummary] = useState<ProgressSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                setIsLoading(true)
                const data = await progressService.getUserProgress()
                setSummary(data)
            } catch (error) {
                console.error('Failed to load progress:', error)
                toast.error('Failed to load progress data')
            } finally {
                setIsLoading(false)
            }
        }
        fetchProgress()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading your progress...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        Skill Progress Tracking
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track your learning journey and see how far you've come
                    </p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Skills Learning</p>
                                    <p className="text-3xl font-bold">{summary?.total_skills_learning || 0}</p>
                                </div>
                                <BookOpen className="h-10 w-10 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Average Progress</p>
                                    <p className="text-3xl font-bold">{(summary?.average_progress || 0).toFixed(0)}%</p>
                                </div>
                                <TrendingUp className="h-10 w-10 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total Hours</p>
                                    <p className="text-3xl font-bold">{(summary?.total_hours_spent || 0).toFixed(1)}</p>
                                </div>
                                <Clock className="h-10 w-10 opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Skills Progress Grid */}
                {summary?.skills_progresses && summary.skills_progresses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summary.skills_progresses.map((progress) => (
                            <SkillProgressCard key={progress.id} progress={progress} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No progress yet</p>
                                <p className="mt-1">Start learning skills to track your progress here!</p>
                                <Button className="mt-4" onClick={() => router.push('/marketplace')}>
                                    Browse Skills
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}

export default function ProgressPage() {
    return (
        <ProtectedRoute>
            <ProgressContent />
        </ProtectedRoute>
    )
}
