'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { m } from "framer-motion";
import { Calendar } from "lucide-react";
import type { Session } from "@/types";

interface UpcomingSessionsProps {
    sessions: Session[];
    isLoading: boolean;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function UpcomingSessions({ sessions, isLoading }: UpcomingSessionsProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                    <p className="text-sm text-muted-foreground mt-1">Your scheduled learning and teaching sessions</p>
                </div>
                <Link href="/dashboard/sessions">
                    <Button variant="outline" className="border-border/40 hover:border-primary/50">
                        View All
                    </Button>
                </Link>
            </div>

            {sessions.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="No upcoming sessions"
                    description="Book a session from the marketplace to get started!"
                    action={{
                        label: 'Browse Skills',
                        onClick: () => window.location.href = '/marketplace',
                    }}
                    variant="card"
                />
            ) : (
                <m.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"

                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.08,
                            },
                        },
                    }}
                >
                    {sessions.map((session: Session) => (
                        <m.div
                            key={session.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                            }}
                        >
                            <Link href={session.status === 'in_progress' ? `/dashboard/sessions/${session.id}/room` : `/dashboard/sessions`}>
                                <Card className={`h-full border-border/30 hover:shadow-lg transition-all duration-300 cursor-pointer group ${session.status === 'in_progress'
                                        ? 'border-primary/50 shadow-md shadow-primary/5 bg-primary/5'
                                        : 'hover:border-primary/40 hover:shadow-primary/10'
                                    }`}>
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CardTitle className={`text-lg transition-colors truncate ${session.status === 'in_progress' ? 'text-primary' : 'group-hover:text-primary'
                                                        }`}>
                                                        {session.title}
                                                    </CardTitle>
                                                    {session.status === 'in_progress' && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                            </span>
                                                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">Live</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <CardDescription className="text-xs">
                                                    {session.scheduled_at ? formatDate(session.scheduled_at) : 'Not scheduled'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={session.status === 'approved' ? 'default' : 'secondary'} className="text-xs shrink-0">
                                                {session.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">With:</span>
                                                <span className="font-medium truncate">
                                                    {session.teacher?.full_name || session.student?.full_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">Duration:</span>
                                                <span className="font-medium">{session.duration}h</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">Credits:</span>
                                                <span className="font-medium text-primary">{session.credit_amount}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </m.div>
                    ))}
                </m.div>
            )}
        </m.div>
    );
}
