'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Upload } from 'lucide-react'

// Form validation schema
const profileSchema = z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    school: z.string().min(2, 'School name is required'),
    grade: z.string().min(1, 'Grade is required'),
    major: z.string().optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    phone_number: z.string().optional(),
    location: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

function EditProfileContent() {
    const router = useRouter()
    const { user } = useAuthStore()
    const { profile, isLoading, fetchProfile, updateProfile } = useUserStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string>('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    })

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    useEffect(() => {
        if (profile) {
            setValue('full_name', profile.full_name || '')
            setValue('username', profile.username || '')
            setValue('school', profile.school || '')
            setValue('grade', profile.grade || '')
            setValue('major', profile.major || '')
            setValue('bio', profile.bio || '')
            setValue('phone_number', profile.phone_number || '')
            setValue('location', profile.location || '')
            if (profile.avatar) {
                setAvatarPreview(profile.avatar)
            }
        }
    }, [profile, setValue])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
               toast.error("Image size must be less than 5MB");
               return;
            }

            // Create image object to load the file
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            img.onload = () => {
                // Calculate new dimensions (max 500px width/height)
                const MAX_SIZE = 500;
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                // Create canvas for resizing
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG with 0.7 quality
                    // This significantly reduces the base64 string size compared to raw PNG
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setAvatarPreview(compressedBase64);
                }
            };
        }
    }

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true)
        try {
            // Prepare update data
            const updateData: any = { ...data }

            // Upload avatar if changed
            // Upload avatar if changed (avatarPreview contains the compressed base64)
            if (avatarPreview && avatarPreview.startsWith('data:image')) {
                // Use the data URL (base64) as avatar
                updateData.avatar = avatarPreview
            }

            // Update profile
            await updateProfile(updateData)

            // Update auth store with new profile data to keep UI in sync
            // The updateProfile call in user.store.ts updates its own state,
            // but we need to update the global auth user as well.
            const updatedProfile = useUserStore.getState().profile;
            if (updatedProfile) {
                useAuthStore.getState().setUser(updatedProfile);
            }

            toast.success('Profile updated successfully')
            router.push('/profile')
        } catch (error) {
            toast.error('Failed to update profile')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">Edit Profile</h1>
                    <p className="text-muted-foreground mt-2">Update your profile information</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Avatar Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>Upload a new profile picture</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-primary">
                                            {user?.full_name?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="avatar" className="cursor-pointer">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                                            <Upload className="h-4 w-4" />
                                            Choose Image
                                        </div>
                                    </Label>
                                    <input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        JPG, PNG or GIF (max. 5MB)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your basic information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name *</Label>
                                    <Input
                                        id="full_name"
                                        {...register('full_name')}
                                        className={errors.full_name ? 'border-red-500' : ''}
                                    />
                                    {errors.full_name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.full_name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username *</Label>
                                    <Input
                                        id="username"
                                        {...register('username')}
                                        className={errors.username ? 'border-red-500' : ''}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        {...register('phone_number')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        {...register('location')}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    {...register('bio')}
                                />
                                {errors.bio && (
                                    <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                            <CardDescription>Update your education details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="school">School *</Label>
                                    <Input
                                        id="school"
                                        {...register('school')}
                                        className={errors.school ? 'border-red-500' : ''}
                                    />
                                    {errors.school && (
                                        <p className="text-sm text-red-500 mt-1">{errors.school.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="grade">Grade *</Label>
                                    <Input
                                        id="grade"
                                        {...register('grade')}
                                        className={errors.grade ? 'border-red-500' : ''}
                                    />
                                    {errors.grade && (
                                        <p className="text-sm text-red-500 mt-1">{errors.grade.message}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="major">Major/Field of Study</Label>
                                    <Input
                                        id="major"
                                        {...register('major')}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default function EditProfilePage() {
    return (
        <ProtectedRoute>
            <EditProfileContent />
        </ProtectedRoute>
    )
}
