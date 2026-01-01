'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { UserProfile } from '@/types';
import { useUserStore } from '@/stores/user.store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Bell, Lock, Eye, Globe, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface SettingsSection {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface FormState {
    email: string;
    fullName: string;
    phone: string;
    language: string;
    timezone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    profileVisibility: string;
    twoFactorEnabled: boolean;
    sessionTimeout: string;
}

const settingsSections: SettingsSection[] = [
    {
        id: 'account',
        title: 'Account',
        description: 'Manage your account information',
        icon: <Lock className="w-5 h-5" />,
    },
    {
        id: 'preferences',
        title: 'Preferences',
        description: 'Customize your experience',
        icon: <Eye className="w-5 h-5" />,
    },
    {
        id: 'privacy',
        title: 'Privacy',
        description: 'Control your privacy settings',
        icon: <Globe className="w-5 h-5" />,
    },
    {
        id: 'notifications',
        title: 'Notifications',
        description: 'Manage how you receive updates',
        icon: <Bell className="w-5 h-5" />,
    },
];

export default function SettingsPage() {
    const router = useRouter();
    const profile = useUserStore((state) => state.profile);
    const [activeSection, setActiveSection] = useState('account');
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formState, setFormState] = useState<FormState>({
        email: profile?.email || '',
        fullName: profile?.full_name || '',
        phone: profile?.phone_number || '',
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        profileVisibility: 'public',
        twoFactorEnabled: false,
        sessionTimeout: '24h',
    });

    const handleInputChange = (field: keyof FormState, value: string | boolean) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background">
                <Header />

                <main className="container mx-auto px-4 py-8 max-w-6xl">
                    <motion.div
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Header with Back Button */}
                        <motion.div variants={itemVariants} className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-1">
                                    Settings
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your account and preferences
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Sidebar Navigation */}
                            <motion.div variants={itemVariants} className="lg:col-span-1">
                            <nav className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-2 space-y-1">
                                {settingsSections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors flex items-center gap-3 ${activeSection === section.id
                                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                            }`}
                                    >
                                        {section.icon}
                                        <span>{section.title}</span>
                                    </button>
                                ))}
                            </nav>
                        </motion.div>

                        {/* Settings Content */}
                        <motion.div variants={itemVariants} className="lg:col-span-3">
                            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 space-y-6">
                                {/* Account Settings */}
                                {activeSection === 'account' && (
                                    <motion.div
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                                Account Information
                                            </h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Full Name
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={formState.fullName}
                                                        onChange={(e) =>
                                                            handleInputChange('fullName', e.target.value)
                                                        }
                                                        placeholder="Your full name"
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Email Address
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        value={formState.email}
                                                        onChange={(e) =>
                                                            handleInputChange('email', e.target.value)
                                                        }
                                                        placeholder="your@email.com"
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <Input
                                                        type="tel"
                                                        value={formState.phone}
                                                        onChange={(e) =>
                                                            handleInputChange('phone', e.target.value)
                                                        }
                                                        placeholder="+1 (555) 000-0000"
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                                    <button className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline">
                                                        Change Password
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                                        Two-factor authentication is not yet enabled. Enable it
                                                        to secure your account.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Preferences */}
                                {activeSection === 'preferences' && (
                                    <motion.div
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                                Preferences
                                            </h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Language
                                                    </label>
                                                    <select
                                                        value={formState.language}
                                                        onChange={(e) =>
                                                            handleInputChange('language', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="en">English</option>
                                                        <option value="id">Indonesian (Bahasa Indonesia)</option>
                                                        <option value="es">Spanish</option>
                                                        <option value="fr">French</option>
                                                        <option value="de">German</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Timezone
                                                    </label>
                                                    <select
                                                        value={formState.timezone}
                                                        onChange={(e) =>
                                                            handleInputChange('timezone', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="UTC">UTC</option>
                                                        <option value="GMT+7">GMT+7 (Western Indonesia Time)</option>
                                                        <option value="GMT+8">GMT+8 (Central Indonesia Time)</option>
                                                        <option value="GMT+9">GMT+9 (Eastern Indonesia Time)</option>
                                                        <option value="EST">EST</option>
                                                        <option value="PST">PST</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Session Timeout
                                                    </label>
                                                    <select
                                                        value={formState.sessionTimeout}
                                                        onChange={(e) =>
                                                            handleInputChange('sessionTimeout', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="1h">1 Hour</option>
                                                        <option value="6h">6 Hours</option>
                                                        <option value="12h">12 Hours</option>
                                                        <option value="24h">24 Hours (Default)</option>
                                                        <option value="7d">7 Days</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Privacy Settings */}
                                {activeSection === 'privacy' && (
                                    <motion.div
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                                Privacy Settings
                                            </h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                                        Profile Visibility
                                                    </label>
                                                    <select
                                                        value={formState.profileVisibility}
                                                        onChange={(e) =>
                                                            handleInputChange('profileVisibility', e.target.value)
                                                        }
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="public">Public - Anyone can see your profile</option>
                                                        <option value="registered">
                                                            Registered - Only logged-in users can see
                                                        </option>
                                                        <option value="private">
                                                            Private - Only people you follow
                                                        </option>
                                                    </select>
                                                </div>

                                                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formState.profileVisibility === 'public'}
                                                            readOnly
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                                            Show my skills in the marketplace
                                                        </span>
                                                    </label>

                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={true}
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                                            Allow others to see my availability
                                                        </span>
                                                    </label>

                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            defaultChecked={true}
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                                        />
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                                            Allow search engines to index my profile
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Notifications */}
                                {activeSection === 'notifications' && (
                                    <motion.div
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                                Notification Preferences
                                            </h2>
                                            <div className="space-y-4">
                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formState.emailNotifications}
                                                            onChange={(e) =>
                                                                handleInputChange('emailNotifications', e.target.checked)
                                                            }
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                Email Notifications
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Get notified about bookings, messages, and updates
                                                            </p>
                                                        </div>
                                                    </label>

                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formState.pushNotifications}
                                                            onChange={(e) =>
                                                                handleInputChange('pushNotifications', e.target.checked)
                                                            }
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                Push Notifications
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Get instant notifications on your device
                                                            </p>
                                                        </div>
                                                    </label>

                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formState.marketingEmails}
                                                            onChange={(e) =>
                                                                handleInputChange('marketingEmails', e.target.checked)
                                                            }
                                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                Marketing Emails
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                Receive updates about new features and promotions
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-2">
                                        {saveStatus === 'success' && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center gap-2 text-green-600 dark:text-green-400"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">Saved successfully</span>
                                            </motion.div>
                                        )}
                                        {saveStatus === 'error' && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center gap-2 text-red-600 dark:text-red-400"
                                            >
                                                <AlertCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">Failed to save</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
