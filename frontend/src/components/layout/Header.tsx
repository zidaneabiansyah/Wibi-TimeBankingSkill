'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import dynamic from 'next/dynamic';
import { Menu, Clock, Wallet } from 'lucide-react';

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

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
    });

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
        { href: '/marketplace', label: 'MARKETPLACE' },
        { href: '/how-it-works', label: 'WORKFLOW' },
        { href: '/about', label: 'STORY' },
        { href: '/community', label: 'COMMUNITY' },
    ];

    return (
        <motion.header
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -120, opacity: 0 }
            }}
            animate={isHidden ? "hidden" : "visible"}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 py-6 pointer-events-none"
        >
            <div
                className={`
                    pointer-events-auto transition-all duration-500 ease-in-out
                    flex h-18 sm:h-20 items-center justify-between
                    ${isScrolled ? 'max-w-6xl' : 'max-w-7xl'}
                    w-full px-6 sm:px-10
                    bg-black/40 backdrop-blur-3xl 
                    border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                    rounded-[2rem] sm:rounded-[3rem]
                    ${isScrolled ? 'border-orange-500/10' : 'border-white/10'}
                `}
            >
                {/* Logo Section */}
                <div className="flex-1 flex items-center">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
                        <Image
                            src="/wibi.png"
                            alt="Wibi Logo"
                            width={48}
                            height={48}
                            className="rounded-md group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all group-hover:scale-105"
                            priority
                        />
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent hidden sm:inline tracking-tighter">Wibi</span>
                    </Link>
                </div>

                {/* Center Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {publicNavLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                text-[10px] sm:text-[11px] font-black tracking-[0.2em] transition-all duration-300
                                hover:text-orange-500 flex flex-col items-center group
                                ${pathname === link.href ? 'text-orange-500' : 'text-zinc-400'}
                            `}
                        >
                            {link.label}
                            <span
                                className={`
                                    h-[2px] w-0 bg-orange-600 rounded-full transition-all duration-300 mt-0.5
                                    ${pathname === link.href ? 'w-full' : 'group-hover:w-full'}
                                `}
                            />
                        </Link>
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

                            {/* Credits Badge */}
                            <div
                                className="hidden sm:flex items-center gap-2 text-orange-500 font-black cursor-default group/credit"
                                title={`Credits: ${user.credit_balance?.toFixed(1) || '0.0'}`}
                            >
                                <Clock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span className="tabular-nums text-sm">{user.credit_balance?.toFixed(1) || '0.0'}</span>
                            </div>

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
                                        className="md:hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl h-11 w-11"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="h-5 w-5 text-zinc-400" />
                                    </Button>
                                }
                            >
                                <div className="space-y-1 p-4">
                                    <h3 className="text-[10px] font-black text-zinc-600 px-4 py-2 uppercase tracking-[0.2em] mb-2">Navigation</h3>
                                    <MobileMenuItem label="DASHBOARD" href="/dashboard" />
                                    <MobileMenuItem label="MARKETPLACE" href="/marketplace" />
                                    <MobileMenuItem label="MY SESSIONS" href="/dashboard/sessions" />
                                    <MobileMenuItem label="COMMUNITY" href="/community" />

                                    <div className="h-px bg-zinc-800/50 my-4" />

                                    <h3 className="text-[10px] font-black text-zinc-600 px-4 py-2 uppercase tracking-[0.2em] mb-2">Account</h3>
                                    <MobileMenuItem label="MY PROFILE" href="/profile" />
                                    <MobileMenuItem label="MY SKILLS" href="/profile/skills" />
                                    <MobileMenuItem label="SETTINGS" href="/profile/settings" />

                                    <div className="h-px bg-zinc-800/50 my-4" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-black text-red-500 hover:bg-red-500/5 rounded-2xl transition-all uppercase tracking-widest"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </MobileMenuDrawer>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 sm:gap-3 px-1.5 py-1.5 bg-black/40 rounded-full border border-white/5">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-transparent">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="h-10 px-6 bg-orange-600 hover:bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.05] active:scale-[0.95]">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile Menu for Unauthenticated */}
                            <MobileMenuDrawer
                                side="right"
                                className="md:hidden"
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl h-11 w-11"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="h-5 w-5 text-zinc-400" />
                                    </Button>
                                }
                            >
                                <div className="space-y-1 p-4">
                                    <h3 className="text-[10px] font-black text-zinc-600 px-4 py-2 uppercase tracking-[0.2em] mb-4">Navigation</h3>
                                    {publicNavLinks.map((link) => (
                                        <MobileMenuItem
                                            key={link.href}
                                            label={link.label}
                                            href={link.href}
                                        />
                                    ))}
                                    <div className="h-px bg-zinc-800/50 my-6" />
                                    <div className="flex flex-col gap-3">
                                        <Link href="/login" className="w-full">
                                            <Button variant="outline" className="w-full h-12 bg-transparent border-zinc-800 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl">Login</Button>
                                        </Link>
                                        <Link href="/register" className="w-full">
                                            <Button className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl">Sign Up</Button>
                                        </Link>
                                    </div>
                                </div>
                            </MobileMenuDrawer>
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
