'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSkillStore } from '@/stores/skill.store';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, BookOpen, Star, Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UserSkill } from '@/types';

export function SkillsClient() {
    const { userSkills, isLoadingUserSkills, fetchUserSkills, deleteUserSkill } = useSkillStore();
    const [skillToDelete, setSkillToDelete] = useState<UserSkill | null>(null);

    useEffect(() => {
        fetchUserSkills();
    }, [fetchUserSkills]);

    const handleDelete = async () => {
        if (!skillToDelete) return;

        try {
            await deleteUserSkill(skillToDelete.skill_id);
            toast.success('Skill removed successfully');
            setSkillToDelete(null);
            fetchUserSkills();
        } catch (error) {
            toast.error('Failed to remove skill');
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-green-500/10 text-green-500';
            case 'intermediate': return 'bg-blue-500/10 text-blue-500';
            case 'advanced': return 'bg-purple-500/10 text-purple-500';
            case 'expert': return 'bg-amber-500/10 text-amber-500';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'beginner': return '🌱';
            case 'intermediate': return '📈';
            case 'advanced': return '🚀';
            case 'expert': return '👑';
            default: return '📚';
        }
    };

    return (
        <>
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">My Skills</h1>
                            <p className="text-muted-foreground">Manage the skills you teach</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/dashboard">
                                <Button variant="outline">Back to Dashboard</Button>
                            </Link>
                            <Link href="/profile/skills/new">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Skill
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{userSkills.length}</p>
                                        <p className="text-xs text-muted-foreground">Total Skills</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {userSkills.reduce((sum: number, skill: UserSkill) => sum + (skill.total_sessions || 0), 0)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Total Sessions</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <Star className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {userSkills.length > 0
                                                ? (userSkills.reduce((sum: number, skill: UserSkill) => sum + (skill.average_rating || 0), 0) / userSkills.length).toFixed(1)
                                                : '0.0'
                                            }
                                        </p>
                                        <p className="text-xs text-muted-foreground">Avg Rating</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Skills List */}
                    {isLoadingUserSkills ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <LoadingSkeleton className="h-40 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : userSkills.length === 0 ? (
                        <EmptyState
                            icon={BookOpen}
                            title="No skills added yet"
                            description="Start teaching by adding your first skill!"
                            action={{
                                label: 'Add Your First Skill',
                                onClick: () => window.location.href = '/profile/skills/new',
                            }}
                            variant="card"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userSkills.map((userSkill: UserSkill) => (
                                <Card key={userSkill.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg truncate">
                                                    {userSkill.skill?.name || 'Unknown Skill'}
                                                </CardTitle>
                                                <CardDescription className="truncate">
                                                    {userSkill.skill?.category || 'Uncategorized'}
                                                </CardDescription>
                                            </div>
                                            <Badge className={`${getLevelColor(userSkill.level)} capitalize shrink-0`}>
                                                {getLevelIcon(userSkill.level)} {userSkill.level}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {userSkill.description || 'No description provided'}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Sessions</p>
                                                <p className="font-medium">{userSkill.total_sessions || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Reviews</p>
                                                <p className="font-medium">{userSkill.total_reviews || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Rating</p>
                                                <p className="font-medium">
                                                    ⭐ {userSkill.average_rating?.toFixed(1) || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Status</p>
                                                <Badge variant={userSkill.is_available ? 'default' : 'secondary'} className="text-xs">
                                                    {userSkill.is_available ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex gap-2">
                                        <Link href={`/profile/skills/${userSkill.id}/edit`} className="flex-1">
                                            <Button variant="outline" className="w-full" size="sm">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setSkillToDelete(userSkill)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!skillToDelete} onOpenChange={() => setSkillToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove "{skillToDelete?.skill?.name}" from your teaching skills.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
