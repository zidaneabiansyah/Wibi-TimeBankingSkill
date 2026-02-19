'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, Lock, Undo2 } from 'lucide-react'
import type { Transaction } from '@/types'

interface TransactionDetailModalProps {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
}

export default function TransactionDetailModal({
    transaction,
    isOpen,
    onClose,
}: TransactionDetailModalProps) {
    if (!transaction) return null

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'earned':
            case 'bonus':
                return <ArrowUpRight className="h-5 w-5 text-green-500" />
            case 'spent':
                return <ArrowDownLeft className="h-5 w-5 text-red-500" />
            case 'hold':
                return <Lock className="h-5 w-5 text-yellow-500" />
            case 'refund':
                return <Undo2 className="h-5 w-5 text-blue-500" />
            default:
                return null
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'earned':
                return 'Earned'
            case 'spent':
                return 'Spent'
            case 'hold':
                return 'Hold'
            case 'refund':
                return 'Refund'
            case 'bonus':
                return 'Bonus'
            case 'penalty':
                return 'Penalty'
            default:
                return type
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'earned':
            case 'bonus':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            case 'spent':
            case 'penalty':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            case 'hold':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
            case 'refund':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
        }
    }

    const amountDisplay = transaction.amount > 0 ? `+${transaction.amount.toFixed(1)}` : transaction.amount.toFixed(1)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Transaction Details</DialogTitle>
                    <DialogDescription>
                        View complete transaction information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Transaction Header */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                            {getTypeIcon(transaction.type)}
                            <div>
                                <p className="text-sm font-medium">{getTypeLabel(transaction.type)}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(transaction.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-bold ${
                                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {amountDisplay}
                            </p>
                            <p className="text-xs text-muted-foreground">credits</p>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Type</p>
                            <Badge className={getTypeColor(transaction.type)}>
                                {getTypeLabel(transaction.type)}
                            </Badge>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Description</p>
                            <p className="text-sm font-medium">{transaction.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Balance Before</p>
                                <p className="text-sm font-medium">{transaction.balance_before.toFixed(1)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Balance After</p>
                                <p className="text-sm font-medium">{transaction.balance_after.toFixed(1)}</p>
                            </div>
                        </div>

                        {transaction.session_id && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Related Session</p>
                                <p className="text-sm font-medium">Session #{transaction.session_id}</p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Transaction Date</p>
                            <p className="text-sm font-medium">
                                {new Date(transaction.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <Card className="bg-muted border-0">
                        <CardContent className="pt-6">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount Changed</span>
                                    <span className={transaction.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                        {amountDisplay}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="text-muted-foreground">Net Impact</span>
                                    <span className="font-medium">
                                        {(transaction.balance_after - transaction.balance_before).toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}
