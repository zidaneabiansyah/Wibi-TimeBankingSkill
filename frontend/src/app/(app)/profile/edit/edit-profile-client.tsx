'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EditProfileClient() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const { updateProfile, updateAvatar, isLoading } = useUserStore();

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        school: '',
        grade: '',
        major: '',
        bio: '',
        phone_number: '',
        location: '',
    });

    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                username: user.username || '',
                school: user.school || '',
                grade: user.grade || '',
                major: user.major || '',
                bio: user.bio || '',
                phone_number: user.phone_number || '',
                location: user.location || '',
            });
            setAvatarPreview(user.avatar || '');
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        setIsUploadingAvatar(true);
        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // In production, upload to cloud storage (S3, Cloudinary, etc.)
            // For now, we'll use the data URL
            const dataUrl = await new Promise<string>((resolve) => {
                const r = new FileReader();
                r.onloadend = () => resolve(r.result as string);
                r.readAsDataURL(file);
            });

            await updateAvatar(dataUrl);
            toast.success('Avatar updated successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload avatar');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateProfile(formData);
            if (user) {
                setUser({ ...user, ...formData });
            }
            toast.success('Profile updated successfully');
            router.push('/profile');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/profile">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Edit Profile</h1>
                        <p className="text-muted-foreground">Update your personal information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>Update your profile picture</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={avatarPreview} alt={formData.full_name} />
                                    <AvatarFallback className="text-2xl">
                                        {formData.full_name ? getInitials(formData.full_name) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Label htmlFor="avatar" className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isUploadingAvatar}
                                                asChild
                                            >
                                                <span>
                                                    {isUploadingAvatar ? (
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Upload className="h-4 w-4 mr-2" />
                                                    )}
                                                    Upload New Picture
                                                </span>
                                            </Button>
                                        </div>
                                    </Label>
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                        disabled={isUploadingAvatar}
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        JPG, PNG or GIF. Max size 5MB.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name *</Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username *</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                            <CardDescription>Your educational background</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="school">School *</Label>
                                <Input
                                    id="school"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="grade">Grade *</Label>
                                    <Input
                                        id="grade"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="major">Major</Label>
                                    <Input
                                        id="major"
                                        name="major"
                                        value={formData.major}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>How others can reach you</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <Link href="/profile">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
}
