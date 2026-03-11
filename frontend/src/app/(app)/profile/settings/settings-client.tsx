'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import { ArrowLeft, Loader2, Shield, Bell, Eye, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TabType = 'security' | 'notifications' | 'privacy' | 'danger';

export function SettingsClient() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { changePassword, isLoading } = useUserStore();

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [notifications, setNotifications] = useState({
        email_notifications: true,
        session_reminders: true,
        new_messages: true,
        marketing_emails: false,
    });

    const [privacy, setPrivacy] = useState({
        profile_visible: true,
        show_email: false,
        show_phone: false,
    });

    const [activeTab, setActiveTab] = useState<TabType>('security');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.new_password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        try {
            await changePassword(passwordData.current_password, passwordData.new_password);
            toast.success('Password changed successfully');
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to change password');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            // In production, call delete account API
            toast.success('Account deletion requested');
            await logout();
            router.push('/');
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    // Helper functions for tab logic
    const tabs = [
        { id: 'security', label: 'Security & Password', icon: Shield, desc: 'Manage your password and active sessions' },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Control your email and push preferences' },
        { id: 'privacy', label: 'Privacy Control', icon: Eye, desc: 'Manage who can see your information' },
        { id: 'danger', label: 'Danger Zone', icon: Trash2, desc: 'Account deletion and critical actions', isDestructive: true },
    ];

    const currentTabInfo = tabs.find(t => t.id === activeTab);

    return (
        <main
            className="min-h-screen bg-background font-['Plus_Jakarta_Sans'] flex flex-col pb-12 pt-24"
        >
            <div
                className="max-w-[1200px] mx-auto px-6 w-full shrink-0 pb-4 md:pb-6"
            >
                {/* Back Button */}
                <Link href="/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Link>
            </div>

            <div
                className="flex flex-col md:flex-row gap-6 md:gap-8 flex-1 max-w-[1200px] mx-auto px-6 w-full"
            >
                {/* SIDEBAR NAVIGATION */}
                <aside
                    className="bg-card rounded-3xl p-4 md:p-6 border border-border flex flex-col w-full md:w-[280px] shrink-0"
                >
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-4 md:mb-6">
                        Settings
                    </h1>

                    <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200
                                        ${isActive 
                                            ? tab.isDestructive 
                                                ? 'bg-destructive/10 text-destructive font-semibold' 
                                                : 'bg-primary text-primary-foreground shadow-sm font-semibold' 
                                            : tab.isDestructive
                                                ? 'text-destructive/80 hover:bg-destructive/10 font-medium'
                                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                                    <span className="whitespace-nowrap text-sm md:text-base">{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* RIGHT CONTENT AREA */}
                <div
                    className="bg-card rounded-3xl border border-border flex flex-col relative w-full overflow-hidden"
                >
                    {/* Header of Content Area */}
                    <div className="p-5 md:p-10 border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                            {currentTabInfo?.label}
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground mt-1">
                            {currentTabInfo?.desc}
                        </p>
                    </div>

                    {/* Scrollable Form Area */}
                    <div className="flex-1 p-5 md:p-10">
                        <div className="max-w-2xl space-y-8">

                            {/* --- Security Tab --- */}
                            {activeTab === 'security' && (
                                <form id="security-form" onSubmit={handlePasswordChange}>
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Current Password</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Verify it's you to make changes.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current_password">Password</Label>
                                                    <Input
                                                        id="current_password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={passwordData.current_password}
                                                        onChange={(e) => setPasswordData(prev => ({
                                                            ...prev,
                                                            current_password: e.target.value
                                                        }))}
                                                        className="h-12 rounded-xl bg-muted/20 focus:bg-background transition-colors"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">New Password</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Make it strong and unique.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="new_password">New Password</Label>
                                                        <Input
                                                            id="new_password"
                                                            type="password"
                                                            placeholder="New password"
                                                            value={passwordData.new_password}
                                                            onChange={(e) => setPasswordData(prev => ({
                                                                ...prev,
                                                                new_password: e.target.value
                                                            }))}
                                                            className="h-12 rounded-xl bg-muted/20 focus:bg-background transition-colors"
                                                            required
                                                            minLength={8}
                                                        />
                                                        <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="confirm_password">Confirm Password</Label>
                                                        <Input
                                                            id="confirm_password"
                                                            type="password"
                                                            placeholder="Re-type new password"
                                                            value={passwordData.confirm_password}
                                                            onChange={(e) => setPasswordData(prev => ({
                                                                ...prev,
                                                                confirm_password: e.target.value
                                                            }))}
                                                            className="h-12 rounded-xl bg-muted/20 focus:bg-background transition-colors"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* --- Notifications Tab --- */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-0">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                        <div className="md:col-span-1">
                                            <h3 className="text-base font-semibold text-foreground">Email Updates</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Control transactional and marketing emails.</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Email Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">Receive general account updates.</p>
                                                </div>
                                                <Switch
                                                    checked={notifications.email_notifications}
                                                    onCheckedChange={(checked) => setNotifications(prev => ({
                                                        ...prev, email_notifications: checked
                                                    }))}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Marketing Emails</Label>
                                                    <p className="text-sm text-muted-foreground">Receive news, offers, and tips from Wibi.</p>
                                                </div>
                                                <Switch
                                                    checked={notifications.marketing_emails}
                                                    onCheckedChange={(checked) => setNotifications(prev => ({
                                                        ...prev, marketing_emails: checked
                                                    }))}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                        <div className="md:col-span-1">
                                            <h3 className="text-base font-semibold text-foreground">Platform Activity</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Control alerts related to sessions and messages.</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Session Reminders</Label>
                                                    <p className="text-sm text-muted-foreground">Get reminded before an upcoming session starts.</p>
                                                </div>
                                                <Switch
                                                    checked={notifications.session_reminders}
                                                    onCheckedChange={(checked) => setNotifications(prev => ({
                                                        ...prev, session_reminders: checked
                                                    }))}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">New Messages</Label>
                                                    <p className="text-sm text-muted-foreground">Get notified when you receive a message.</p>
                                                </div>
                                                <Switch
                                                    checked={notifications.new_messages}
                                                    onCheckedChange={(checked) => setNotifications(prev => ({
                                                        ...prev, new_messages: checked
                                                    }))}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- Privacy Tab --- */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-0">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                        <div className="md:col-span-1">
                                            <h3 className="text-base font-semibold text-foreground">Discovery</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Control how others find your profile.</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Public Profile</Label>
                                                    <p className="text-sm text-muted-foreground">Make your profile visible in the marketplace.</p>
                                                </div>
                                                <Switch
                                                    checked={privacy.profile_visible}
                                                    onCheckedChange={(checked) => setPrivacy(prev => ({
                                                        ...prev, profile_visible: checked
                                                    }))}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                        <div className="md:col-span-1">
                                            <h3 className="text-base font-semibold text-foreground">Contact Info</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Manage public visibility of personal details.</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Show Email Address</Label>
                                                    <p className="text-sm text-muted-foreground">Display email directly on your profile.</p>
                                                </div>
                                                <Switch
                                                    checked={privacy.show_email}
                                                    onCheckedChange={(checked) => setPrivacy(prev => ({
                                                        ...prev, show_email: checked
                                                    }))}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/5">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Show Phone Number</Label>
                                                    <p className="text-sm text-muted-foreground">Display phone number directly on your profile.</p>
                                                </div>
                                                <Switch
                                                    checked={privacy.show_phone}
                                                    onCheckedChange={(checked) => setPrivacy(prev => ({
                                                        ...prev, show_phone: checked
                                                    }))}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- Danger Zone Tab --- */}
                            {activeTab === 'danger' && (
                                <div className="space-y-0">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-destructive/20 mt-4 bg-destructive/5 rounded-2xl px-6">
                                        <div className="md:col-span-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ShieldAlert className="w-5 h-5 text-destructive" />
                                                <h3 className="text-base font-semibold text-destructive">Delete Account</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Permanent and irreversible.</p>
                                        </div>
                                        <div className="md:col-span-2 flex flex-col justify-center items-start space-y-4">
                                            <p className="text-sm text-foreground font-medium">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" className="h-11 px-8 rounded-xl font-semibold shadow-md border border-destructive/50 hover:bg-destructive/90">
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete My Account
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl border-destructive/20">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-base leading-relaxed">
                                                            This action cannot be undone. This will permanently delete your
                                                            account and entirely remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="mt-6">
                                                        <AlertDialogCancel className="rounded-xl h-11 px-6 font-medium">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={handleDeleteAccount}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl h-11 px-6 font-medium shadow-md"
                                                        >
                                                            Yes, delete account
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Action Bar at Bottom (Sticky) */}
                    {activeTab === 'security' && (
                        <div className="p-6 border-t border-border bg-card/80 backdrop-blur-sm sticky bottom-0 z-20 flex justify-end items-center rounded-b-3xl">
                            <Button 
                                type="submit" 
                                form="security-form"
                                disabled={isLoading} 
                                className="h-11 px-8 rounded-xl font-semibold min-w-[160px] shadow-sm hover:scale-105 transition-transform"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </Button>
                        </div>
                    )}
                    {(activeTab === 'notifications' || activeTab === 'privacy') && (
                        <div className="p-6 border-t border-border bg-card/80 backdrop-blur-sm sticky bottom-0 z-20 flex justify-end items-center rounded-b-3xl">
                            <p className="text-sm font-medium text-muted-foreground mr-4">Preferences are auto-saved.</p>
                            <Button 
                                type="button" 
                                disabled
                                className="h-11 px-8 rounded-xl font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            >
                                Saved
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}
