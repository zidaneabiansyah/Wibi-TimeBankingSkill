'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Edit, 
    Trash2, 
    Star, 
    Clock, 
    Users, 
    ExternalLink,
    Globe,
    Home,
    Zap,
    // Fix 1: Added BookOpen and Loader2 imports
    BookOpen,
    Loader2,
    AlertCircle
} from 'lucide-react'
import { useSkillStore } from '@/stores'
import { toast } from 'sonner'
import AddSkillForm from './AddSkillForm'

// --- Local Component Definitions to Fix Missing References ---
// You should likely move these to separate files in @/components/ui/ or @/components/common/

const LoadingSpinner = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
    const sizeMap = { sm: "h-4 w-4", default: "h-6 w-6", lg: "h-8 w-8" };
    return <Loader2 className={`animate-spin text-primary ${sizeMap[size as keyof typeof sizeMap]}`} />;
};

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void, variant?: string }) => (
    <div className="flex flex-col items-center justify-center p-6 text-center text-red-500 gap-2">
        <AlertCircle className="h-8 w-8" />
        <p>{message}</p>
        <Button variant="outline" onClick={onRetry} size="sm">Try Again</Button>
    </div>
);

const EmptyState = ({ icon: Icon, title, description, action }: any) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-sm mt-2 mb-6">{description}</p>
        {action && (
            <Button onClick={action.onClick}>{action.label}</Button>
        )}
    </div>
);
// -------------------------------------------------------------

interface UserSkillListProps {
    title?: string
    showAddButton?: boolean
}

export default function UserSkillList({
    title = "Skill yang Saya Ajarkan",
    showAddButton = true
}: UserSkillListProps) {
    const {
        userSkills,
        isLoadingUserSkills,
        error,
        fetchUserSkills,
        deleteUserSkill
    } = useSkillStore()

    useEffect(() => {
        fetchUserSkills()
    }, [fetchUserSkills])

    const handleDelete = async (skillId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus skill ini?')) {
            try {
                await deleteUserSkill(skillId)
                toast.success('Skill berhasil dihapus')
            } catch (error) {
                toast.error('Gagal menghapus skill')
            }
        }
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return 'bg-green-100 text-green-800'
            case 'intermediate': return 'bg-blue-100 text-blue-800'
            case 'advanced': return 'bg-purple-100 text-purple-800'
            case 'expert': return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'beginner': return '🌱'
            case 'intermediate': return '📈'
            case 'advanced': return '🚀'
            case 'expert': return '👑'
            default: return '📖'
        }
    }

    if (isLoadingUserSkills) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner size="lg" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ErrorState
                        message={error}
                        onRetry={fetchUserSkills}
                        variant="compact"
                    />
                </CardContent>
            </Card>
        )
    }

    if (userSkills.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        icon={BookOpen}
                        title="No skills added yet"
                        description="Add skills you can teach to start earning credits!"
                        action={showAddButton ? {
                            label: 'Add Skill',
                            onClick: () => {
                                // Trigger add skill form
                                const addButton = document.querySelector('[data-add-skill]') as HTMLElement;
                                addButton?.click();
                            },
                        } : undefined}
                        variant="compact"
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    {showAddButton && <AddSkillForm />}
                </CardHeader>
                <CardContent>
                    {userSkills.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userSkills.map((userSkill) => (
                                <Card key={userSkill.id} className="relative">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {/* Note: Ensure userSkill.skill.icon is a valid ReactNode or string */}
                                                <span className="text-2xl">{userSkill.skill.icon}</span>
                                                <div>
                                                    <h3 className="font-semibold text-sm">
                                                        {userSkill.skill.name}
                                                    </h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-xs ${getLevelColor(userSkill.level)}`}
                                                    >
                                                        {getLevelIcon(userSkill.level)} {userSkill.level}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => toast.info('Edit feature coming soon!')}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleDelete(userSkill.skill_id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {userSkill.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{userSkill.years_of_experience} tahun</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                <span>{userSkill.total_sessions} sesi</span>
                                            </div>
                                            {userSkill.average_rating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    <span>{userSkill.average_rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Zap className="h-3 w-3" />
                                                <span>{userSkill.hourly_rate} credit/jam</span>
                                            </div>
                                        </div>

                                        {/* Mode & Status */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {userSkill.online_only && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Globe className="w-3 h-3 mr-1" />
                                                        Online
                                                    </Badge>
                                                )}
                                                {userSkill.offline_only && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Home className="w-3 h-3 mr-1" />
                                                        Offline
                                                    </Badge>
                                                )}
                                                {!userSkill.online_only && !userSkill.offline_only && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Hybrid
                                                    </Badge>
                                                )}
                                            </div>

                                            <Badge
                                                variant={userSkill.is_available ? "default" : "secondary"}
                                                className="text-xs"
                                            >
                                                {userSkill.is_available ? "Tersedia" : "Tidak Tersedia"}
                                            </Badge>
                                        </div>

                                        {/* Proof Link */}
                                        {userSkill.proof_url && (
                                            <div className="mt-3">
                                                <a
                                                    href={userSkill.proof_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Lihat Portofolio
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}