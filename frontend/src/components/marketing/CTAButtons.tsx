'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

export function CTAButtons() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    {isAuthenticated ? "Go to Dashboard" : "Sign Up Now"}
                </Button>
            </Link>
            <Link href="/marketplace">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-border hover:bg-muted">
                    Explore Skills
                </Button>
            </Link>
        </div>
    );
}
