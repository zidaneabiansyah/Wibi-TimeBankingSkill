'use client';

import { useState } from 'react';
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
import { ArrowLeft, Github, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { m } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginClient() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null);
            await login(data);
            toast.success('Login successful!');
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
            toast.error(err.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Dither Background & Branding */}
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
                        Welcome back to<br />
                        Wibi.
                    </h1>
                    <p className="text-white/60 text-lg">
                        Continue your journey of skill exchange and community building through time banking.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
                <m.div
                    className="w-full max-w-md space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
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
                        <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <div className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <m.div
                                    className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {error}
                                </m.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register('email')}
                                        disabled={isLoading}
                                        className="pl-10 bg-muted/50"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        disabled={isLoading}
                                        className="pl-10 bg-muted/50"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10" type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/40" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
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

                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </m.div>
            </div>
        </div>
    );
}
