'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

export function CTASection() {
    const { isAuthenticated } = useAuthStore();

    return (
        <section className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden border-t border-border/40">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-secondary/5" />

            <div className="relative mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <Badge className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                        Get Started Today
                    </Badge>

                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                        Ready to Exchange Skills?
                    </h2>

                    <p className="mx-auto max-w-150 text-muted-foreground text-lg leading-relaxed">
                        Join 1,200+ students who are already learning and teaching without spending money.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto px-8 font-semibold flex items-center justify-center gap-2">
                                {isAuthenticated ? "Go to Dashboard" : "Sign Up Free"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/how-it-works" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 font-semibold">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
