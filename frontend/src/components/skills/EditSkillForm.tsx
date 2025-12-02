'use client'

import React, { useState, useEffect } from 'react'
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
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useSkillStore } from '@/store/useSkillStore'
import { toast } from 'sonner'
import type { UpdateUserSkillRequest, SkillLevel, UserSkill } from '@/types'

const editSkillSchema = z.object({
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    description: z.string().min(10, 'Deskripsi minimal 10 karakter').optional(),
    years_of_experience: z.number().min(0, 'Pengalaman tidak boleh negatif').optional(),
    proof_url: z.string().url('URL harus valid').optional().or(z.literal('')),
    proof_type: z.string().optional(),
    hourly_rate: z.number().min(0, 'Rate harus non-negatif').max(10, 'Rate maksimal 10 credits per jam').optional(),
    online_only: z.boolean().optional(),
    offline_only: z.boolean().optional(),
    is_available: z.boolean().optional(),
})

type EditSkillForm = z.infer<typeof editSkillSchema>

interface EditSkillFormProps {
    skill: UserSkill
    open: boolean
    onClose: () => void
}

export default function EditSkillForm({ skill, open, onClose }: EditSkillFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { updateUserSkill } = useSkillStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<EditSkillForm>({
        resolver: zodResolver(editSkillSchema),
    })

    // Reset form when skill changes
    useEffect(() => {
        if (skill) {
            setValue('level', skill.level as SkillLevel)
            setValue('description', skill.description)
            setValue('years_of_experience', skill.years_of_experience)
            setValue('proof_url', skill.proof_url || '')
            setValue('proof_type', skill.proof_type || '')
            setValue('hourly_rate', skill.hourly_rate)
            setValue('online_only', skill.online_only)
            setValue('offline_only', skill.offline_only)
            setValue('is_available', skill.is_available)
        }
    }, [skill, setValue])

    const onSubmit = async (data: EditSkillForm) => {
        try {
            setIsSubmitting(true)
            
            // Only send changed values
            const updates: UpdateUserSkillRequest = {}
            
            if (data.level !== skill.level) updates.level = data.level
            if (data.description !== skill.description) updates.description = data.description
            if (data.years_of_experience !== skill.years_of_experience) updates.years_of_experience = data.years_of_experience
            if (data.proof_url !== skill.proof_url) updates.proof_url = data.proof_url
            if (data.proof_type !== skill.proof_type) updates.proof_type = data.proof_type
            if (data.hourly_rate !== skill.hourly_rate) updates.hourly_rate = data.hourly_rate
            if (data.online_only !== skill.online_only) updates.online_only = data.online_only
            if (data.offline_only !== skill.offline_only) updates.offline_only = data.offline_only
            if (data.is_available !== skill.is_available) updates.is_available = data.is_available
            
            if (Object.keys(updates).length === 0) {
                toast.info('Tidak ada perubahan untuk disimpan')
                onClose()
                return
            }
            
            await updateUserSkill(skill.skill_id, updates)
            
            toast.success('Skill berhasil diupdate!')
            onClose()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal mengupdate skill')
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
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Skill: {skill.skill.name}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Skill Info */}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{skill.skill.icon}</span>
                                <div>
                                    <h3 className="font-semibold">{skill.skill.name}</h3>
                                    <p className="text-sm text-muted-foreground">{skill.skill.category}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Level & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="level">Level Kemampuan</Label>
                            <Select 
                                value={selectedLevel}
                                onValueChange={(value) => setValue('level', value as SkillLevel)}
                            >
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
                        <Label htmlFor="description">Deskripsi Kemampuan</Label>
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
                            <Label htmlFor="hourly_rate">Rate per Jam (Credits)</Label>
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
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
