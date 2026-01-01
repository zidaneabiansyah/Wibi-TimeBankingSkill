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
import { Search, MoreVertical, Eye, Edit, Trash2, Loader2, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/lib/services/admin.service';

interface Skill {
    id: number;
    name: string;
    category: string;
    total_teachers: number;
    total_learners: number;
    total_sessions: number;
    created_at: string;
}

const categoryColors: Record<string, string> = {
    academic: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-yellow-300',
    technical: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    creative: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
    language: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    sports: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300',
};

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setIsLoading(true);
            const result = await adminService.getAllSkills();
            setSkills(result.data as any || []);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
            toast.error('Failed to load skills');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSkill = async (skillId: number) => {
        try {
            await adminService.deleteAdminSkill(skillId);
            toast.success('Skill deleted successfully');
            fetchSkills();
        } catch (error) {
            toast.error('Failed to delete skill');
        }
    };

    const filteredSkills = skills.filter((skill) => {
        const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterCategory === 'all' || skill.category === filterCategory;
        return matchesSearch && matchesFilter;
    });

    const getCategoryBadge = (category: string) => {
        return (
            <Badge className={categoryColors[category] || categoryColors.other} variant="outline">
                {category.toUpperCase()}
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
                    <h1 className="text-3xl font-bold tracking-tight">Skills Management</h1>
                    <p className="text-muted-foreground">Manage all skills available on the platform</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Skill
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{skills.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {skills.reduce((sum, s) => sum + s.total_teachers, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {skills.reduce((sum, s) => sum + s.total_learners, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {skills.reduce((sum, s) => sum + s.total_sessions, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Skills Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Skills</CardTitle>
                            <CardDescription>View and manage all available skills</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search skills..."
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
                                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                                        All Categories
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterCategory('academic')}>
                                        Academic
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterCategory('technical')}>
                                        Technical
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterCategory('creative')}>
                                        Creative
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterCategory('language')}>
                                        Language
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterCategory('sports')}>
                                        Sports
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
                                <TableHead>Skill Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Teachers</TableHead>
                                <TableHead>Learners</TableHead>
                                <TableHead>Sessions</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSkills.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No skills found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSkills.map((skill) => (
                                    <TableRow key={skill.id}>
                                        <TableCell className="font-medium">{skill.name}</TableCell>
                                        <TableCell>{getCategoryBadge(skill.category)}</TableCell>
                                        <TableCell>{skill.total_teachers}</TableCell>
                                        <TableCell>{skill.total_learners}</TableCell>
                                        <TableCell>{skill.total_sessions}</TableCell>
                                        <TableCell>
                                            {new Date(skill.created_at).toLocaleDateString()}
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
                                                        Edit Skill
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteSkill(skill.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Skill
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
