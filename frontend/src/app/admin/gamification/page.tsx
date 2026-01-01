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
import { Search, MoreVertical, Eye, Edit, Trash2, Loader2, Filter, Plus, Trophy, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/lib/services/admin.service';

interface Badge {
    id: number;
    name: string;
    description: string;
    type: 'achievement' | 'milestone' | 'quality' | 'special';
    rarity: number;
    bonus_credits: number;
    total_earned: number;
    created_at: string;
}

const typeColors = {
    achievement: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    milestone: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    quality: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    special: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
};

const rarityStars = (rarity: number) => {
    return Array.from({ length: rarity }, (_, i) => (
        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
    ));
};

export default function GamificationPage() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllBadges();
            setBadges(data.badges as any || []);
        } catch (error) {
            console.error('Failed to fetch badges:', error);
            toast.error('Failed to load badges');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBadge = async (badgeId: number) => {
        try {
            await adminService.deleteBadge(badgeId);
            toast.success('Badge deleted successfully');
            fetchBadges();
        } catch (error) {
            toast.error('Failed to delete badge');
        }
    };

    const filteredBadges = badges.filter((badge) => {
        const matchesSearch =
            badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterType === 'all' || badge.type === filterType;

        return matchesSearch && matchesFilter;
    });

    const getTypeBadge = (type: Badge['type']) => {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gamification</h1>
                    <p className="text-muted-foreground">Manage badges, achievements, and leaderboards</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Badge
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            <div className="text-2xl font-bold">{badges.length}</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            <div className="text-2xl font-bold">
                                {badges.reduce((sum, b) => sum + b.total_earned, 0)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Bonus Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {badges.reduce((sum, b) => sum + b.bonus_credits, 0)} CR
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Special Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {badges.filter((b) => b.type === 'special').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Badges Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Badges</CardTitle>
                            <CardDescription>View and manage all badges and achievements</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search badges..."
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
                                    <DropdownMenuItem onClick={() => setFilterType('achievement')}>
                                        Achievement
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('milestone')}>
                                        Milestone
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('quality')}>
                                        Quality
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterType('special')}>
                                        Special
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
                                <TableHead>Badge Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Rarity</TableHead>
                                <TableHead>Bonus Credits</TableHead>
                                <TableHead>Times Earned</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBadges.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No badges found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBadges.map((badge) => (
                                    <TableRow key={badge.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{badge.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {badge.description}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getTypeBadge(badge.type)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {rarityStars(badge.rarity)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-green-600">
                                                +{badge.bonus_credits} CR
                                            </span>
                                        </TableCell>
                                        <TableCell>{badge.total_earned}</TableCell>
                                        <TableCell>
                                            {new Date(badge.created_at).toLocaleDateString()}
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
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Badge
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteBadge(badge.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Badge
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

            {/* Leaderboards Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Leaderboards</CardTitle>
                    <CardDescription>Top performers across different categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Top Teachers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">View leaderboard →</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Most Active</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">View leaderboard →</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Top Rated</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">View leaderboard →</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
