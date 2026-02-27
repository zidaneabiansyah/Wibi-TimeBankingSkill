'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Eye, Download, Loader2, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/lib/services/admin.service';

interface Transaction {
    id: number;
    user?: {
        full_name: string;
        username: string;
    };
    type: 'earned' | 'spent' | 'hold' | 'refund' | 'bonus' | 'penalty';
    amount: number;
    description: string;
    created_at: string;
}

const typeColors = {
    earned: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    spent: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    refund: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    bonus: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    penalty: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
};

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const result = await adminService.getAllTransactions();
            setTransactions(result.data as any || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const userName = transaction.user?.full_name || transaction.user?.username || 'Unknown';
        const description = transaction.description || '';
        const matchesSearch =
            userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterType === 'all' || transaction.type === filterType;

        return matchesSearch && matchesFilter;
    });

    const totalEarned = transactions
        .filter((t) => t.type === 'earned')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
        .filter((t) => t.type === 'spent')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalHeld = transactions
        .filter((t) => t.type === 'hold')
        .reduce((sum, t) => sum + t.amount, 0);

    const getTypeBadge = (type: Transaction['type']) => {
        return (
            <Badge className={typeColors[type]} variant="outline">
                {type.toUpperCase()}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <p className="text-muted-foreground">Monitor all credit transactions on the platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactions.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <div className="text-2xl font-bold text-green-600">{totalEarned} CR</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <div className="text-2xl font-bold text-red-600">{totalSpent} CR</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Credits on Hold</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{totalHeld} CR</div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Transactions</CardTitle>
                            <CardDescription>View and monitor all credit transactions</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search transactions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-8"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setFilterType('all')}>
                                        All Types
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('earned')}>
                                        Earned
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('spent')}>
                                        Spent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('hold')}>
                                        Hold
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('refund')}>
                                        Refund
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('bonus')}>
                                        Bonus
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">#{transaction.id}</TableCell>
                                        <TableCell>{transaction.user?.full_name || transaction.user?.username || 'Unknown User'}</TableCell>
                                        <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`font-medium ${transaction.type === 'earned' || transaction.type === 'bonus'
                                                        ? 'text-green-600'
                                                        : transaction.type === 'spent' || transaction.type === 'penalty'
                                                            ? 'text-red-600'
                                                            : ''
                                                    }`}
                                            >
                                                {transaction.type === 'earned' || transaction.type === 'bonus' ? '+' : '-'}
                                                {transaction.amount} CR
                                            </span>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {transaction.description}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(transaction.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
