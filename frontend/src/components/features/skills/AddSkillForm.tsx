'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Loader2 } from 'lucide-react'
import { useSkillStore } from '@/stores'
import { toast } from 'sonner'
import type { CreateUserSkillRequest, SkillLevel } from '@/types'

const addSkillSchema = z.object({
    skill_id: z.number().min(1, 'Pilih skill yang ingin diajarkan'),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
    years_of_experience: z.number().min(0, 'Pengalaman tidak boleh negatif'),
    proof_url: z.string().url('URL harus valid').optional().or(z.literal('')),
    proof_type: z.string().optional(),
    hourly_rate: z.number().min(0, 'Rate harus non-negatif').max(10, 'Rate maksimal 10 credits per jam'),
    online_only: z.boolean(),
    offline_only: z.boolean(),
    is_available: z.boolean(),
})

type AddSkillForm = z.infer<typeof addSkillSchema>

export default function AddSkillForm() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addUserSkill, skills, fetchSkills } = useSkillStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<AddSkillForm>({
        resolver: zodResolver(addSkillSchema),
        defaultValues: {
            level: 'beginner',
            years_of_experience: 0,
            hourly_rate: 1.0,
            online_only: false,
            offline_only: false,
            is_available: true,
            proof_url: '',
            proof_type: ''
        }
    })

    // Load skills if empty
    React.useEffect(() => {
        if (skills.length === 0) {
            fetchSkills()
        }
    }, [skills.length, fetchSkills])

    const onSubmit = async (data: AddSkillForm) => {
        try {
            setIsSubmitting(true)
            
            const skillData: CreateUserSkillRequest = {
                ...data,
                proof_url: data.proof_url || '',
                proof_type: data.proof_type || 'other'
            }
            
            await addUserSkill(skillData)
            
            toast.success('Skill berhasil ditambahkan!')
            reset()
            setOpen(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menambahkan skill')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedLevel = watch('level')
    const onlineOnly = watch('online_only')
    const offlineOnly = watch('offline_only')

    const levelDescriptions: Record<SkillLevel, string> = {
        beginner: 'Dapat mengajar dasar-dasar dan konsep fundamental',
        intermediate: 'Dapat mengajar topik menengah dan aplikasi praktis', 
        advanced: 'Dapat mengajar topik kompleks dan teknik lanjutan',
        expert: 'Dapat mengajar semua level termasuk riset dan inovasi'
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Skill
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Skill Mengajar</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Skill Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="skill_id">Pilih Skill *</Label>
                        <Select onValueChange={(value) => setValue('skill_id', parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih skill yang ingin diajarkan" />
                            </SelectTrigger>
                            <SelectContent>
                                {skills.map((skill) => (
                                    <SelectItem key={skill.id} value={skill.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <span>{skill.icon}</span>
                                            <span>{skill.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({skill.category})
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.skill_id && (
                            <p className="text-sm text-destructive">{errors.skill_id.message}</p>
                        )}
                    </div>

                    {/* Level & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="level">Level Kemampuan *</Label>
                            <Select onValueChange={(value) => setValue('level', value as SkillLevel)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">🌱 Beginner</SelectItem>
                                    <SelectItem value="intermediate">📈 Intermediate</SelectItem>
                                    <SelectItem value="advanced">🚀 Advanced</SelectItem>
                                    <SelectItem value="expert">👑 Expert</SelectItem>
                                </SelectContent>
                            </Select>
                            {selectedLevel && (
                                <p className="text-xs text-muted-foreground">
                                    {levelDescriptions[selectedLevel]}
                                </p>
                            )}
                            {errors.level && (
                                <p className="text-sm text-destructive">{errors.level.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="years_of_experience">Pengalaman (tahun)</Label>
                            <Input
                                id="years_of_experience"
                                type="number"
                                min="0"
                                max="50"
                                {...register('years_of_experience', { valueAsNumber: true })}
                            />
                            {errors.years_of_experience && (
                                <p className="text-sm text-destructive">{errors.years_of_experience.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Kemampuan *</Label>
                        <Textarea
                            id="description"
                            placeholder="Jelaskan apa yang bisa Anda ajarkan, metode mengajar, dan keahlian khusus Anda..."
                            rows={4}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Proof & Rate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="proof_url">URL Portofolio/Sertifikat</Label>
                            <Input
                                id="proof_url"
                                type="url"
                                placeholder="https://..."
                                {...register('proof_url')}
                            />
                            {errors.proof_url && (
                                <p className="text-sm text-destructive">{errors.proof_url.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hourly_rate">Rate per Jam (Credits) *</Label>
                            <Input
                                id="hourly_rate"
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                {...register('hourly_rate', { valueAsNumber: true })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Standar: 1.0 credit = 1 jam. Rate tinggi untuk skill khusus.
                            </p>
                            {errors.hourly_rate && (
                                <p className="text-sm text-destructive">{errors.hourly_rate.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Mode & Availability */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Preferensi Mengajar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="online_only"
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        {...register('online_only')}
                                        disabled={offlineOnly}
                                    />
                                    <Label htmlFor="online_only">Hanya Online</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="offline_only"
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        {...register('offline_only')}
                                        disabled={onlineOnly}
                                    />
                                    <Label htmlFor="offline_only">Hanya Offline</Label>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="is_available"
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    {...register('is_available')}
                                />
                                <Label htmlFor="is_available">Tersedia untuk mengajar</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tambah Skill
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
