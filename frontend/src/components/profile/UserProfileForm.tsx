'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    User,
    Edit3,
    Save,
    Lock,
    Upload,
    Camera,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Building,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react'
import { useUserStore } from '@/stores'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { UpdateProfileRequest, ChangePasswordRequest } from '@/types'

// Profile Form Schema
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

// Password Change Schema
const passwordSchema = z.object({
    current_password: z.string().min(6, 'Current password is required'),
    new_password: z.string().min(6, 'New password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Please confirm your new password')
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

// Profile Information Tab
function ProfileInfoTab() {
    const [isEditing, setIsEditing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { profile, isLoading, fetchProfile, updateProfile } = useUserStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema)
    })

    // Load profile and populate form
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
        }
    }, [profile, setValue])

    const onSubmit = async (data: ProfileForm) => {
        try {
            setIsSubmitting(true)
            await updateProfile(data)
            toast.success('Profile updated successfully!')
            setIsEditing(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        reset()
        setIsEditing(false)
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        )
    }

    if (!profile) {
        return (
            <Card>
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Failed to load profile</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                </CardTitle>
                {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </CardHeader>
            
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name *</Label>
                            <Input
                                id="full_name"
                                {...register('full_name')}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-muted' : ''}
                            />
                            {errors.full_name && (
                                <p className="text-sm text-destructive">{errors.full_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                {...register('username')}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-muted' : ''}
                            />
                            {errors.username && (
                                <p className="text-sm text-destructive">{errors.username.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <Label>Email</Label>
                        </div>
                        <Input
                            value={profile.email}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                            Email cannot be changed. Contact support if needed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone_number">
                                <Phone className="h-4 w-4 inline mr-2" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone_number"
                                {...register('phone_number')}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-muted' : ''}
                                placeholder="Your phone number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">
                                <MapPin className="h-4 w-4 inline mr-2" />
                                Location
                            </Label>
                            <Input
                                id="location"
                                {...register('location')}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-muted' : ''}
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="school">
                                <Building className="h-4 w-4 inline mr-2" />
                                School *
                            </Label>
                            <Input
                                id="school"
                                {...register('school')}
                                disabled={!isEditing}
                                className={!isEditing ? 'bg-muted' : ''}
                            />
                            {errors.school && (
                                <p className="text-sm text-destructive">{errors.school.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grade">
                                <GraduationCap className="h-4 w-4 inline mr-2" />
                                Grade *
                            </Label>
                            {isEditing ? (
                                <Select onValueChange={(value) => setValue('grade', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['10', '11', '12', 'College/University', 'Graduate'].map((grade) => (
                                            <SelectItem key={grade} value={grade}>
                                                {grade}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    value={profile.grade}
                                    disabled
                                    className="bg-muted"
                                />
                            )}
                            {errors.grade && (
                                <p className="text-sm text-destructive">{errors.grade.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="major">Major/Field of Study</Label>
                        <Input
                            id="major"
                            {...register('major')}
                            disabled={!isEditing}
                            className={!isEditing ? 'bg-muted' : ''}
                            placeholder="Your major or field of study"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            {...register('bio')}
                            disabled={!isEditing}
                            className={!isEditing ? 'bg-muted' : ''}
                            placeholder="Tell others about yourself, your interests, and what you're passionate about..."
                            rows={4}
                        />
                        {errors.bio && (
                            <p className="text-sm text-destructive">{errors.bio.message}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}

// Change Password Tab
function ChangePasswordTab() {
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema)
    })

    const onSubmit = async (data: PasswordForm) => {
        try {
            setIsSubmitting(true)
            // TODO: Implement password change functionality
            // const passwordData: ChangePasswordRequest = {
            //     current_password: data.current_password,
            //     new_password: data.new_password
            // }
            // await changePassword(passwordData)
            toast.success('Password change feature coming soon!')
            reset()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to change password')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                </CardTitle>
            </CardHeader>
            
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="current_password"
                                type={showPasswords.current ? 'text' : 'password'}
                                {...register('current_password')}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            >
                                {showPasswords.current ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.current_password && (
                            <p className="text-sm text-destructive">{errors.current_password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="new_password"
                                type={showPasswords.new ? 'text' : 'password'}
                                {...register('new_password')}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            >
                                {showPasswords.new ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.new_password && (
                            <p className="text-sm text-destructive">{errors.new_password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirm_password"
                                type={showPasswords.confirm ? 'text' : 'password'}
                                {...register('confirm_password')}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                                {showPasswords.confirm ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.confirm_password && (
                            <p className="text-sm text-destructive">{errors.confirm_password.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Change Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

// Avatar Upload Component
function AvatarUpload() {
    const [isUploading, setIsUploading] = useState(false)
    const { profile } = useUserStore()

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB')
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        try {
            setIsUploading(true)
            
            // TODO: Implement avatar upload functionality
            // For now, we'll use a placeholder URL
            // In production, you would upload to a service like Cloudinary or AWS S3
            // const fakeUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}&size=200`
            // await updateAvatar(fakeUrl)
            toast.success('Avatar upload feature coming soon!')
        } catch (error) {
            toast.error('Failed to upload avatar')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Picture
                </CardTitle>
            </CardHeader>
            
            <CardContent>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {profile?.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-muted-foreground" />
                            )}
                        </div>
                        {isUploading && (
                            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Upload a new profile picture. Max size: 5MB
                        </p>
                        <div>
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                disabled={isUploading}
                                className="gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Choose Photo
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Main Profile Form Component
export default function UserProfileForm() {
    return (
        <div className="space-y-6">
            <AvatarUpload />
            
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Profile Info</TabsTrigger>
                    <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="mt-6">
                    <ProfileInfoTab />
                </TabsContent>
                
                <TabsContent value="password" className="mt-6">
                    <ChangePasswordTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
