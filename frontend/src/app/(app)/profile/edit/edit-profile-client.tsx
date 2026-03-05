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
import { ArrowLeft, Upload, Loader2, User, GraduationCap, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'personal' | 'education' | 'contact';

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
    const [activeTab, setActiveTab] = useState<TabType>('personal');

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
        <main
            style={{
                height: 'calc(100vh - 80px)',
                background: 'var(--background)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '1.5rem 1rem 0',
                    width: '100%',
                    flexShrink: 0,
                }}
            >
                {/* Back Button */}
                <Link href="/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Link>
            </div>

            {/* Two-column layout — fills remaining height */}
            <div
                style={{
                    display: 'flex',
                    gap: '2rem',
                    flex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1rem 1.5rem',
                    width: '100%',
                    overflow: 'hidden',
                    minHeight: 0,
                }}
            >
                {/* Left Sidebar — fixed height, never scrolls */}
                <aside
                    style={{
                        width: '280px',
                        flexShrink: 0,
                        overflowY: 'auto',
                    }}
                >
                    <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col items-center w-full h-full">
                        
                        {/* Avatar Section */}
                        <div className="relative mb-4 group cursor-pointer">
                            <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                                <AvatarImage src={avatarPreview} alt={formData.full_name} className="object-cover" />
                                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                    {formData.full_name ? getInitials(formData.full_name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <label 
                                htmlFor="avatar-upload" 
                                className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-transform hover:scale-105"
                            >
                                {isUploadingAvatar ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4" />
                                )}
                            </label>
                            <Input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                                disabled={isUploadingAvatar}
                            />
                        </div>

                        {/* User Info */}
                        <div className="text-center mb-8 w-full">
                            <h2 className="text-lg font-bold text-foreground truncate px-2">{formData.full_name || 'Your Name'}</h2>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Student</p>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="w-full flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('personal')}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === 'personal' 
                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500' 
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <User className="h-4 w-4" />
                                Personal Information
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('education')}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === 'education' 
                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500' 
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <GraduationCap className="h-4 w-4" />
                                Education
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('contact')}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === 'contact' 
                                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500' 
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <Mail className="h-4 w-4" />
                                Contact Information
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Right Content — scrolls independently */}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        overflowY: 'auto',
                        paddingRight: '4px',
                    }}
                >
                    <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col min-h-full">

                            <h2 className="text-2xl font-bold text-foreground mb-6">
                                {activeTab === 'personal' && 'Personal Information'}
                                {activeTab === 'education' && 'Education'}
                                {activeTab === 'contact' && 'Contact Information'}
                            </h2>

                            <div className="flex-1 space-y-6">
                                {/* Personal Information Tab */}
                                {activeTab === 'personal' && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        
                                        {/* Gender */}
                                        <div className="flex items-center gap-6 mb-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="gender" defaultChecked className="w-4 h-4 text-primary focus:ring-primary border-muted accent-primary" />
                                                <span className="text-sm font-medium text-foreground">Male</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="gender" className="w-4 h-4 text-primary focus:ring-primary border-muted accent-primary" />
                                                <span className="text-sm font-medium text-muted-foreground">Female</span>
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="full_name" className="text-sm text-muted-foreground font-medium">Full Name</Label>
                                                <Input
                                                    id="full_name"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="username" className="text-sm text-muted-foreground font-medium">Username</Label>
                                                <Input
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm text-muted-foreground font-medium">Email</Label>
                                            <div className="relative">
                                                <Input
                                                    value={user?.email || ''}
                                                    readOnly
                                                    className="bg-muted/50 border-transparent focus-visible:ring-0 cursor-not-allowed rounded-xl text-muted-foreground pr-24"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-emerald-500 font-semibold text-xs bg-emerald-500/10 px-2 py-1 rounded-md">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio" className="text-sm text-muted-foreground font-medium">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                placeholder="Tell us about yourself..."
                                                rows={3}
                                                className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Education Tab */}
                                {activeTab === 'education' && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-2">
                                            <Label htmlFor="school" className="text-sm text-muted-foreground font-medium">School / University</Label>
                                            <Input
                                                id="school"
                                                name="school"
                                                value={formData.school}
                                                onChange={handleChange}
                                                required
                                                className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="grade" className="text-sm text-muted-foreground font-medium">Grade / Year</Label>
                                                <Input
                                                    id="grade"
                                                    name="grade"
                                                    value={formData.grade}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="major" className="text-sm text-muted-foreground font-medium">Major</Label>
                                                <Input
                                                    id="major"
                                                    name="major"
                                                    value={formData.major}
                                                    onChange={handleChange}
                                                    className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Contact Tab */}
                                {activeTab === 'contact' && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone_number" className="text-sm text-muted-foreground font-medium">Phone Number</Label>
                                                <Input
                                                    id="phone_number"
                                                    name="phone_number"
                                                    type="tel"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                    placeholder="(123) 456-7890"
                                                    className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location" className="text-sm text-muted-foreground font-medium">Location</Label>
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="City, Country"
                                                    className="bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-5 border-t border-border mt-auto">
                                <Link href="/profile" className="w-full sm:w-auto">
                                    <Button type="button" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold border-primary/30 text-primary hover:bg-primary/5">
                                        Discard Changes
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
                                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
        </main>
    );
}
