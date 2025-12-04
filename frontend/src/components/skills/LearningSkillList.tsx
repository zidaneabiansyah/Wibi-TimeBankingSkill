'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Plus,
    Trash2,
    Star,
    TrendingUp,
    BookOpen,
    Target,
    Loader2
} from 'lucide-react'
import { useSkillStore } from '@/stores'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { CreateLearningSkillRequest, SkillLevel } from '@/types'

const addLearningSkillSchema = z.object({
    skill_id: z.number().min(1, 'Please select a skill'),
    desired_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    priority: z.number().min(1).max(5),
    notes: z.string().optional()
})

type AddLearningSkillForm = z.infer<typeof addLearningSkillSchema>

function AddLearningSkillForm() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { skills, fetchSkills, addLearningSkill } = useSkillStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<AddLearningSkillForm>({
        resolver: zodResolver(addLearningSkillSchema),
        defaultValues: {
            desired_level: 'beginner',
            priority: 3,
            notes: ''
        }
    })

    React.useEffect(() => {
        if (skills.length === 0) {
            fetchSkills()
        }
    }, [skills.length, fetchSkills])

    const onSubmit = async (data: AddLearningSkillForm) => {
        try {
            setIsSubmitting(true)
            
            const skillData: CreateLearningSkillRequest = {
                skill_id: data.skill_id,
                desired_level: data.desired_level,
                priority: data.priority,
                notes: data.notes || ''
            }
            
            await addLearningSkill(skillData)
            toast.success('Learning goal added successfully!')
            reset()
            setOpen(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add learning goal')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedPriority = watch('priority')
    const priorityLabels = {
        1: { label: 'Low Priority', color: 'bg-gray-100 text-gray-800', emoji: '⚪' },
        2: { label: 'Nice to Have', color: 'bg-blue-100 text-blue-800', emoji: '🔵' },
        3: { label: 'Important', color: 'bg-yellow-100 text-yellow-800', emoji: '🟡' },
        4: { label: 'High Priority', color: 'bg-orange-100 text-orange-800', emoji: '🟠' },
        5: { label: 'Critical', color: 'bg-red-100 text-red-800', emoji: '🔴' }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Learning Goal
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Learning Goal</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Skill Selection */}
                    <div className="space-y-2">
                        <Label>Skill to Learn *</Label>
                        <Select onValueChange={(value) => setValue('skill_id', parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a skill you want to learn" />
                            </SelectTrigger>
                            <SelectContent>
                                {skills.map((skill) => (
                                    <SelectItem key={skill.id} value={skill.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <span>{skill.icon}</span>
                                            <span>{skill.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.skill_id && (
                            <p className="text-sm text-destructive">{errors.skill_id.message}</p>
                        )}
                    </div>

                    {/* Desired Level */}
                    <div className="space-y-2">
                        <Label>Target Level *</Label>
                        <Select onValueChange={(value) => setValue('desired_level', value as SkillLevel)}>
                            <SelectTrigger>
                                <SelectValue placeholder="What level do you want to reach?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beginner">🌱 Beginner</SelectItem>
                                <SelectItem value="intermediate">📈 Intermediate</SelectItem>
                                <SelectItem value="advanced">🚀 Advanced</SelectItem>
                                <SelectItem value="expert">👑 Expert</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.desired_level && (
                            <p className="text-sm text-destructive">{errors.desired_level.message}</p>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <Label>Priority Level *</Label>
                        <Select 
                            onValueChange={(value) => setValue('priority', parseInt(value))}
                            defaultValue="3"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(priorityLabels).map(([value, { label, emoji }]) => (
                                    <SelectItem key={value} value={value}>
                                        <div className="flex items-center gap-2">
                                            <span>{emoji}</span>
                                            <span>{label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="text-xs text-muted-foreground">
                            {priorityLabels[selectedPriority as keyof typeof priorityLabels]?.label}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                            placeholder="Why do you want to learn this? Any specific goals or timeline?"
                            rows={3}
                            {...register('notes')}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Goal
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface LearningSkillListProps {
    title?: string
    showAddButton?: boolean
}

export default function LearningSkillList({
    title = "My Learning Wishlist",
    showAddButton = true
}: LearningSkillListProps) {
    const {
        learningSkills,
        isLoadingLearningSkills,
        error,
        fetchLearningSkills,
        deleteLearningSkill
    } = useSkillStore()

    useEffect(() => {
        fetchLearningSkills()
    }, [fetchLearningSkills])

    const handleDelete = async (skillId: number) => {
        if (confirm('Remove this skill from your learning wishlist?')) {
            try {
                await deleteLearningSkill(skillId)
                toast.success('Removed from learning wishlist')
            } catch (error) {
                toast.error('Failed to remove skill')
            }
        }
    }

    const getPriorityBadge = (priority: number) => {
        const priorityConfig = {
            1: { label: 'Low', color: 'bg-gray-100 text-gray-800', emoji: '⚪' },
            2: { label: 'Nice', color: 'bg-blue-100 text-blue-800', emoji: '🔵' },
            3: { label: 'Important', color: 'bg-yellow-100 text-yellow-800', emoji: '🟡' },
            4: { label: 'High', color: 'bg-orange-100 text-orange-800', emoji: '🟠' },
            5: { label: 'Critical', color: 'bg-red-100 text-red-800', emoji: '🔴' }
        }
        
        const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig[3]
        return (
            <Badge className={`text-xs ${config.color}`}>
                {config.emoji} {config.label}
            </Badge>
        )
    }

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'beginner': return '🌱'
            case 'intermediate': return '📈'
            case 'advanced': return '🚀'
            case 'expert': return '👑'
            default: return '📖'
        }
    }

    if (isLoadingLearningSkills) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">{error}</p>
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => fetchLearningSkills()}
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {title}
                </CardTitle>
                {showAddButton && <AddLearningSkillForm />}
            </CardHeader>
            <CardContent>
                {learningSkills.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-lg font-semibold mb-2">No Learning Goals Yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Start building your learning wishlist to track skills you want to master.
                        </p>
                        {showAddButton && <AddLearningSkillForm />}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {learningSkills.map((learningSkill) => (
                            <Card key={learningSkill.id} className="border-l-4 border-l-primary/50">
                                <CardContent className="pt-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="text-2xl">{learningSkill.skill.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-lg mb-1">
                                                    {learningSkill.skill.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {getLevelIcon(learningSkill.desired_level)} Target: {learningSkill.desired_level}
                                                    </Badge>
                                                    {getPriorityBadge(learningSkill.priority)}
                                                </div>
                                                {learningSkill.notes && (
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        {learningSkill.notes}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="w-3 h-3" />
                                                        <span>Added {new Date(learningSkill.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" />
                                                        <span>{learningSkill.skill.total_teachers} teachers available</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-1 ml-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toast.info('Find teachers feature coming soon!')}
                                            >
                                                Find Teachers
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(learningSkill.skill_id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
