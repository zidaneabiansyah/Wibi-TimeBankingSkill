'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth.store';
import { useUserStore } from '@/stores/user.store';
import { ArrowLeft, Loader2, Shield, Bell, Eye, Trash2 } from 'lucide-react';
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
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground">Manage your account settings and preferences</p>
                    </div>
                </div>

                {/* Security Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>Change your password and security settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Current Password</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        current_password: e.target.value
                                    }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new_password">New Password</Label>
                                <Input
                                    id="new_password"
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        new_password: e.target.value
                                    }))}
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm_password">Confirm New Password</Label>
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={(e) => setPasswordData(prev => ({
                                        ...prev,
                                        confirm_password: e.target.value
                                    }))}
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Change Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Notifications Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email updates about your account
                                </p>
                            </div>
                            <Switch
                                checked={notifications.email_notifications}
                                onCheckedChange={(checked) => setNotifications(prev => ({
                                    ...prev,
                                    email_notifications: checked
                                }))}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Session Reminders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get reminded about upcoming sessions
                                </p>
                            </div>
                            <Switch
                                checked={notifications.session_reminders}
                                onCheckedChange={(checked) => setNotifications(prev => ({
                                    ...prev,
                                    session_reminders: checked
                                }))}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>New Messages</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notifications for new messages
                                </p>
                            </div>
                            <Switch
                                checked={notifications.new_messages}
                                onCheckedChange={(checked) => setNotifications(prev => ({
                                    ...prev,
                                    new_messages: checked
                                }))}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Marketing Emails</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive news and updates from Wibi
                                </p>
                            </div>
                            <Switch
                                checked={notifications.marketing_emails}
                                onCheckedChange={(checked) => setNotifications(prev => ({
                                    ...prev,
                                    marketing_emails: checked
                                }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            <CardTitle>Privacy</CardTitle>
                        </div>
                        <CardDescription>Control who can see your information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Public Profile</Label>
                                <p className="text-sm text-muted-foreground">
                                    Make your profile visible to everyone
                                </p>
                            </div>
                            <Switch
                                checked={privacy.profile_visible}
                                onCheckedChange={(checked) => setPrivacy(prev => ({
                                    ...prev,
                                    profile_visible: checked
                                }))}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Show Email</Label>
                                <p className="text-sm text-muted-foreground">
                                    Display your email on your profile
                                </p>
                            </div>
                            <Switch
                                checked={privacy.show_email}
                                onCheckedChange={(checked) => setPrivacy(prev => ({
                                    ...prev,
                                    show_email: checked
                                }))}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Show Phone Number</Label>
                                <p className="text-sm text-muted-foreground">
                                    Display your phone number on your profile
                                </p>
                            </div>
                            <Switch
                                checked={privacy.show_phone}
                                onCheckedChange={(checked) => setPrivacy(prev => ({
                                    ...prev,
                                    show_phone: checked
                                }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        </div>
                        <CardDescription>Irreversible actions for your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    Delete Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove all your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete Account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
