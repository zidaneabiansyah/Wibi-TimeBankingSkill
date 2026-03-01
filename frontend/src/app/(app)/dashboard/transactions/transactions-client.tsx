'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/stores/user.store';
import { useAuthStore } from '@/stores/auth.store';
import { Receipt, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading';
import type { Transaction } from '@/types';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800']
});

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
      return <ArrowDown className="h-5 w-5" />;
    case 'spent':
    case 'hold':
      return <ArrowUp className="h-5 w-5" />;
    default:
      return <Receipt className="h-5 w-5" />;
  }
}

function getTransactionColor(type: string): string {
  switch (type) {
    case 'earned':
    case 'initial':
    case 'bonus':
      return 'text-emerald-400 bg-emerald-500/10';
    case 'spent':
    case 'hold':
      return 'text-rose-400 bg-rose-500/10';
    case 'refund':
      return 'text-sky-400 bg-sky-500/10';
    default:
      return 'text-zinc-400 bg-zinc-800/10';
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
    <main className={`container mx-auto px-4 py-8 mb-20 max-w-7xl ${plusJakartaSans.className}`}>

      {/* Top Header Row aligned with controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground font-medium text-sm">Track your credit earnings and spending</p>
        </div>

        {/* Filter Tabs & Navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-[350px] grid-cols-3 bg-white/5 border border-white/10 p-1.5 rounded-3xl h-auto shadow-sm">
              <TabsTrigger value="all" className="rounded-2xl font-bold text-xs md:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">All</TabsTrigger>
              <TabsTrigger value="earned" className="rounded-2xl font-bold text-xs md:text-sm py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-black data-[state=active]:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">Earned</TabsTrigger>
              <TabsTrigger value="spent" className="rounded-2xl font-bold text-xs md:text-sm py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all">Spent</TabsTrigger>
            </TabsList>
          </Tabs>

          <Link href="/dashboard" className="w-full sm:w-auto shrink-0">
            <Button variant="secondary" className="w-full sm:w-auto rounded-2xl font-bold backdrop-blur-md bg-card/10 hover:bg-card/30 border border-white/10 shadow-sm transition-all text-foreground h-[48px] px-6">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Sidebar Overview (col-span-4) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start animate-in fade-in slide-in-from-left-4 duration-700">

          {/* Current Balance (Primary Focus) */}
          <Card className="relative overflow-hidden border-border/20 bg-card/20 backdrop-blur-xl rounded-4xl shadow-none hover:shadow-xl hover:bg-card/40 transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[3rem] -mr-10 -mt-10 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">Available Credits</p>
                  <p className="text-5xl font-black text-primary tracking-tighter tabular-nums mb-1">
                    {((user?.credit_balance || 0) - (user?.credit_held || 0)).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Currently on hand</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Receipt className="h-7 w-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mini Stats Grid (Earned & Spent) */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="relative overflow-hidden border-border/20 bg-card/20 backdrop-blur-xl rounded-3xl shadow-none hover:shadow-md hover:bg-card/40 transition-all group">
              <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Earned</p>
                </div>
                <p className="text-2xl font-black text-emerald-400 tracking-tighter tabular-nums drop-shadow-sm truncate">
                  +{totalEarned.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/20 bg-card/20 backdrop-blur-xl rounded-3xl shadow-none hover:shadow-md hover:bg-card/40 transition-all group">
              <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                  </div>
                  <p className="text-xs uppercase tracking-widest font-bold text-zinc-500">Spent</p>
                </div>
                <p className="text-2xl font-black text-rose-400 tracking-tighter tabular-nums drop-shadow-sm truncate">
                  -{totalSpent.toFixed(1)}
                </p>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column: Transactions Ledger (col-span-8) */}
        <div className="lg:col-span-8 lg:pl-4">

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">



            {isLoading ? (
              <Card className="border-border/20 bg-card/20 backdrop-blur-xl shadow-none rounded-4xl">
                <CardContent className="p-6 space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl animate-pulse delay-[{i*100}ms]">
                      <div className="flex items-center gap-4 flex-1">
                        <LoadingSkeleton className="h-12 w-12 rounded-2xl shrink-0" />
                        <div className="space-y-2 flex-1">
                          <LoadingSkeleton className="h-5 w-48" />
                          <LoadingSkeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <LoadingSkeleton className="h-8 w-24 rounded-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : filteredTransactions.length === 0 ? (
              <div className="border border-dashed border-border/30 bg-card/10 backdrop-blur-xl shadow-none rounded-4xl overflow-hidden">
                <EmptyState
                  icon={Receipt}
                  title="No transactions yet"
                  description="Your transaction history will appear here"
                  variant="card"
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                {filteredTransactions.map((transaction: Transaction, index: number) => {
                  const isEarned = ['earned', 'initial', 'bonus', 'refund'].includes(transaction.type);

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 md:px-5 md:py-4 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/5 hover:border-white/10 hover:bg-white/8 transition-all shadow-sm group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-400 border border-white/5 group-hover:bg-white/10 transition-colors">
                          {getTransactionIcon(transaction.type)}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-sm md:text-[15px] font-bold text-zinc-100 truncate tracking-tight mb-0.5">
                            {transaction.description.length > 30 ? transaction.description.substring(0, 30) + '...' : transaction.description}
                          </p>
                          <p className="text-[11px] md:text-xs font-medium text-zinc-500 tracking-tight">
                            {transaction.created_at ? formatDate(transaction.created_at) : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Amount Block */}
                      <div className="flex flex-col items-end justify-center shrink-0 ml-4">
                        <span className={`text-base md:text-lg font-black tabular-nums tracking-tight mb-0.5 ${isEarned ? 'text-emerald-500' : 'text-zinc-100'
                          }`}>
                          {isEarned ? '+' : ''}{transaction.amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] md:text-[11px] font-bold text-zinc-500">
                          &approx;{Math.floor(transaction.amount)} crdt
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {transactions.length >= limit && (
                  <div className="flex justify-center gap-3 mt-8 pt-8 border-t border-border/10">
                    <Button
                      variant="secondary"
                      className="rounded-xl font-bold hover:bg-white/10 border-transparent bg-white/5 text-zinc-300"
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      className="rounded-xl font-bold hover:bg-white/10 border-transparent bg-white/5 text-zinc-300"
                      onClick={() => setPage(page + 1)}
                      disabled={transactions.length < limit}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
