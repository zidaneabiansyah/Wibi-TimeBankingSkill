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
import { Search, MoreVertical, Eye, Trash2, Loader2, Filter, MessageSquare, FileText, Flag, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/lib/services/admin.service';

interface ForumThread {
    id: number;
    title: string;
    author: any;
    category: string;
    replies_count: number;
    views_count: number;
    is_pinned: boolean;
    is_closed: boolean;
    created_at: string;
}

interface Report {
    id: number;
    type: 'forum' | 'story' | 'user';
    reported_by: string;
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
    created_at: string;
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    dismissed: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300',
};

export default function CommunityPage() {
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'forum' | 'reports'>('forum');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [threadsResult, reportsResult] = await Promise.all([
                adminService.getAllForumThreads(),
                adminService.getAllReports()
            ]);

            setThreads(threadsResult.data as any || []);
            setReports(reportsResult.data || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load community data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResolveReport = async (reportId: number) => {
        try {
            await adminService.resolveReport(reportId, 'Resolved by admin via dashboard');
            toast.success('Report resolved successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to resolve report');
        }
    };

    const handleDismissReport = async (reportId: number) => {
        try {
            await adminService.dismissReport(reportId);
            toast.success('Report dismissed successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to dismiss report');
        }
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
                <h1 className="text-3xl font-bold tracking-tight">Community Management</h1>
                <p className="text-muted-foreground">Moderate forum, stories, and handle reports</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Forum Threads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <div className="text-2xl font-bold">{threads.length}</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {threads.reduce((sum, t) => sum + (t.views_count || 0), 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-red-600" />
                            <div className="text-2xl font-bold text-red-600">
                                {reports.filter((r) => r.status === 'pending').length}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Resolved Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {reports.filter((r) => r.status === 'resolved').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                <Button
                    variant={activeTab === 'forum' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('forum')}
                >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Forum Threads
                </Button>
                <Button
                    variant={activeTab === 'reports' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('reports')}
                >
                    <Flag className="mr-2 h-4 w-4" />
                    Reports
                    {reports.filter((r) => r.status === 'pending').length > 0 && (
                        <Badge className="ml-2" variant="destructive">
                            {reports.filter((r) => r.status === 'pending').length}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Forum Threads Table */}
            {activeTab === 'forum' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Forum Threads</CardTitle>
                                <CardDescription>Manage all forum discussions</CardDescription>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search threads..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-8"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Replies</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {threads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            No threads found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    threads.map((thread) => (
                                        <TableRow key={thread.id}>
                                            <TableCell className="font-medium">{thread.title}</TableCell>
                                            <TableCell>{thread.author?.full_name || thread.author?.username || 'Unknown User'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{thread.category}</Badge>
                                            </TableCell>
                                            <TableCell>{thread.replies_count}</TableCell>
                                            <TableCell>{thread.views_count}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {thread.is_pinned && (
                                                        <Badge variant="secondary">Pinned</Badge>
                                                    )}
                                                    {thread.is_closed && (
                                                        <Badge variant="destructive">Closed</Badge>
                                                    )}
                                                </div>
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
                                                            View Thread
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Thread
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
            )}

            {/* Reports Table */}
            {activeTab === 'reports' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Content Reports</CardTitle>
                                <CardDescription>Review and moderate reported content</CardDescription>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-8"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reported By</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No reports found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>
                                                <Badge variant="outline">{report.type.toUpperCase()}</Badge>
                                            </TableCell>
                                            <TableCell>{report.reported_by}</TableCell>
                                            <TableCell className="max-w-xs truncate">{report.reason}</TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[report.status]} variant="outline">
                                                    {report.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(report.created_at).toLocaleDateString()}
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
                                                        {report.status === 'pending' && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleResolveReport(report.id)}
                                                                    className="text-green-600"
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Resolve Report
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDismissReport(report.id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Dismiss Report
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
            )}
        </div>
    );
}
