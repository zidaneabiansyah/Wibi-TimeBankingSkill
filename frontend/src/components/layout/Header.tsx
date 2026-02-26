'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useTheme } from "next-themes";
import dynamic from 'next/dynamic';
import { Menu, Sun, Moon } from 'lucide-react';

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

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { resolvedTheme, setTheme } = useTheme();
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll effect for navbar transparency
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const publicNavLinks = [
        { href: '/marketplace', label: 'Marketplace' },
        { href: '/how-it-works', label: 'How It Work' },
        { href: '/about', label: 'About' },
        { href: '/community', label: 'Community' },
    ];

    return (
        <header className={`fixed inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500 ${isScrolled ? 'top-3' : 'top-6'}`}>
            <div
                className={`
                    pointer-events-auto transition-all duration-500 ease-in-out
                    flex items-center justify-between
                    ${isScrolled
                        ? 'h-14 sm:h-16 max-w-5xl bg-background/80 backdrop-blur-3xl border border-border shadow-xl rounded-full px-6 sm:px-8'
                        : 'h-18 sm:h-20 max-w-7xl bg-transparent backdrop-blur-none border-transparent shadow-none border rounded-[2rem] sm:rounded-[3rem] px-6 sm:px-10'}
                    w-full
                `}
            >
                {/* Logo Section */}
                <div className="flex-[0.5] sm:flex-1 flex items-center">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all group">
                        <Image
                            src="/wibi.png"
                            alt="Wibi Logo"
                            width={48}
                            height={48}
                            className={`rounded-md group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all duration-500 group-hover:scale-105 ${isScrolled ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12'}`}
                            priority
                        />
                        <span className={`font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden sm:inline tracking-tighter transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>Wibi</span>
                    </Link>
                </div>

                {/* Center Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {publicNavLinks.map((link) => (
                        <div key={link.href} className="relative flex flex-col items-center group">
                            <Link
                                href={link.href}
                                className={`
                                    text-[13px] font-bold transition-all duration-300
                                    hover:text-foreground flex flex-col items-center
                                    ${pathname === link.href ? 'text-foreground' : 'text-muted-foreground'}
                                `}
                            >
                                {link.label}
                            </Link>
                            <span
                                className={`
                                    h-[2px] w-full bg-orange-600 rounded-full transition-all duration-300 mt-1 absolute -bottom-2
                                    ${pathname === link.href ? 'opacity-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'}
                                `}
                                style={{ transformOrigin: 'center' }}
                            />
                        </div>
                    ))}
                </nav>

                {/* Right Action Section */}
                <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6">
                    {isAuthenticated && user ? (
                        <>
                            {/* Notification Bell */}
                            <div className="relative hidden sm:block">
                                <div
                                    onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                    className="transition-all cursor-pointer group"
                                >
                                    <NotificationBell />
                                </div>
                                <NotificationDropdown
                                    isOpen={isNotificationDropdownOpen}
                                    onClose={() => setIsNotificationDropdownOpen(false)}
                                />
                            </div>

                            {/* Dark/Light Mode Toggle */}
                            <button
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-200"
                                aria-label="Toggle theme"
                            >
                                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>

                            {/* User Dropdown Menu */}
                            <div className="flex items-center justify-center transition-all duration-300">
                                <UserDropdownMenu />
                            </div>

                            {/* Mobile Menu for Auth */}
                            <MobileMenuDrawer
                                side="right"
                                className="md:hidden"
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden bg-muted/50 border border-border rounded-2xl h-11 w-11"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                }
                            >
                                <div className="space-y-1 p-4">
                                    <h3 className="text-[10px] font-black text-muted-foreground px-4 py-2 uppercase tracking-[0.2em] mb-2">Navigation</h3>
                                    <MobileMenuItem label="DASHBOARD" href="/dashboard" />
                                    <MobileMenuItem label="MARKETPLACE" href="/marketplace" />
                                    <MobileMenuItem label="MY SESSIONS" href="/dashboard/sessions" />
                                    <MobileMenuItem label="COMMUNITY" href="/community" />

                                    <div className="h-px bg-border/50 my-4" />

                                    <h3 className="text-[10px] font-black text-muted-foreground px-4 py-2 uppercase tracking-[0.2em] mb-2">Account</h3>
                                    <MobileMenuItem label="MY PROFILE" href="/profile" />
                                    <MobileMenuItem label="MY SKILLS" href="/profile/skills" />
                                    <MobileMenuItem label="SETTINGS" href="/profile/settings" />

                                    <div className="h-px bg-border/50 my-4" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-black text-red-500 hover:bg-red-500/1 rounded-2xl transition-all uppercase tracking-widest"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </MobileMenuDrawer>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 sm:gap-3 px-1.5 py-1.5 bg-background/50 backdrop-blur rounded-full border border-border">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-foreground hover:bg-transparent">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="h-10 px-6 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.05] active:scale-[0.95]">
                                        Sign Up
                                    </Button>
                                </Link>
                                {/* Dark/Light Mode Toggle (Unauthenticated) */}
                                <button
                                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-200"
                                    aria-label="Toggle theme"
                                >
                                    {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Mobile Menu for Unauthenticated */}
                            <MobileMenuDrawer
                                side="right"
                                className="md:hidden"
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden bg-muted/50 border border-border rounded-2xl h-11 w-11"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                }
                            >
                                <div className="space-y-1 p-4">
                                    <h3 className="text-[10px] font-black text-muted-foreground px-4 py-2 uppercase tracking-[0.2em] mb-4">Navigation</h3>
                                    {publicNavLinks.map((link) => (
                                        <MobileMenuItem
                                            key={link.href}
                                            label={link.label}
                                            href={link.href}
                                        />
                                    ))}
                                    <div className="h-px bg-border/50 my-6" />
                                    <div className="flex flex-col gap-3">
                                        <Link href="/login" className="w-full">
                                            <Button variant="outline" className="w-full h-12 bg-transparent border-border text-foreground font-black text-[10px] uppercase tracking-widest rounded-2xl">Login</Button>
                                        </Link>
                                        <Link href="/register" className="w-full">
                                            <Button className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl">Sign Up</Button>
                                        </Link>
                                    </div>
                                </div>
                            </MobileMenuDrawer>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
