'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ProtectedRoute } from '@/components/auth';
import { useSkillStore } from '@/stores/skill.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { ArrowLeft, Check, ChevronRight, Loader2 } from 'lucide-react';
import type { SkillLevel, UserSkill } from '@/types';
import Link from 'next/link';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

const EDIT_STEPS = [
    { num: 1, title: 'Basic Information', desc: 'Select your proficiency level' },
    { num: 2, title: 'Experience Details', desc: 'Set your description and rates' },
    { num: 3, title: 'Portfolio & Status', desc: 'Update proof and availability' }
];

function EditSkillContent() {
    const router = useRouter();
    const params = useParams();
    const skillId = Number(params.id);
    const { user } = useAuthStore();
    const { fetchUserSkills, updateUserSkill, isLoading } = useSkillStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1);

    const [formData, setFormData] = useState({
        level: '' as SkillLevel,
        description: '',
        hourly_rate: '',
        years_of_experience: '',
        proof_url: '',
        proof_type: 'portfolio',
        is_available: true,
    });
    
    const [skillName, setSkillName] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const loadSkill = async () => {
            if (!user?.id) return;
            
            try {
                setIsFetching(true);
                await fetchUserSkills();
                
                const freshSkills = useSkillStore.getState().userSkills;
                const skillToEdit = freshSkills.find((s: UserSkill) => s.skill_id === skillId);
                
                if (skillToEdit) {
                    setSkillName(skillToEdit.skill?.name || 'Skill');
                    setFormData({
                        level: skillToEdit.level,
                        description: skillToEdit.description || '',
                        hourly_rate: skillToEdit.hourly_rate.toString(),
                        years_of_experience: skillToEdit.years_of_experience.toString(),
                        proof_url: skillToEdit.proof_url || '',
                        proof_type: skillToEdit.proof_type || 'portfolio',
                        is_available: skillToEdit.is_available,
                    });
                } else {
                    toast.error('Skill not found');
                    router.push('/profile/skills');
                }
            } catch (error) {
                console.error('Failed to load skill:', error);
                toast.error('Failed to load skill details');
            } finally {
                setIsFetching(false);
            }
        };

        loadSkill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, skillId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, is_available: checked }));
    };

    const validateStep = (step: number) => {
        const newErrors: { [key: string]: boolean } = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.level) newErrors.level = true;
            if (Object.keys(newErrors).length > 0) isValid = false;
        } 
        else if (step === 2) {
            if (!formData.description) newErrors.description = true;
            if (!formData.years_of_experience && formData.years_of_experience !== '0') newErrors.years_of_experience = true;
            if (!formData.hourly_rate && formData.hourly_rate !== '0') newErrors.hourly_rate = true;
            if (Object.keys(newErrors).length > 0) isValid = false;
        }

        // Step 3 (Portfolio & availability) -> optional, or we enforce proof url if they type something.
        // Usually proof_url is required based on schema, so let's check it.
        else if (step === 3) {
            if (!formData.proof_url) newErrors.proof_url = true;
            if (Object.keys(newErrors).length > 0) isValid = false;
        }

        setErrors(newErrors);
        
        if (!isValid) {
            toast.error('Tolong lengkapi field yang diperlukan.');
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setDirection(1);
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        try {
            await updateUserSkill(skillId, {
                level: formData.level,
                description: formData.description,
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : 0,
                years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : 0,
                proof_url: formData.proof_url,
                proof_type: formData.proof_type,
                is_available: formData.is_available,
            });

            toast.success('Skill updated successfully');
            router.push('/profile/skills');
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(error.message || 'Failed to update skill');
            console.error(error);
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 80px)' }}>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading skill details...</p>
                </div>
            </div>
        );
    }

    return (
        <main
            className="font-['Plus_Jakarta_Sans']"
            style={{
                height: 'calc(100vh - 80px)',
                background: 'var(--background)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '1.5rem 1rem 0',
                    width: '100%',
                    flexShrink: 0,
                }}
            >
                <Link href="/profile/skills" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Skills
                </Link>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '2rem',
                    flex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1rem 1.5rem',
                    width: '100%',
                    overflow: 'hidden',
                    minHeight: 0,
                }}
            >
                {/* Left Stepper Sidebar */}
                <aside
                    className="hidden md:flex bg-card rounded-3xl p-8 border border-border shadow-sm flex-col"
                    style={{
                        width: '320px',
                        flexShrink: 0,
                        overflowY: 'auto',
                    }}
                >
                    <h1 className="text-2xl font-bold tracking-tight mb-2">
                        Edit Skill
                    </h1>
                    <p className="text-sm font-medium text-primary mb-8">{skillName}</p>

                    <div className="relative flex-1">
                        <div className="absolute left-[19px] top-6 bottom-8 w-px bg-border z-0"></div>

                        <ul className="relative z-10 space-y-8 mt-2">
                            {EDIT_STEPS.map((step) => {
                                const isCompleted = currentStep > step.num;
                                const isActive = currentStep === step.num;

                                return (
                                    <li key={step.num} className="flex gap-4">
                                        <div 
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300
                                                ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                                                  isActive ? 'bg-primary border-primary text-primary-foreground' : 
                                                  'bg-background border-border text-muted-foreground'}`
                                            }
                                        >
                                            {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-semibold">{step.num}</span>}
                                        </div>
                                        <div className="pt-2">
                                            <h3 className={`font-semibold  ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground opacity-80 mt-1">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </aside>

                {/* Right Form Content */}
                <div
                    className="bg-card rounded-3xl border border-border shadow-sm flex flex-col relative"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                    }}
                >
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ position: 'relative' }}>
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                                className="space-y-6 max-w-2xl"
                            >
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-foreground mb-2">
                                        {EDIT_STEPS[currentStep - 1].title}
                                    </h2>
                                    <p className="text-muted-foreground font-medium text-sm">
                                        {EDIT_STEPS[currentStep - 1].desc}
                                    </p>
                                </div>

                                {/* STEP 1 CONTENT */}
                                {currentStep === 1 && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Proficiency</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Update your experience level for this skill.
                                                </p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="level" className={`font-medium ${errors.level ? 'text-destructive' : 'text-foreground'}`}>
                                                        Proficiency Level <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select value={formData.level} onValueChange={(value) => handleSelectChange('level', value)}>
                                                        <SelectTrigger 
                                                            id="level"
                                                            className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.level ? 'border-destructive ring-destructive/20 focus:ring-destructive' : 'focus:ring-primary'}`}
                                                        >
                                                            <SelectValue placeholder="Select proficiency level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SKILL_LEVELS.map(level => (
                                                                <SelectItem key={level} value={level}>
                                                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.level && <p className="text-xs text-destructive font-medium">Proficiency level is required</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2 CONTENT */}
                                {currentStep === 2 && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Description</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Provide an overview of what you teach.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="description" className={`font-medium ${errors.description ? 'text-destructive' : 'text-foreground'}`}>
                                                        Description <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        name="description"
                                                        placeholder="Describe your expertise..."
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        className={`rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors resize-none ${errors.description ? 'border-destructive ring-destructive/20 focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Experience & Rates</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Detail your background and credit rate.</p>
                                            </div>
                                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="years_of_experience" className={`font-medium ${errors.years_of_experience ? 'text-destructive' : 'text-foreground'}`}>
                                                        Years of Experience <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="years_of_experience"
                                                        name="years_of_experience"
                                                        type="number"
                                                        value={formData.years_of_experience}
                                                        onChange={handleChange}
                                                        min="0"
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.years_of_experience ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="hourly_rate" className={`font-medium ${errors.hourly_rate ? 'text-destructive' : 'text-foreground'}`}>
                                                        Hourly Rate (Credits) <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="hourly_rate"
                                                        name="hourly_rate"
                                                        type="number"
                                                        value={formData.hourly_rate}
                                                        onChange={handleChange}
                                                        min="0"
                                                        step="0.5"
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.hourly_rate ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    <p className="text-[10px] text-muted-foreground">Standard rate is typically 1.0 - 2.0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3 CONTENT */}
                                {currentStep === 3 && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Portfolio</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Showcase your work to build trust.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="proof_url" className={`font-medium ${errors.proof_url ? 'text-destructive' : 'text-foreground'}`}>
                                                        Project or Certificate URL <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="proof_url"
                                                        name="proof_url"
                                                        placeholder="https://..."
                                                        value={formData.proof_url}
                                                        onChange={handleChange}
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.proof_url ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="proof_type" className="font-medium text-foreground">
                                                        Type of Proof
                                                    </Label>
                                                    <Select value={formData.proof_type} onValueChange={(value) => handleSelectChange('proof_type', value)}>
                                                        <SelectTrigger id="proof_type" className="h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors focus:ring-primary">
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="portfolio">Portfolio / Karya</SelectItem>
                                                            <SelectItem value="certificate">Certification</SelectItem>
                                                            <SelectItem value="experience">Detailed Work History</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Availability</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Accepting new requests?</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex flex-row items-center justify-between rounded-xl border border-border p-4 bg-muted/10">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base text-foreground font-semibold">Currently Available</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Turn this off if you&apos;re not accepting new students
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={formData.is_available}
                                                        onCheckedChange={handleSwitchChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="bg-background/80 backdrop-blur-md border-t border-border p-6 flex items-center justify-between shrink-0">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                            className={`font-semibold rounded-xl h-11 px-6 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            Previous
                        </Button>
                        
                        <div className="flex gap-4">
                            {currentStep < 3 ? (
                                <Button 
                                    type="button" 
                                    onClick={handleNext}
                                    className="font-semibold rounded-xl h-11 px-8"
                                >
                                    Next Step
                                    <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            ) : (
                                <Button 
                                    type="button" 
                                    onClick={handleSubmit} 
                                    disabled={isLoading}
                                    className="font-semibold rounded-xl h-11 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Update Skill
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function EditSkillPage() {
    return (
        <ProtectedRoute>
            <EditSkillContent />
        </ProtectedRoute>
    );
}
