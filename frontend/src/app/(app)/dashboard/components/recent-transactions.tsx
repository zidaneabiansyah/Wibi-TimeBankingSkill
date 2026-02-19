'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading";
import { m } from "framer-motion";
import { Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction } from "@/types";

interface RecentTransactionsProps {
    transactions: Transaction[];
    isLoading: boolean;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function getTransactionTypeColor(type: string): string {
    switch (type) {
        case 'earned':
        case 'initial':
        case 'bonus':
            return 'text-green-500';
        case 'spent':
        case 'hold':
            return 'text-red-500';
        case 'refund':
            return 'text-blue-500';
        default:
            return '';
    }
}

function getTransactionIcon(type: string) {
    switch (type) {
        case 'earned':
        case 'initial':
        case 'bonus':
        case 'refund':
            return <ArrowUpRight className="h-4 w-4" />;
        case 'spent':
        case 'hold':
            return <ArrowDownRight className="h-4 w-4" />;
        default:
            return <Receipt className="h-4 w-4" />;
    }
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Recent Transactions</h2>
                    <p className="text-sm text-muted-foreground mt-1">Your latest credit activity</p>
                </div>
                <Link href="/dashboard/transactions">
                    <Button variant="outline" className="border-border/40 hover:border-primary/50">
                        View All
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <LoadingSkeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <LoadingSkeleton className="h-4 w-32" />
                                        <LoadingSkeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <LoadingSkeleton className="h-6 w-16" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ) : transactions.length === 0 ? (
                <EmptyState
                    icon={Receipt}
                    title="No transactions yet"
                    description="Your transaction history will appear here"
                    variant="card"
                />
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {transactions.map((transaction: Transaction, index: number) => (
                                <m.div
                                    key={transaction.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.type === 'earned' || transaction.type === 'initial' || transaction.type === 'bonus'
                                                ? 'bg-green-500/10 text-green-500'
                                                : transaction.type === 'spent' || transaction.type === 'hold'
                                                    ? 'bg-red-500/10 text-red-500'
                                                    : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {getTransactionIcon(transaction.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{transaction.description}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-sm font-bold ${getTransactionTypeColor(transaction.type)}`}>
                                            {transaction.type === 'spent' || transaction.type === 'hold' ? '-' : '+'}
                                            {transaction.amount.toFixed(1)}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {transaction.type}
                                        </Badge>
                                    </div>
                                </m.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </m.div>
    );
}
