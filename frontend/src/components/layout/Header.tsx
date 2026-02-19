'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import dynamic from 'next/dynamic';

const NotificationBell = dynamic(
    () => import('@/components/features/notification').then((mod) => mod.NotificationBell),
    { ssr: false }
);

const NotificationDropdown = dynamic(
    () => import('@/components/features/notification').then((mod) => mod.NotificationDropdown),
    { ssr: false }
);
import { UserDropdownMenu } from "@/components/ui/user-dropdown-menu";
import { MobileMenuItem } from "@/components/ui/mobile-menu-drawer";
const MobileMenuDrawer = dynamic(
    () => import('@/components/ui/mobile-menu-drawer').then((mod) => mod.MobileMenuDrawer),
    { ssr: false }
);
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

    const publicNavLinks = [
        { href: '/marketplace', label: 'Marketplace' },
        { href: '/how-it-works', label: 'How It Works' },
        { href: '/about', label: 'About' },
        { href: '/community', label: 'Community' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex-1 flex items-center">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <Image 
                                    src="/wibi.png" 
                                    alt="Wibi Logo" 
                                    width={28}
                                    height={28}
                                    className="rounded-md" 
                                    priority
                                />
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">Wibi</span>
                        </Link>
                    </div>

                    {/* Center Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {publicNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${
                                    pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Action Section */}
                    <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
                        {isAuthenticated && user ? (
                            <>
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
                                    className="hidden sm:flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-2.5 py-1.5 text-xs sm:text-sm font-semibold"
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

                                {/* Mobile Menu for Auth */}
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
                                        <MobileMenuItem label="Dashboard" href="/dashboard" />
                                        <MobileMenuItem label="Marketplace" href="/marketplace" />
                                        <MobileMenuItem label="My Sessions" href="/dashboard/sessions" />
                                        <MobileMenuItem label="Community" href="/community" />

                                        <div className="h-px bg-border/40 my-2" />

                                        <h3 className="text-xs font-semibold text-muted-foreground px-4 py-2 uppercase tracking-wider">
                                            Account
                                        </h3>
                                        <MobileMenuItem label="My Profile" href="/profile" />
                                        <MobileMenuItem label="My Skills" href="/profile/skills" />
                                        <MobileMenuItem label="Settings" href="/profile/settings" />

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
                            </>
                        ) : (
                            <>
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

                                {/* Mobile Menu for Unauthenticated */}
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
                                        {publicNavLinks.map((link) => (
                                            <MobileMenuItem
                                                key={link.href}
                                                label={link.label}
                                                href={link.href}
                                            />
                                        ))}
                                        <div className="h-px bg-border/40 my-2" />
                                        <MobileMenuItem label="Login" href="/login" />
                                        <MobileMenuItem label="Sign Up" href="/register" />
                                    </div>
                                </MobileMenuDrawer>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
