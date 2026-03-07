'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { communityService } from '@/lib/services/community.service';
import { toast } from 'sonner';
import type { ForumCategory } from '@/types';
import { useAuthStore } from '@/stores/auth.store';

export default function CreateThreadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedCategoryId = searchParams.get('category');
    const { isAuthenticated } = useAuthStore();

    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        categoryId: preSelectedCategoryId ? parseInt(preSelectedCategoryId) : 0,
        title: '',
        content: '',
        tags: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/community/forum/new');
            return;
        }
        fetchCategories();
    }, [isAuthenticated, router]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await communityService.getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, categoryId: parseInt(value) }));
        if (errors.categoryId) {
            setErrors(prev => ({ ...prev, categoryId: false }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: boolean } = {};
        if (!formData.categoryId) newErrors.categoryId = true;
        if (!formData.title.trim()) newErrors.title = true;
        if (!formData.content.trim()) newErrors.content = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fill in all required highlighted fields.');
            return;
        }

        try {
            setSubmitting(true);
            const tagArray = formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);

            const thread = await communityService.createThread(
                formData.categoryId,
                formData.title,
                formData.content,
                tagArray
            );

            if (!thread) {
                throw new Error('Failed to create thread: No data returned');
            }

            toast.success('Thread created successfully!');
            router.push(`/community/forum/thread/${thread.id}`);
        } catch (error) {
            toast.error('Failed to create thread');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main
            className="font-['Plus_Jakarta_Sans']"
            style={{
                minHeight: '100vh',
                paddingTop: '100px',
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
                <button 
                    onClick={() => router.back()} 
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Forum
                </button>
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
                {/* Left Sidebar Guide */}
                <aside
                    className="hidden md:flex bg-card rounded-3xl p-8 border border-border shadow-sm flex-col"
                    style={{
                        width: '320px',
                        flexShrink: 0,
                        overflowY: 'auto',
                    }}
                >
                    <h1 className="text-2xl font-bold tracking-tight mb-8">
                        Start New Discussion
                    </h1>

                    <div className="relative flex-1">
                        <div className="space-y-8 mt-2">
                            <div className="p-4 rounded-2xl bg-primary/8 dark:bg-primary/5 border border-primary/15 dark:border-primary/10">
                                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Be Descriptive
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    A clear title and detailed content help other members understand and engage with your topic better.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-primary/8 dark:bg-primary/5 border border-primary/15 dark:border-primary/10">
                                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Choose Right Category
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Posting in the correct forum ensures your discussion reaches the most relevant audience.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-orange-500/8 dark:bg-orange-500/5 border border-orange-500/15 dark:border-orange-500/10">
                                <h3 className="font-semibold text-orange-500 flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    Community Rules
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Keep discussions respectful and helpful. Avoid spam or off-topic content to maintain a healthy community.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Form Content */}
                <div
                    className="bg-card rounded-3xl border border-border shadow-sm flex flex-col relative"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden', 
                    }}
                >
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ position: 'relative' }}>
                        <div className="space-y-6 max-w-2xl mx-auto md:mx-0">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Discussion Details
                                </h2>
                                <p className="text-muted-foreground font-medium text-sm">
                                    Fill in the form to post your thread to the community.
                                </p>
                            </div>

                            <form id="discussion-form" onSubmit={handleSubmit} className="space-y-0">
                                
                                {/* 1. Category */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                    <div className="md:col-span-1">
                                        <h3 className="text-base font-semibold text-foreground">Topic Category</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Pick a relevant forum for your post.</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="categoryId" className={`font-medium ${errors.categoryId ? 'text-destructive' : 'text-foreground'}`}>
                                                Category <span className="text-destructive">*</span>
                                            </Label>
                                            <Select value={formData.categoryId ? formData.categoryId.toString() : ''} onValueChange={handleSelectChange}>
                                                <SelectTrigger 
                                                    id="categoryId"
                                                    className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.categoryId ? 'border-destructive ring-destructive/20 focus:ring-destructive' : 'focus:ring-primary'}`}
                                                >
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.categoryId && <p className="text-xs text-destructive font-medium">Please select a category</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Title & Content */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                    <div className="md:col-span-1">
                                        <h3 className="text-base font-semibold text-foreground">Thread Content</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Make your title clear and content descriptive.</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className={`font-medium ${errors.title ? 'text-destructive' : 'text-foreground'}`}>
                                                Title <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="What's on your mind?"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.title ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                            />
                                            {errors.title && <p className="text-xs text-destructive font-medium">Title is required</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="content" className={`font-medium ${errors.content ? 'text-destructive' : 'text-foreground'}`}>
                                                Content <span className="text-destructive">*</span>
                                            </Label>
                                            <Textarea
                                                id="content"
                                                name="content"
                                                placeholder="Describe your topic in detail..."
                                                value={formData.content}
                                                onChange={handleChange}
                                                rows={6}
                                                className={`rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors resize-none ${errors.content ? 'border-destructive ring-destructive/20 focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                            />
                                            {errors.content && <p className="text-xs text-destructive font-medium">Content is required</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Tags */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                    <div className="md:col-span-1">
                                        <h3 className="text-base font-semibold text-foreground">Additional Info</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Add tags to help people find your topic.</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="tags" className="font-medium text-foreground">
                                                Tags <span className="text-muted-foreground text-xs font-normal ml-1">(comma-separated)</span>
                                            </Label>
                                            <Input
                                                id="tags"
                                                name="tags"
                                                placeholder="e.g. question, help, announcement"
                                                value={formData.tags}
                                                onChange={handleChange}
                                                className="h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors focus-visible:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="bg-background/80 backdrop-blur-md border-t border-border p-6 flex flex-col-reverse sm:flex-row items-center justify-between shrink-0 gap-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => router.back()}
                            className="font-semibold rounded-xl h-11 px-6 w-full sm:w-auto text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            type="submit"
                            form="discussion-form"
                            disabled={submitting || formData.categoryId === 0}
                            className="font-semibold rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Thread'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
