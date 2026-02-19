import type { Metadata } from 'next';
import { SkillsClient } from './skills-client';

export const metadata: Metadata = {
    title: 'My Skills - Manage Your Expertise | Wibi',
    description: 'Manage the skills you teach. Add new skills, update descriptions, set availability, and track your teaching performance.',
    keywords: ['my skills', 'teaching skills', 'skill management', 'expertise', 'tutoring'],
};

export default function SkillsPage() {
    return <SkillsClient />;
}
