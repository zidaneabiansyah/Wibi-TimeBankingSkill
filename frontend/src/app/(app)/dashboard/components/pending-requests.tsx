'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { m } from "framer-motion";
import type { Session } from "@/types";

interface PendingRequestsProps {
    requests: Session[];
    onReview: (session: Session) => void;
}

export function PendingRequests({ requests, onReview }: PendingRequestsProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="border-secondary/30 bg-linear-to-br from-secondary/5 to-transparent hover:border-secondary/50 transition-all duration-300">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        {requests.length} Pending Request{requests.length > 1 ? 's' : ''}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">Students are waiting for your approval</p>
                    <div className="space-y-2">
                        {requests.slice(0, 3).map((session: Session) => (
                            <m.div
                                key={session.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 bg-muted/30 border border-border/20 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{session.student?.full_name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{session.title}</p>
                                </div>
                                <Button
                                    size="sm"
                                    className="ml-2 bg-primary hover:bg-primary/90"
                                    onClick={() => onReview(session)}
                                >
                                    Review
                                </Button>
                            </m.div>
                        ))}
                    </div>
                    {requests.length > 3 && (
                        <Link href="/dashboard/sessions">
                            <Button size="sm" variant="ghost" className="w-full text-primary hover:text-primary/80">
                                View All ({requests.length}) →
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        </m.div>
    );
}
