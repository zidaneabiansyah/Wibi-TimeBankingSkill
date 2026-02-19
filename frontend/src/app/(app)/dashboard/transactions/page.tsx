import type { Metadata } from 'next';
import { TransactionsClient } from './transactions-client';

export const metadata: Metadata = {
    title: 'Transaction History - Track Your Credits | Wibi',
    description: 'View your complete transaction history. Track credits earned, spent, and your current balance.',
    keywords: ['transactions', 'credit history', 'time credits', 'earnings', 'spending'],
};

export default function TransactionsPage() {
    return <TransactionsClient />;
}
