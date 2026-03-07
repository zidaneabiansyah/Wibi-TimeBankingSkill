'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProtectedRoute } from '@/components/auth';
import { skillService } from '@/lib/services';
import { useSessionStore } from '@/stores/session.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import type { UserSkill, SessionMode } from '@/types';

const bookingSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    description: z.string().max(1000).optional(),
    duration: z.number().min(0.5, 'Minimum 30 minutes').max(4, 'Maximum 4 hours'),
    mode: z.enum(['online', 'offline', 'hybrid']),
    scheduled_at: z.string().min(1, 'Please select a date and time'),
    location: z.string().optional(),
    meeting_link: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const STEPS = [
    { num: 1, title: 'Session Details', desc: 'Title and main topic' },
    { num: 2, title: 'Schedule & Setup', desc: 'When and how' },
    { num: 3, title: 'Review & Book', desc: 'Location and confirmation' }
];

function BookSessionContent() {
    const params = useParams();
    const router = useRouter();
    const userSkillId = Number(params.userSkillId);
    const { user } = useAuthStore();
    const { bookSession, isLoading: isBooking } = useSessionStore();

    const [userSkill, setUserSkill] = useState<UserSkill | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stepper State
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            duration: 1,
            mode: 'online',
        },
    });

    const selectedMode = watch('mode');
    const selectedDuration = watch('duration');
    const scheduledAt = watch('scheduled_at');

    useEffect(() => {
        const fetchUserSkill = async () => {
            try {
                setIsLoading(true);
                const data = await skillService.getUserSkillById(userSkillId);
                setUserSkill(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to load teacher information');
                toast.error('Failed to load teacher information');
            } finally {
                setIsLoading(false);
            }
        };

        if (userSkillId) {
            fetchUserSkill();
        }
    }, [userSkillId]);

    const handleNext = async () => {
        let isValid = false;
        
        if (currentStep === 1) {
            isValid = await trigger(['title', 'description']);
        } else if (currentStep === 2) {
            isValid = await trigger(['duration', 'mode', 'scheduled_at']);
        }

        if (isValid) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        } else {
            toast.error('Please fill in all required highlighted fields.');
        }
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentStep((prev) => prev - 1);
    };

    const onSubmit = async (data: BookingFormData) => {
        // Double check step 3 validating
        const isStep3Valid = await trigger(['location', 'meeting_link']);
        if (!isStep3Valid) {
            toast.error('Please fix the errors before confirming.');
            return;
        }

        try {
            await bookSession({
                user_skill_id: userSkillId,
                title: data.title,
                description: data.description || '',
                duration: data.duration,
                mode: data.mode as SessionMode,
                scheduled_at: new Date(data.scheduled_at).toISOString(),
                location: data.location,
                meeting_link: data.meeting_link,
            });

            toast.success('Session booked successfully! Waiting for teacher approval.');
            router.push('/dashboard');
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to book session';
            toast.error(errorMessage);
        }
    };

    const creditCost = (userSkill?.hourly_rate || 1) * (selectedDuration || 1);
    const insufficientBalance = Boolean(user && user.credit_balance < creditCost);

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

    if (isLoading) {
        return (
             <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !userSkill) {
        return (
             <div className="flex flex-col h-screen items-center justify-center bg-background space-y-4">
                <p className="text-red-500">{error || 'Failed to load teacher data.'}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <main
            className="font-['Plus_Jakarta_Sans']"
            style={{
                height: '100vh',
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
                    padding: '2rem 1rem 0',
                    width: '100%',
                    flexShrink: 0,
                }}
            >
                <Link href="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Marketplace
                </Link>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: '2rem',
                    flex: 1,
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1rem 2rem',
                    width: '100%',
                    overflow: 'hidden',
                    minHeight: 0,
                }}
            >
                {/* Left Stepper Sidebar */}
                <aside
                    className="hidden md:flex bg-card rounded-3xl p-8 border border-border flex-col"
                    style={{
                        width: '320px',
                        flexShrink: 0,
                        overflowY: 'auto',
                    }}
                >
                    <h1 className="text-2xl font-bold tracking-tight mb-8">
                        Book a Session
                    </h1>
                    
                    <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-sm font-medium text-foreground mb-1">Mentor</p>
                        <p className="text-base font-semibold text-primary">{userSkill?.user?.full_name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Rate: {userSkill?.hourly_rate} credits/hr</p>
                    </div>

                    <div className="relative flex-1">
                        <div className="absolute left-[19px] top-6 bottom-8 w-px bg-border z-0"></div>

                        <ul className="relative z-10 space-y-8 mt-2">
                            {STEPS.map((step) => {
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
                    className="bg-card rounded-3xl border border-border flex flex-col relative"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                    }}
                >
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ position: 'relative' }}>
                        <form id="booking-form" onSubmit={handleSubmit(onSubmit)}>
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
                                                <h3 className="text-base font-semibold text-foreground">Title</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Give your session a clear and concise name.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title" className={`font-medium ${errors.title ? 'text-destructive' : 'text-foreground'}`}>
                                                        Session Title <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="title"
                                                        placeholder="e.g., Help with Calculus Integration"
                                                        {...register('title')}
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.title ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.title && <p className="text-xs text-destructive font-medium">{errors.title.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Description</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Explain what you want to learn or get help with in detail.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="description" className={`font-medium ${errors.description ? 'text-destructive' : 'text-foreground'}`}>
                                                        What do you want to learn?
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        placeholder="I am struggling with..."
                                                        rows={5}
                                                        {...register('description')}
                                                        className={`rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background resize-none transition-colors ${errors.description ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.description && <p className="text-xs text-destructive font-medium">{errors.description.message}</p>}
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
                                                <h3 className="text-base font-semibold text-foreground">Logistics</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Specify how long and how you want to meet.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="duration" className={`font-medium ${errors.duration ? 'text-destructive' : 'text-foreground'}`}>
                                                        Duration (hours) <span className="text-destructive">*</span>
                                                    </Label>
                                                    <select
                                                        id="duration"
                                                        className={`w-full h-12 rounded-xl border px-3 py-2 bg-muted/20 hover:bg-muted/30 focus:bg-background outline-none transition-colors ${errors.duration ? 'border-destructive focus:ring-destructive text-destructive' : 'border-input focus:ring-2 focus:ring-primary'}`}
                                                        {...register('duration', { valueAsNumber: true })}
                                                    >
                                                        <option value={0.5}>30 minutes</option>
                                                        <option value={1}>1 hour</option>
                                                        <option value={1.5}>1.5 hours</option>
                                                        <option value={2}>2 hours</option>
                                                        <option value={2.5}>2.5 hours</option>
                                                        <option value={3}>3 hours</option>
                                                        <option value={4}>4 hours</option>
                                                    </select>
                                                    {errors.duration && <p className="text-xs text-destructive font-medium">{errors.duration.message}</p>}
                                                </div>

                                                <div className="space-y-3 mt-4">
                                                    <Label className={`font-medium ${errors.mode ? 'text-destructive' : 'text-foreground'}`}>
                                                        Session Mode <span className="text-destructive">*</span>
                                                    </Label>
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        {['online', 'offline', 'hybrid'].map((mode) => (
                                                            <label key={mode} className="flex flex-1 items-center justify-center gap-2 cursor-pointer border rounded-xl p-3 bg-muted/20 hover:bg-muted/30 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                                                <input
                                                                    type="radio"
                                                                    value={mode}
                                                                    {...register('mode')}
                                                                    className="w-4 h-4 accent-primary"
                                                                />
                                                                <span className="capitalize font-medium text-sm">{mode}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {errors.mode && <p className="text-xs text-destructive font-medium">{errors.mode.message}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Schedule</h3>
                                                <p className="text-sm text-muted-foreground mt-1">When would you like to have this session?</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="scheduled_at" className={`font-medium ${errors.scheduled_at ? 'text-destructive' : 'text-foreground'}`}>
                                                        Preferred Date & Time <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="scheduled_at"
                                                        type="datetime-local"
                                                        min={new Date().toISOString().slice(0, 16)}
                                                        {...register('scheduled_at')}
                                                        className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.scheduled_at ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                    />
                                                    {errors.scheduled_at && <p className="text-xs text-destructive font-medium">{errors.scheduled_at.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3 CONTENT */}
                                {currentStep === 3 && (
                                    <div className="space-y-0">
                                         {/* Conditional Location/Link Fields depending on selected Mode */}
                                         {selectedMode !== 'online' && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                                <div className="md:col-span-1">
                                                    <h3 className="text-base font-semibold text-foreground">Location</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">Where will this session take place?</p>
                                                </div>
                                                <div className="md:col-span-2 space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="location" className={`font-medium ${errors.location ? 'text-destructive' : 'text-foreground'}`}>
                                                            Physical Location
                                                        </Label>
                                                        <Input
                                                            id="location"
                                                            placeholder="e.g., School library, Coffee shop address"
                                                            {...register('location')}
                                                            className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.location ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                         )}

                                         {selectedMode !== 'offline' && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                                <div className="md:col-span-1">
                                                    <h3 className="text-base font-semibold text-foreground">Meeting Link</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">Link for online meeting (optional).</p>
                                                </div>
                                                <div className="md:col-span-2 space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="meeting_link" className={`font-medium ${errors.meeting_link ? 'text-destructive' : 'text-foreground'}`}>
                                                            URL / Platform
                                                        </Label>
                                                        <Input
                                                            id="meeting_link"
                                                            placeholder="e.g., Zoom or Google Meet link"
                                                            {...register('meeting_link')}
                                                            className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.meeting_link ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                                        />
                                                        <p className="text-xs text-muted-foreground">Leave empty if you want the teacher to provide the link.</p>
                                                    </div>
                                                </div>
                                            </div>
                                         )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                            <div className="md:col-span-1">
                                                <h3 className="text-base font-semibold text-foreground">Payment Summary</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Review the total session cost in credits.</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-foreground">Session Cost</p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {userSkill?.hourly_rate || 1} credit/hour × {selectedDuration} hours
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-3xl font-bold text-primary">{creditCost.toFixed(1)}</p>
                                                            <p className="text-sm font-medium text-muted-foreground">credits</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground font-medium">Your current balance:</span>
                                                        <span className={`font-semibold ${insufficientBalance ? 'text-destructive' : 'text-foreground'}`}>
                                                            {user?.credit_balance?.toFixed(1) || 0} credits
                                                        </span>
                                                    </div>
                                                    
                                                    {insufficientBalance && (
                                                        <div className="mt-3 text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-lg">
                                                            You do not have enough credits to book this session.
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-xs text-muted-foreground space-y-2 mt-6 p-4 bg-muted/20 rounded-xl">
                                                    <p>• Credits will be held in escrow immediately upon booking.</p>
                                                    <p>• If the teacher rejects the request, credits will be refunded instantly.</p>
                                                    <p>• Both parties must confirm completion for credits to transfer.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        </form>
                    </div>

                    {/* Action Bar at Bottom */}
                    <div className="p-6 border-t border-border bg-card/80 backdrop-blur-sm sticky bottom-0 z-20 flex justify-between items-center rounded-b-3xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrev}
                            className={`h-11 px-6 rounded-xl font-medium ${currentStep === 1 ? 'invisible' : 'visible'}`}
                        >
                            Previous
                        </Button>
                        
                        {currentStep < 3 ? (
                            <Button 
                                type="button" 
                                onClick={handleNext} 
                                className="h-11 px-8 rounded-xl font-semibold w-full sm:w-auto hover:scale-105 transition-transform"
                            >
                                Next Step <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                form="booking-form"
                                disabled={isBooking || insufficientBalance || !scheduledAt} // Must select time natively
                                className={`h-11 px-8 rounded-xl font-semibold w-full sm:w-auto ${isBooking ? 'bg-muted text-muted-foreground' : 'hover:scale-105 transition-transform'}`}
                            >
                                {isBooking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
                                    </>
                                ) : (
                                    `Confirm Booking`
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function BookSessionPage() {
    return (
        <ProtectedRoute>
            <BookSessionContent />
        </ProtectedRoute>
    );
}
