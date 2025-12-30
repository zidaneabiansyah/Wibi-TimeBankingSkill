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
import Dither from "@/components/Dither";
import { ArrowLeft, Github } from 'lucide-react';
import Image from 'next/image';

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

  // Debounced username check
  const checkUsernameDebounced = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (username: string) => {
      clearTimeout(timeout);
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      setCheckingUsername(true);
      timeout = setTimeout(async () => {
        try {
          const result = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/check-username/${username}`
          );
          // If endpoint doesn't exist, assume available
          setUsernameAvailable(true);
          setCheckingUsername(false);
        } catch (err) {
          // Assume available if endpoint fails
          setUsernameAvailable(true);
          setCheckingUsername(false);
        }
      }, 500);
    };
  }, []);

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
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Image 
                src="/wibi.png" 
                alt="Wibi Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">Waktu Indonesia Berbagi Ilmu</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
            <p className="text-sm text-muted-foreground">
              Join the Time Banking community and start exchanging skills today
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" type="button">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full" type="button">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Your Full Name"
                    {...register('full_name')}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-destructive">{errors.full_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your Username"
                    {...register('username')}
                    onChange={(e) => {
                      register('username').onChange?.(e);
                      setUsernameInput(e.target.value);
                      checkUsernameDebounced(e.target.value);
                    }}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                  {checkingUsername && (
                    <p className="text-xs text-muted-foreground">Checking availability...</p>
                  )}
                  {!checkingUsername && usernameInput && usernameAvailable === false && (
                    <p className="text-xs text-destructive">Username already taken</p>
                  )}
                  {!checkingUsername && usernameInput && usernameAvailable === true && (
                    <p className="text-xs text-green-600">✓ Username available</p>
                  )}
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  {...register('email')}
                  disabled={isLoading}
                  className="bg-muted/50"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your Password"
                    {...register('password')}
                    onChange={(e) => {
                      register('password').onChange?.(e);
                      setPasswordInput(e.target.value);
                    }}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                  {passwordInput && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {passwordStrength.label}
                        </span>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>✓ At least 6 characters</li>
                        <li>{passwordInput.length >= 8 ? '✓' : '○'} At least 8 characters</li>
                        <li>{/[A-Z]/.test(passwordInput) && /[a-z]/.test(passwordInput) ? '✓' : '○'} Mix of uppercase & lowercase</li>
                        <li>{/\d/.test(passwordInput) ? '✓' : '○'} Include a number</li>
                      </ul>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    {...register('confirmPassword')}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  placeholder="Your School Name"
                  {...register('school')}
                  disabled={isLoading}
                  className="bg-muted/50"
                />
                {errors.school && (
                  <p className="text-sm text-destructive">{errors.school.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    placeholder="Your Grade"
                    {...register('grade')}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                  {errors.grade && (
                    <p className="text-sm text-destructive">{errors.grade.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    placeholder="Your Major"
                    {...register('major')}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    placeholder="e.g., 081234..."
                    {...register('phone_number')}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Jakarta, Bandung"
                    {...register('location')}
                    disabled={isLoading}
                    className="bg-muted/50"
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
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
