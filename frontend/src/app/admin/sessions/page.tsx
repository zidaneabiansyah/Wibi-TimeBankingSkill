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
import { Search, MoreVertical, Eye, CheckCircle, XCircle, Loader2, Filter, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Session {
    id: number;
    teacher_name: string;
    learner_name: string;
    skill_name: string;
    status: 'pending' | 'approved' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
    mode: 'online' | 'offline';
    scheduled_date: string;
    duration: number;
    created_at: string;
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    in_progress: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    disputed: 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100 border-red-300',
};

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            // TODO: Replace with actual admin API endpoint
            const response = await fetch('/api/v1/admin/sessions', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSessions(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            toast.error('Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResolve = async (id: number, resolution: 'payout' | 'refund') => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sessions/${id}/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ resolution }),
            });

            if (response.ok) {
                toast.success(`Session resolved with ${resolution}`);
                fetchSessions();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to resolve session');
            }
        } catch (error) {
            toast.error('An error occurred while resolving the session');
        }
    };

    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            session.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.learner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.skill_name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === 'all' || session.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status: Session['status']) => {
        return (
            <Badge className={statusColors[status]} variant="outline">
                {status.replace('_', ' ').toUpperCase()}
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
                <h1 className="text-3xl font-bold tracking-tight">Sessions Management</h1>
                <p className="text-muted-foreground">Monitor and manage all learning sessions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessions.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {sessions.filter((s) => s.status === 'pending').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {sessions.filter((s) => s.status === 'in_progress').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {sessions.filter((s) => s.status === 'completed').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {sessions.filter((s) => s.status === 'cancelled').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sessions Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Sessions</CardTitle>
                            <CardDescription>View and manage all learning sessions</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search sessions..."
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
                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                        All Sessions
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                                        Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('in_progress')}>
                                        In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                                        Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>
                                        Cancelled
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('disputed')}>
                                        Disputed
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Session ID</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Learner</TableHead>
                                <TableHead>Skill</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Scheduled</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSessions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                                        No sessions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell className="font-medium">#{session.id}</TableCell>
                                        <TableCell>{session.teacher_name}</TableCell>
                                        <TableCell>{session.learner_name}</TableCell>
                                        <TableCell>{session.skill_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {session.mode === 'online' ? '🌐 Online' : '📍 Offline'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                                        <TableCell>
                                            {session.scheduled_date
                                                ? new Date(session.scheduled_date).toLocaleDateString()
                                                : '-'}
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
                                                    {session.status === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem className="text-green-600">
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Approve Session
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Reject Session
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {session.status === 'in_progress' && (
                                                        <DropdownMenuItem className="text-blue-600">
                                                            <Clock className="mr-2 h-4 w-4" />
                                                            Mark as Completed
                                                        </DropdownMenuItem>
                                                    )}
                                                    {session.status === 'disputed' && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuLabel>Dispute Resolution</DropdownMenuLabel>
                                                            <DropdownMenuItem 
                                                                className="text-green-600"
                                                                onClick={() => handleResolve(session.id, 'payout')}
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Resolve (Payout Teacher)
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-red-600"
                                                                onClick={() => handleResolve(session.id, 'refund')}
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Resolve (Refund Student)
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
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
