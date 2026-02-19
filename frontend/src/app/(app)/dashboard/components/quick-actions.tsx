'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export function QuickActions() {
    return (
        <div className="flex gap-2">
            <Link href="/marketplace">
                <Button variant="outline">Find Skills</Button>
            </Link>
            <Link href="/profile/skills/new">
                <Button>Add New Skill</Button>
            </Link>
        </div>
    );
}
