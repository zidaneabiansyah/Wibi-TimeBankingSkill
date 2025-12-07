'use client';

import { useState } from 'react';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';
import { toast } from 'sonner';

/**
 * NotificationPreferences Page
 * Allows users to customize notification settings
 */
export default function NotificationPreferencesPage() {
    const [preferences, setPreferences] = useState({
        sessionNotifications: true,
        creditNotifications: true,
        achievementNotifications: true,
        reviewNotifications: true,
        emailNotifications: false,
        pushNotifications: true,
        quietHours: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
    });

    const [isSaving, setIsSaving] = useState(false);

    /**
     * Handle preference change
     */
    const handleChange = (key: string, value: any) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    /**
     * Handle save preferences
     */
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Call API to save preferences
            // await notificationService.updatePreferences(preferences);
            toast.success('Preferences saved successfully');
        } catch (error) {
            console.error('Failed to save preferences:', error);
            toast.error('Failed to save preferences');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            {/* Main Container - Centered */}
            <div className="w-full max-w-2xl mx-auto">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center justify-center mb-12 gap-4">
                    <div className="flex items-center justify-center gap-3">
                        <Bell className="w-8 h-8 text-blue-600" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Notification Preferences
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        Customize how and when you receive notifications
                    </p>
                </div>

                {/* Preferences Card - Centered */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* Notification Types Section */}
                    <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
                            Notification Types
                        </h2>

                        <div className="space-y-6">
                            {/* Session Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Session Notifications
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Get notified about session requests, approvals, and completions
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.sessionNotifications}
                                        onChange={(e) =>
                                            handleChange('sessionNotifications', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            {/* Credit Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Credit Notifications
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Get notified when you earn or spend credits
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.creditNotifications}
                                        onChange={(e) =>
                                            handleChange('creditNotifications', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            {/* Achievement Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Achievement Notifications
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Get notified when you unlock badges and milestones
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.achievementNotifications}
                                        onChange={(e) =>
                                            handleChange('achievementNotifications', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            {/* Review Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Review Notifications
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Get notified when you receive reviews and ratings
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.reviewNotifications}
                                        onChange={(e) =>
                                            handleChange('reviewNotifications', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Methods Section */}
                    <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
                            Delivery Methods
                        </h2>

                        <div className="space-y-6">
                            {/* Push Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <Smartphone className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            Push Notifications
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Receive notifications in your browser
                                        </p>
                                    </div>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.pushNotifications}
                                        onChange={(e) =>
                                            handleChange('pushNotifications', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            {/* Email Notifications */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            Email Notifications
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Receive important updates via email
                                        </p>
                                    </div>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.emailNotifications}
                                        onChange={(e) =>
                                            handleChange('emailNotifications', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Quiet Hours Section */}
                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
                            Quiet Hours
                        </h2>

                        <div className="space-y-6">
                            {/* Enable Quiet Hours */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Enable Quiet Hours
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Mute notifications during specific times
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.quietHours}
                                        onChange={(e) =>
                                            handleChange('quietHours', e.target.checked)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            {/* Quiet Hours Times */}
                            {preferences.quietHours && (
                                <div className="grid grid-cols-2 gap-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={preferences.quietHoursStart}
                                            onChange={(e) =>
                                                handleChange('quietHoursStart', e.target.value)
                                            }
                                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={preferences.quietHoursEnd}
                                            onChange={(e) =>
                                                handleChange('quietHoursEnd', e.target.value)
                                            }
                                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button - Centered */}
                <div className="flex items-center justify-center mt-8">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg"
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>

                {/* Footer Info - Centered */}
                <div className="flex items-center justify-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                        Your preferences are saved automatically and applied immediately
                    </p>
                </div>
            </div>
        </div>
    );
}
