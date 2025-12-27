'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { useSkillStore } from '@/stores/skill.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import type { SkillLevel, UserSkill } from '@/types';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

function EditSkillContent() {
    const router = useRouter();
    const params = useParams();
    const skillId = Number(params.id);
    const { user } = useAuthStore();
    const { userSkills, fetchUserSkills, updateUserSkill, isLoading } = useSkillStore();
    
    const [formData, setFormData] = useState({
        level: '' as SkillLevel,
        description: '',
        hourly_rate: '',
        years_of_experience: '',
        is_available: true,
    });
    const [skillName, setSkillName] = useState('');
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const loadSkill = async () => {
            if (!user?.id) return;
            
            try {
                setIsFetching(true);
                // Ensure skills are loaded in store
                await fetchUserSkills();
                
                // Find this specific skill in user's skills
                const skillToEdit = userSkills.find((s: UserSkill) => s.id === skillId);
                
                if (skillToEdit) {
                    setSkillName(skillToEdit.skill?.name || 'Skill');
                    setFormData({
                        level: skillToEdit.level,
                        description: skillToEdit.description || '',
                        hourly_rate: skillToEdit.hourly_rate.toString(),
                        years_of_experience: skillToEdit.years_of_experience.toString(),
                        is_available: skillToEdit.is_available,
                    });
                } else {
                    toast.error('Skill not found');
                    router.push('/profile');
                }
            } catch (error) {
                console.error('Failed to load skill:', error);
                toast.error('Failed to load skill details');
            } finally {
                setIsFetching(false);
            }
        };

        loadSkill();
    }, [user?.id, skillId, fetchUserSkills, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            is_available: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.level) {
            toast.error('Proficiency level is required');
            return;
        }

        try {
            await updateUserSkill(skillId, {
                level: formData.level,
                description: formData.description,
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : 0,
                years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : 0,
                is_available: formData.is_available,
            });

            toast.success('Skill updated successfully');
            router.push('/profile');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update skill');
            console.error(error);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Skill: {skillName}</CardTitle>
                            <CardDescription>Update your teaching details for this skill</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Proficiency Level */}
                                <div className="space-y-2">
                                    <Label htmlFor="level">Proficiency Level *</Label>
                                    <Select value={formData.level} onValueChange={(value) => handleSelectChange('level', value)}>
                                        <SelectTrigger id="level">
                                            <SelectValue placeholder="Select your level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SKILL_LEVELS.map(level => (
                                                <SelectItem key={level} value={level}>
                                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your experience and what students will learn"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>

                                {/* Years of Experience */}
                                <div className="space-y-2">
                                    <Label htmlFor="years_of_experience">Years of Experience</Label>
                                    <Input
                                        id="years_of_experience"
                                        name="years_of_experience"
                                        type="number"
                                        placeholder="e.g., 5"
                                        value={formData.years_of_experience}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>

                                {/* Hourly Rate */}
                                <div className="space-y-2">
                                    <Label htmlFor="hourly_rate">Hourly Rate (Credits/Hour)</Label>
                                    <Input
                                        id="hourly_rate"
                                        name="hourly_rate"
                                        type="number"
                                        placeholder="e.g., 10"
                                        value={formData.hourly_rate}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.5"
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Standard rate is typically 1.0. Advanced tutors can set 1.5 - 2.0.
                                    </p>
                                </div>

                                {/* Availability Toggle */}
                                <div className="flex items-center justify-between space-x-2 border rounded-lg p-3">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="availability">Currently Available</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Turn this off if you're not accepting new students for this skill
                                        </p>
                                    </div>
                                    <Switch
                                        id="availability"
                                        checked={formData.is_available}
                                        onCheckedChange={handleSwitchChange}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Updating...' : 'Update Skill'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/profile')}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default function EditSkillPage() {
    return (
        <ProtectedRoute>
            <EditSkillContent />
        </ProtectedRoute>
    );
}
