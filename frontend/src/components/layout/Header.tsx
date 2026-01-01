'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { NotificationBell, NotificationDropdown } from "@/components/notification";
import { UserDropdownMenu } from "@/components/ui/user-dropdown-menu";
import { MobileMenuDrawer, MobileMenuItem } from "@/components/ui/mobile-menu-drawer";
import { Menu } from 'lucide-react';

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const navLinks = [
        { href: '/marketplace', label: 'Marketplace' },
        { href: '/community', label: 'Community' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/dashboard/sessions', label: 'Sessions' },
        { href: '/profile', label: 'Profile' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <img src="/wibi.png" alt="Wibi Logo" className="h-7 w-7 rounded-md" />
                            </div>
                            <span className="text-xl font-bold text-primary hidden sm:inline">Wibi</span>
                        </Link>
                    </div>

                    {/* Right Section - Authenticated */}
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            {/* Notification Bell */}
                            <div className="relative hidden sm:block">
                                <div onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}>
                                    <NotificationBell />
                                </div>
                                <NotificationDropdown
                                    isOpen={isNotificationDropdownOpen}
                                    onClose={() => setIsNotificationDropdownOpen(false)}
                                />
                            </div>

                            {/* Credits Badge */}
                            <div
                                className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-2.5 py-1.5 text-xs sm:text-sm font-semibold hidden sm:flex"
                                title={`Available Credits: ${user.credit_balance?.toFixed(1) || '0.0'}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{user.credit_balance?.toFixed(1) || '0.0'}</span>
                            </div>

                            {/* User Dropdown Menu */}
                            <UserDropdownMenu />

                            {/* Mobile Menu Button */}
                            <MobileMenuDrawer
                                side="right"
                                className="md:hidden"
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                }
                            >
                                <div className="space-y-1">
                                    <h3 className="text-xs font-semibold text-muted-foreground px-4 py-2 uppercase tracking-wider">
                                        Navigation
                                    </h3>
                                    <MobileMenuItem
                                        label="Dashboard"
                                        href="/dashboard"
                                    />
                                    <MobileMenuItem
                                        label="Marketplace"
                                        href="/marketplace"
                                    />
                                    <MobileMenuItem
                                        label="My Sessions"
                                        href="/dashboard/sessions"
                                    />
                                    <MobileMenuItem
                                        label="Community"
                                        href="/community"
                                    />

                                    <div className="h-px bg-border/40 my-2" />

                                    <h3 className="text-xs font-semibold text-muted-foreground px-4 py-2 uppercase tracking-wider">
                                        Account
                                    </h3>
                                    <MobileMenuItem
                                        label="My Profile"
                                        href="/profile"
                                    />
                                    <MobileMenuItem
                                        label="My Skills"
                                        href="/profile/skills"
                                    />
                                    <MobileMenuItem
                                        label="Settings"
                                        href="/profile/settings"
                                    />

                                    <div className="h-px bg-border/40 my-2" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </MobileMenuDrawer>
                        </div>
                    ) : (
                        /* Not Authenticated - Login/Signup Buttons */
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
