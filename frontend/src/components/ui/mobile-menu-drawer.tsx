'use client';

import { useState } from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { m, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface MobileMenuDrawerProps {
    children: React.ReactNode;
    trigger?: React.ReactNode;
    side?: 'left' | 'right';
    className?: string;
    onOpenChange?: (open: boolean) => void;
}

/**
 * Mobile-optimized drawer/menu component
 * Automatically opens/closes on mobile screens
 */
export function MobileMenuDrawer({
    children,
    trigger,
    side = 'left',
    className,
    onOpenChange,
}: MobileMenuDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        onOpenChange?.(open);
    };

    const drawerVariants: Variants = {
        hidden: {
            x: side === 'left' ? -500 : 500,
            opacity: 0,
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300,
            },
        },
    };

    const overlayVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.2 },
        },
    };

    return (
        <>
            {/* Trigger Button */}
            {trigger ? (
                <div onClick={() => handleOpenChange(!isOpen)}>
                    {trigger}
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => handleOpenChange(!isOpen)}
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            )}

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => handleOpenChange(false)}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={cn(
                            'fixed top-0 bottom-0 z-50 w-80 max-w-[90vw] bg-background border-border md:hidden overflow-y-auto',
                            side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
                            className
                        )}
                    >
                        {/* Close Button */}
                        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border/40 bg-background/95 backdrop-blur">
                            <h2 className="font-semibold">Menu</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChange(false)}
                                aria-label="Close menu"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-4">{children}</div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}

/**
 * Mobile menu item component
 */
interface MobileMenuItemProps {
    icon?: React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    className?: string;
    badge?: string;
}

export function MobileMenuItem({
    icon,
    label,
    href,
    onClick,
    className,
    badge,
}: MobileMenuItemProps) {
    const Component = href ? 'a' : 'button';

    return (
        <Component
            href={href}
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                'active:bg-muted active:text-foreground',
                className
            )}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            <span className="flex-1 text-left font-medium">{label}</span>
            {badge && (
                <span className="shrink-0 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    {badge}
                </span>
            )}
        </Component>
    );
}
