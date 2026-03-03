'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProtectedRoute } from '@/components/auth';
import { useSkillStore } from '@/stores/skill.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { ArrowLeft, Check, ChevronRight, Loader2 } from 'lucide-react';
import type { SkillLevel } from '@/types';
import Link from 'next/link';

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

// Define Steps Configuration
const TEACHING_STEPS = [
    { num: 1, title: 'Basic Information', desc: 'Select skill and proficiency' },
    { num: 2, title: 'Experience Details', desc: 'Set your rates and background' },
    { num: 3, title: 'Portfolio & Proof', desc: 'Build trust with your work' }
];

const LEARNING_STEPS = [
    { num: 1, title: 'Goal Selection', desc: 'What do you want to learn?' },
    { num: 2, title: 'Requirements', desc: 'Any specific needs?' },
    { num: 3, title: 'Priority', desc: 'How urgent is this goal?' }
];

function AddSkillContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const isLearning = type === 'learning';
    
    const STEPS = isLearning ? LEARNING_STEPS : TEACHING_STEPS;

    const { user } = useAuthStore();
    const { skills, fetchSkills, addUserSkill, addLearningSkill, isLoading } = useSkillStore();
    const [skillsLoading, setSkillsLoading] = useState(true);

    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

    const [formData, setFormData] = useState({
        skill_id: '',
        level: '' as SkillLevel,
        description: '',
        hourly_rate: '',
        years_of_experience: '',
        proof_url: '',
        proof_type: 'portfolio',
        is_available: true,
        priority: '1',
        notes: '',
    });

    // Validation Errors State
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!user?.id) {
            router.push('/login');
            return;
        }

        fetchSkills({ limit: 100, offset: 0 })
            .catch(console.error)
            .finally(() => setSkillsLoading(false));
    }, [user?.id, router, fetchSkills]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
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

    const validateStep = (step: number) => {
        let newErrors: { [key: string]: boolean } = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.skill_id) newErrors.skill_id = true;
            if (!formData.level) newErrors.level = true;
            
            if (Object.keys(newErrors).length > 0) isValid = false;
        } 
        else if (step === 2 && !isLearning) {
            // Validate teaching step 2
            if (!formData.description) newErrors.description = true;
            if (!formData.years_of_experience) newErrors.years_of_experience = true;
            if (!formData.hourly_rate) newErrors.hourly_rate = true;
            
            if (Object.keys(newErrors).length > 0) isValid = false;
        }
        else if (step === 3 && !isLearning) {
            // Validate teaching step 3
            if (!formData.proof_url) newErrors.proof_url = true;
            
            if (Object.keys(newErrors).length > 0) isValid = false;
        }
        else if (step === 2 && isLearning) {
            // Notes are technically optional but let's encourage them
            // No strict required fields here unless business logic demands it.
        }
        else if (step === 3 && isLearning) {
            if (!formData.priority) newErrors.priority = true;
            if (Object.keys(newErrors).length > 0) isValid = false;
        }

        setErrors(newErrors);
        
        if (!isValid) {
            toast.error('Please fill in all required highlighted fields.');
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
        // Validate last step before submitting
        if (!validateStep(3)) return;

        try {
            if (isLearning) {
                await addLearningSkill({
                    skill_id: parseInt(formData.skill_id),
                    desired_level: formData.level,
                    priority: parseInt(formData.priority) || 1,
                    notes: formData.notes || '',
                });
                toast.success('Learning goal added successfully');
            } else {
                await addUserSkill({
                    skill_id: parseInt(formData.skill_id),
                    level: formData.level,
                    description: formData.description,
                    hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : 0,
                    years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : 0,
                    proof_url: formData.proof_url,
                    proof_type: formData.proof_type,
                    online_only: false,
                    offline_only: false,
                    is_available: formData.is_available,
                });
                toast.success('Skill added successfully');
            }

            router.push('/profile');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add skill');
            console.error(error);
        }
    };

    // Animation variants
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
                {/* Back Button */}
                <Link href="/profile" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Link>
            </div>

            {/* Two-column layout */}
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
                    <h1 className="text-2xl font-bold tracking-tight mb-8">
                        {isLearning ? 'Add Learning Goal' : 'Add New Skill'}
                    </h1>

                    <div className="relative flex-1">
                        {/* Stepper Guide */}
                        <div className="absolute left-[19px] top-6 bottom-8 w-px bg-border z-0"></div>

                        <ul className="relative z-10 space-y-8 mt-2">
                            {STEPS.map((step, idx) => {
                                const isCompleted = currentStep > step.num;
                                const isActive = currentStep === step.num;
                                const isPending = currentStep < step.num;

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
                        overflow: 'hidden', // Contain animation
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
                                        {STEPS[currentStep - 1].title}
                                    </h2>
                                    <p className="text-muted-foreground font-medium text-sm">
                                        {STEPS[currentStep - 1].desc}
                                    </p>
                                </div>

                                {/* STEP 1 CONTENT */}
                                {currentStep === 1 && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Core Skill</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Select the specific category you want to focus on.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="skill_id" className={`font-medium ${errors.skill_id ? 'text-destructive' : 'text-foreground'}`}>
                                                        Select Skill <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select value={formData.skill_id} onValueChange={(value) => handleSelectChange('skill_id', value)}>
                                                        <SelectTrigger 
                                                            id="skill_id" 
                                                            disabled={skillsLoading}
                                                            className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.skill_id ? 'border-destructive ring-destructive/20 focus:ring-destructive' : 'focus:ring-primary'}`}
                                                        >
                                                            <SelectValue placeholder={skillsLoading ? 'Loading skills...' : 'Search and select a skill'} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {skills.map(skill => (
                                                                <SelectItem key={skill.id} value={skill.id.toString()}>
                                                                    {skill.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.skill_id && <p className="text-xs text-destructive font-medium">Please select a skill</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Proficiency</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {isLearning ? 'What level are you aiming for?' : 'How experienced are you?'}
                                                </p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="level" className={`font-medium ${errors.level ? 'text-destructive' : 'text-foreground'}`}>
                                                        {isLearning ? 'Desired Level' : 'Proficiency Level'} <span className="text-destructive">*</span>
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
                                {currentStep === 2 && !isLearning && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Description</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Provide context about your journey and expertise.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="description" className={`font-medium ${errors.description ? 'text-destructive' : 'text-foreground'}`}>
                                                        Experience Description <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        name="description"
                                                        placeholder="Describe your expertise, what you can teach, and how you approach teaching."
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        className={`rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors resize-none ${errors.description ? 'border-destructive ring-destructive/20 focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.description && <p className="text-xs text-destructive font-medium">Description is required</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Rates & Experience</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Set your pricing per hour and relevant history.</p>
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
                                                        placeholder="e.g. 5"
                                                        value={formData.years_of_experience}
                                                        onChange={handleChange}
                                                        min="0"
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.years_of_experience ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.years_of_experience && <p className="text-xs text-destructive font-medium">Required field</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="hourly_rate" className={`font-medium ${errors.hourly_rate ? 'text-destructive' : 'text-foreground'}`}>
                                                        Hourly Rate (Credits) <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="hourly_rate"
                                                        name="hourly_rate"
                                                        type="number"
                                                        placeholder="e.g. 10"
                                                        value={formData.hourly_rate}
                                                        onChange={handleChange}
                                                        min="0"
                                                        step="0.5"
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.hourly_rate ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.hourly_rate && <p className="text-xs text-destructive font-medium">Required field</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && isLearning && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Requirements</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Specific details you want your mentor to know.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="notes" className="font-medium text-foreground">
                                                        Notes / Specific Requirements <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span>
                                                    </Label>
                                                    <Textarea
                                                        id="notes"
                                                        name="notes"
                                                        placeholder="e.g. I want to learn Next.js app router specifically, not pages router."
                                                        value={formData.notes}
                                                        onChange={handleChange}
                                                        rows={5}
                                                        className="rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors resize-none focus-visible:ring-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3 CONTENT */}
                                {currentStep === 3 && !isLearning && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Portfolio Proof</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Showcase past work to earn mentor trust.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="proof_url" className={`font-medium ${errors.proof_url ? 'text-destructive' : 'text-foreground'}`}>
                                                        Project or Certificate URL <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="proof_url"
                                                        name="proof_url"
                                                        placeholder="https://behance.net/your-work"
                                                        value={formData.proof_url}
                                                        onChange={handleChange}
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.proof_url ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.proof_url && <p className="text-xs text-destructive font-medium">URL is required</p>}
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
                                    </div>
                                )}

                                {currentStep === 3 && isLearning && (
                                    <div className="space-y-0">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Priority</h3>
                                                <p className="text-sm text-muted-foreground mt-1">How urgent is this goal?</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="priority" className={`font-medium ${errors.priority ? 'text-destructive' : 'text-foreground'}`}>
                                                        Priority Level (1-5) <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="priority"
                                                        name="priority"
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        value={formData.priority}
                                                        onChange={handleChange}
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.priority ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.priority && <p className="text-xs text-destructive font-medium">Priority level is required</p>}
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        High priority (5) goals are shown first on your profile and get more visibility.
                                                    </p>
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
                                    {isLearning ? 'Save Learning Goal' : 'Save Skill'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function AddSkillPage() {
    return (
        <ProtectedRoute>
            <AddSkillContent />
        </ProtectedRoute>
    );
}
