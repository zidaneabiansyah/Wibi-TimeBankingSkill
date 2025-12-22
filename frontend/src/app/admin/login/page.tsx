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
import { useAdminStore } from '@/stores/admin.store';
import { toast } from 'sonner';
import Dither from "@/components/Dither";
import { ArrowLeft, Github } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAdminStore();
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
            router.push('/admin');
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
                        Admin Dashboard
                    </h1>
                    <p className="text-white/60 text-lg">
                        Manage users, sessions, and skills.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
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
                        <h2 className="text-2xl font-semibold tracking-tight">Admin Login</h2>
                        <p className="text-sm text-muted-foreground">
                            Sign in to your admin account to continue
                        </p>
                    </div>

                    <div className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

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

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Your Password"
                                    {...register('password')}
                                    disabled={isLoading}
                                    className="bg-muted/50"
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10" type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
