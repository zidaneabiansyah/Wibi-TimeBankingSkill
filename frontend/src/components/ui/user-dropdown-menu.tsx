'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { m, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    Settings,
    HelpCircle,
    LogOut,
    User,
    LayoutDashboard,
    BookOpen,
    Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserDropdownMenuProps {
    trigger?: React.ReactNode;
    className?: string;
}

/**
 * User dropdown menu for authenticated users
 * Shows profile, navigation links, and logout
 */
export function UserDropdownMenu({ trigger, className }: UserDropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, logout } = useAuthStore();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsOpen(false);
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

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: 'Dashboard',
            href: '/dashboard',
            group: 'main',
        },
        {
            icon: User,
            label: 'My Profile',
            href: '/profile',
            group: 'main',
        },
        {
            icon: BookOpen,
            label: 'My Skills',
            href: '/profile/skills',
            group: 'main',
        },
        {
            icon: Calendar,
            label: 'My Sessions',
            href: '/dashboard/sessions',
            group: 'main',
        },
        {
            icon: Settings,
            label: 'Settings',
            href: '/profile/settings',
            group: 'secondary',
        },
        {
            icon: HelpCircle,
            label: 'Help & Support',
            href: '/contact',
            group: 'secondary',
        },
    ];

    const dropdownVariants: Variants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.15,
                ease: 'easeOut' as const,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.1,
            },
        },
    };

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
                aria-label="Open user menu"
                aria-expanded={isOpen}
            >
                {trigger ? (
                    trigger
                ) : (
                    <div className="flex items-center gap-2">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.full_name}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-border hover:ring-primary transition-all"
                            />
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold ring-2 ring-border hover:ring-primary transition-all">
                                {getInitials(user?.full_name || 'U')}
                            </div>
                        )}
                        <svg
                            className={cn(
                                'h-4 w-4 text-muted-foreground transition-transform duration-200',
                                isOpen && 'rotate-180'
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-lg shadow-black/20 z-50 overflow-hidden"
                    >
                        {/* User Info Section */}
                        <div className="px-4 py-4 border-b border-border/40 bg-muted/30">
                            <div className="flex items-center gap-3">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.full_name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                        {getInitials(user?.full_name || 'U')}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">
                                        {user?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user?.email || 'No email'}
                                    </p>
                                </div>
                            </div>
                            {user?.credit_balance !== undefined && (
                                <div className="mt-3 flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-3 py-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span className="text-sm font-semibold">
                                        {user.credit_balance.toFixed(1)} Credits
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Main Menu Items */}
                        <div className="py-2">
                            {menuItems
                                .filter((item) => item.group === 'main')
                                .map((item) => (
                                    <MenuItem
                                        key={item.href}
                                        icon={item.icon}
                                        label={item.label}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                    />
                                ))}
                        </div>

                        {/* Secondary Menu Items */}
                        <div className="py-2 border-t border-border/40">
                            {menuItems
                                .filter((item) => item.group === 'secondary')
                                .map((item) => (
                                    <MenuItem
                                        key={item.href}
                                        icon={item.icon}
                                        label={item.label}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                    />
                                ))}
                        </div>

                        {/* Logout */}
                        <div className="py-2 border-t border-border/40">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors duration-200"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface MenuItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    onClick?: () => void;
}

function MenuItem({ icon: Icon, label, href, onClick }: MenuItemProps) {
    return (
        <Link href={href} onClick={onClick}>
            <div className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
            </div>
        </Link>
    );
}
