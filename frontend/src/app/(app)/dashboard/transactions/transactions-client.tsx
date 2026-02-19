'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/stores/user.store';
import { useAuthStore } from '@/stores/auth.store';
import { Receipt, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading';
import type { Transaction } from '@/types';

type TabValue = 'all' | 'earned' | 'spent';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getTransactionIcon(type: string) {
  switch (type) {
    case 'earned':
    case 'initial':
    case 'bonus':
    case 'refund':
      return <ArrowUpRight className="h-5 w-5" />;
    case 'spent':
    case 'hold':
      return <ArrowDownRight className="h-5 w-5" />;
    default:
      return <Receipt className="h-5 w-5" />;
  }
}

function getTransactionColor(type: string): string {
  switch (type) {
    case 'earned':
    case 'initial':
    case 'bonus':
      return 'text-green-500 bg-green-500/10';
    case 'spent':
    case 'hold':
      return 'text-red-500 bg-red-500/10';
    case 'refund':
      return 'text-blue-500 bg-blue-500/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
}

export function TransactionsClient() {
  const { user } = useAuthStore();
  const { transactions, isLoading, fetchTransactions } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [page, setPage] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchTransactions(limit, page * limit);
  }, [page, fetchTransactions]);

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'earned') {
      return ['earned', 'initial', 'bonus', 'refund'].includes(transaction.type);
    }
    if (activeTab === 'spent') {
      return ['spent', 'hold'].includes(transaction.type);
    }
    return true;
  });

  const totalEarned = transactions
    .filter(t => ['earned', 'initial', 'bonus', 'refund'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => ['spent', 'hold'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">Track your credit earnings and spending</p>
          </div>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-3xl font-bold text-primary">
                    {((user?.credit_balance || 0) - (user?.credit_held || 0)).toFixed(1)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-3xl font-bold text-green-500">
                    +{totalEarned.toFixed(1)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold text-red-500">
                    -{totalSpent.toFixed(1)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="spent">Spent</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Transactions List */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <LoadingSkeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <LoadingSkeleton className="h-4 w-48" />
                      <LoadingSkeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <LoadingSkeleton className="h-6 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : filteredTransactions.length === 0 ? (
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
                {filteredTransactions.map((transaction: Transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-lg font-bold ${
                        ['spent', 'hold'].includes(transaction.type) ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {['spent', 'hold'].includes(transaction.type) ? '-' : '+'}
                        {transaction.amount.toFixed(1)}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {transactions.length >= limit && (
                <div className="flex justify-center gap-2 mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={transactions.length < limit}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
