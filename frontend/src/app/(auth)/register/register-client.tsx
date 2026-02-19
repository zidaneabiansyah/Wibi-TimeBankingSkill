'use client';

import { useState, useMemo } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import Dither from "@/components/effects/Dither";
import { ArrowLeft, Github, Mail, Lock, User, BookOpen, MapPin, Smartphone, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';

// Password strength calculator
const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  
  const normalizedScore = Math.min(Math.ceil((score / 6) * 4), 4);
  
  const strengths: { [key: number]: { label: string; color: string } } = {
    1: { label: 'Weak', color: 'bg-red-500' },
    2: { label: 'Fair', color: 'bg-yellow-500' },
    3: { label: 'Good', color: 'bg-blue-500' },
    4: { label: 'Strong', color: 'bg-green-500' },
  };
  
  const strength = strengths[normalizedScore] || strengths[1];
  return { score: normalizedScore, ...strength };
};

const registerSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  school: z.string().min(1, 'School is required'),
  grade: z.string().min(1, 'Grade is required'),
  major: z.string().optional(),
  phone_number: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(passwordInput);
  }, [passwordInput]);

  const debouncedUsername = useDebounce(usernameInput, 500);

  // Username check effect
  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const checkUsername = async () => {
      setCheckingUsername(true);
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/check-username/${debouncedUsername}`
        );
        // If endpoint doesn't exist, assume available (username is available)
        setUsernameAvailable(true);
      } catch (err) {
        setUsernameAvailable(true);
      } finally {
        setCheckingUsername(false);
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      toast.success('Registration successful! Check your email to verify your account.');
      // Redirect to email verification pending page
      router.push('/register-success');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-4 sm:p-8 overflow-y-auto">
        <m.div 
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <Image 
                src="/wibi.png" 
                alt="Wibi Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-sm font-semibold text-muted-foreground">Waktu Indonesia Berbagi Ilmu</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-sm text-muted-foreground">
              Join the Time Banking community and start exchanging skills today
            </p>
          </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <m.div 
                  className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="shrink-0 pt-0.5">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    </svg>
                  </div>
                  <span>{error}</span>
                </m.div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="full_name"
                      placeholder="John Doe"
                      {...register('full_name')}
                      disabled={isLoading}
                      className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span> {errors.full_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="username"
                      placeholder="johndoe"
                      {...register('username')}
                      onChange={(e) => {
                        register('username').onChange?.(e);
                        setUsernameInput(e.target.value);
                      }}
                      disabled={isLoading}
                      className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                    />
                  </div>
                  {checkingUsername && (
                    <p className="text-xs text-muted-foreground">Checking availability...</p>
                  )}
                  {!checkingUsername && usernameInput && usernameAvailable === false && (
                    <p className="text-xs text-destructive">Username already taken</p>
                  )}
                  {!checkingUsername && usernameInput && usernameAvailable === true && (
                    <p className="text-xs text-green-600 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Username available</p>
                  )}
                  {errors.username && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span> {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    disabled={isLoading}
                    className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <span>⚠</span> {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register('password')}
                      onChange={(e) => {
                        register('password').onChange?.(e);
                        setPasswordInput(e.target.value);
                      }}
                      disabled={isLoading}
                      className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                    />
                  </div>
                  {passwordInput && (
                    <div className="space-y-3 pt-1">
                      {/* Bar & Label Strength */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted/60 rounded-full overflow-hidden">
                          <m.div
                            className={`h-full transition-all ${passwordStrength.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground min-w-12 text-right">
                          {passwordStrength.label}
                        </span>
                      </div>

                      {/* List Persyaratan: Dibuat Grid 2 Kolom (Menyamping) */}
                      <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
                        <li className={`flex items-center gap-1.5 ${passwordInput.length >= 6 ? 'text-green-600 font-medium' : ''}`}>
                          {passwordInput.length >= 6 ? '✓' : '○'} Min 6 chars
                        </li>
                        <li className={`flex items-center gap-1.5 ${passwordInput.length >= 8 ? 'text-green-600 font-medium' : ''}`}>
                          {passwordInput.length >= 8 ? '✓' : '○'} Min 8 chars
                        </li>
                        <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(passwordInput) && /[a-z]/.test(passwordInput) ? 'text-green-600 font-medium' : ''}`}>
                          {/[A-Z]/.test(passwordInput) && /[a-z]/.test(passwordInput) ? '✓' : '○'} Upper & Lower
                        </li>
                        <li className={`flex items-center gap-1.5 ${/\d/.test(passwordInput) ? 'text-green-600 font-medium' : ''}`}>
                          {/\d/.test(passwordInput) ? '✓' : '○'} Number
                        </li>
                      </ul>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span> {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      disabled={isLoading}
                      className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span> {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school" className="text-sm font-medium">School</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="school"
                    placeholder="Your School Name"
                    {...register('school')}
                    disabled={isLoading}
                    className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                  />
                </div>
                {errors.school && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <span>⚠</span> {errors.school.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm font-medium">Grade</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., 10, 11, 12"
                    {...register('grade')}
                    disabled={isLoading}
                    className="bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                  />
                  {errors.grade && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span> {errors.grade.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major" className="text-sm font-medium">Major</Label>
                  <Input
                    id="major"
                    placeholder="e.g., Science, Arts"
                    {...register('major')}
                    disabled={isLoading}
                    className="bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm font-medium">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="phone_number"
                      placeholder="081234..."
                      {...register('phone_number')}
                      disabled={isLoading}
                      className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="location"
                      placeholder="e.g., Jakarta"
                      {...register('location')}
                      disabled={isLoading}
                      className="pl-10 bg-muted/40 border-border/40 focus:border-primary/50 focus:bg-background transition-colors duration-200"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span> {errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              <Button 
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 active:scale-98 mt-6" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground text-xs">
                  Or continue with social account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200" 
                type="button"
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                <span className="text-xs sm:text-sm">Google</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200" 
                type="button"
              >
                <Github className="mr-2 h-4 w-4" />
                <span className="text-xs sm:text-sm">GitHub</span>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t border-border/20 pt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </m.div>
      </div>

      {/* Right Side - Dither Background & Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-black flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Dither 
            waveColor={[1, 0.5, 0.2]} 
            disableAnimation={false} 
            waveSpeed={0.05} 
            enableMouseInteraction={true}
          />
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight">
            Start your journey<br />
            with Wibi.
          </h1>
          <p className="text-white/60 text-lg">
            Join thousands of students exchanging skills and building meaningful connections through time banking.
          </p>
        </div>
      </div>
    </div>
  );
}
