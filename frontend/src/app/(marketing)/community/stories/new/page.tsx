'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { communityService } from '@/lib/services/community.service';
import { useCommunityStore } from '@/stores/community.store';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';

export default function CreateStoryPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { addStory } = useCommunityStore();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        featuredImageURL: '',
        tags: '',
        isPublished: true,
    });

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/community/stories/new');
        }
    }, [isAuthenticated, router]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPublished: checked }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: boolean } = {};
        if (!formData.title.trim()) newErrors.title = true;
        if (!formData.description.trim()) newErrors.description = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fill in the required fields.');
            return;
        }

        try {
            setLoading(true);
            const tagArray = formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);

            const story = await communityService.createStory(
                formData.title,
                formData.description,
                formData.featuredImageURL,
                [],
                tagArray,
                formData.isPublished
            );
            
            addStory(story);
            toast.success('Story created successfully!');
            router.push('/community/stories');
        } catch (err) {
            console.error('Failed to create story:', err);
            toast.error('Failed to create story');
        } finally {
            setLoading(false);
        }
    };

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
                    Back to Stories
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
                        Share Your Story
                    </h1>

                    <div className="relative flex-1">
                        <div className="space-y-8 mt-2">
                            <div className="p-4 rounded-2xl bg-primary/8 dark:bg-primary/5 border border-primary/15 dark:border-primary/10">
                                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Focus on Impact
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Describe how timebanking changed your day or helped you learn a new skill.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-primary/8 dark:bg-primary/5 border border-primary/15 dark:border-primary/10">
                                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Be Detailed
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Share the challenges you faced and those &quot;aha!&quot; moments during your journey.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-orange-500/8 dark:bg-orange-500/5 border border-orange-500/15 dark:border-orange-500/10">
                                <h3 className="font-semibold text-orange-500 flex items-center gap-2 mb-2">
                                    <Heart className="w-4 h-4" />
                                    Inspire Others
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Your story can motivate others to join and contribute to our growing community.
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
                                    Story Details
                                </h2>
                                <p className="text-muted-foreground font-medium text-sm">
                                    Tell the community about your positive experience with Wibi.
                                </p>
                            </div>

                            <form id="story-form" onSubmit={handleSubmit} className="space-y-0">
                                
                                {/* 1. Title */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                    <div className="md:col-span-1">
                                        <h3 className="text-base font-semibold text-foreground">Headline</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Give your success story a catchy title.</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className={`font-medium ${errors.title ? 'text-destructive' : 'text-foreground'}`}>
                                                Title <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="e.g. How I mastered React in 2 weeks"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className={`h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors ${errors.title ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                            />
                                            {errors.title && <p className="text-xs text-destructive font-medium">Title is required</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Description */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                    <div className="md:col-span-1">
                                        <h3 className="text-base font-semibold text-foreground">The Journey</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Describe your experience in detail.</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="description" className={`font-medium ${errors.description ? 'text-destructive' : 'text-foreground'}`}>
                                                Content <span className="text-destructive">*</span>
                                            </Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                placeholder="Tell your story..."
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={8}
                                                className={`rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors resize-none ${errors.description ? 'border-destructive ring-destructive/20 focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                            />
                                            {errors.description && <p className="text-xs text-destructive font-medium">Content is required</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Image URL & Tags */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border">
                                    <div className="md:col-span-1">
                                        <h3 className="text-base font-semibold text-foreground">Visuals & Discovery</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Enhance your story with an image and tags.</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="featuredImageURL" className="font-medium text-foreground">
                                                Featured Image URL <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span>
                                            </Label>
                                            <Input
                                                id="featuredImageURL"
                                                name="featuredImageURL"
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                value={formData.featuredImageURL}
                                                onChange={handleChange}
                                                className="h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors focus-visible:ring-primary"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tags" className="font-medium text-foreground">
                                                Tags <span className="text-muted-foreground text-xs font-normal ml-1">(comma-separated)</span>
                                            </Label>
                                            <Input
                                                id="tags"
                                                name="tags"
                                                placeholder="e.g. achievement, learning, success"
                                                value={formData.tags}
                                                onChange={handleChange}
                                                className="h-12 rounded-xl bg-muted/20 hover:bg-muted/30 focus:bg-background transition-colors focus-visible:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Visibility */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                                    <div className="md:col-span-1">
                                        <h3 className="text-base font-semibold text-foreground">Visibility</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Control who can see your story.</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50">
                                            <div className="grid gap-1.5 leading-none">
                                                <Label
                                                    htmlFor="isPublished"
                                                    className="text-sm font-semibold leading-none cursor-pointer"
                                                >
                                                    Publish immediately
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Your story will be visible to the community right away.
                                                </p>
                                            </div>
                                            <Switch 
                                                id="isPublished" 
                                                checked={formData.isPublished}
                                                onCheckedChange={handleCheckboxChange}
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
                            form="story-form"
                            disabled={loading}
                            className="font-semibold rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Story'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
