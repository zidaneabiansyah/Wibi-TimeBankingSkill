'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Heart, MessageCircle, ArrowLeft, MoreVertical, Link as LinkIcon, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { communityService } from '@/lib/services/community.service';
import { useCommunityStore } from '@/stores/community.store';
import { NestedComments } from '@/components/features/community';
import type { SuccessStory, StoryComment } from '@/types';
import { toast } from 'sonner';
import { sanitizeHTML } from '@/lib/utils/sanitization';
import OptimizedImage from '@/components/shared/common/OptimizedImage';

export default function StoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const storyId = parseInt(params.id as string);

    const { selectedStory, setSelectedStory, storyComments, setStoryComments, loading, setLoading, error, setError } =
        useCommunityStore();

    const [commentContent, setCommentContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // Like state
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loadingLike, setLoadingLike] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [recommendedStories, setRecommendedStories] = useState<SuccessStory[]>([]);
    const [loadingRecommended, setLoadingRecommended] = useState(true);

    useEffect(() => {
        fetchStory();
        fetchComments();
        fetchRecommendedStories();
    }, [storyId]);

    useEffect(() => {
        if (selectedStory) {
            setLikeCount((selectedStory as any).like_count || 0);
            checkLikeStatus();
        }
    }, [selectedStory?.id]);

    const checkLikeStatus = async () => {
        if (!selectedStory) return;
        try {
            const data = await communityService.checkStoryLike(selectedStory.id);
            setIsLiked(data.liked);
            setLikeCount(data.count);
        } catch (err) {
            console.error('Failed to check like status:', err);
        }
    };

    const fetchStory = async () => {
        try {
            setLoading(true);
            const data = await communityService.getStory(storyId);
            setSelectedStory(data);
        } catch (err) {
            setError('Failed to load story');
            toast.error('Failed to load story');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await communityService.getComments(storyId);
            setStoryComments(data.comments);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
        }
    };

    const fetchRecommendedStories = async () => {
        try {
            setLoadingRecommended(true);
            const data = await communityService.getPublishedStories(5, 0);
            // Filter out current story if present
            setRecommendedStories(data.stories.filter(s => s.id !== storyId));
        } catch (err) {
            console.error('Failed to fetch recommended stories:', err);
        } finally {
            setLoadingRecommended(false);
        }
    };

    const handleComment = async () => {
        if (!commentContent.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            setSubmitting(true);
            const newComment = await communityService.createComment(storyId, commentContent, replyingTo);
            setStoryComments([...storyComments, newComment]);
            setCommentContent('');
            setReplyingTo(null);
            toast.success('Comment posted successfully!');
        } catch (err) {
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async () => {
        if (!selectedStory) return;
        
        // Optimistic update
        const prevLiked = isLiked;
        const prevCount = likeCount;
        setIsLiked(!prevLiked);
        setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            setLoadingLike(true);
            const data = await communityService.toggleStoryLike(selectedStory.id);
            setIsLiked(data.liked);
            setLikeCount(data.count);
        } catch (err) {
            // Revert on error
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error('Failed to update like status');
        } finally {
            setLoadingLike(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await communityService.deleteComment(commentId);
            setStoryComments(storyComments.filter((c) => c.id !== commentId));
            toast.success('Comment deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete comment');
        }
    };

    const handleReply = (commentId: number) => {
        setReplyingTo(commentId);
        // Scroll to comment form
        const formArea = document.getElementById('comment-form');
        formArea?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !selectedStory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">{error || 'Story not found'}</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    const replyingToComment = replyingTo ? storyComments.find(c => c.id === replyingTo) : null;

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
    };

    return (
        <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
                
                {/* Breadcrumb / Status area */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        <Link href="/community" className="hover:text-primary transition-colors">Success Stories</Link>
                        <span className="mx-2 text-border">/</span>
                        <span className="text-foreground">Detail</span>
                    </div>
                </div>

                <Button 
                    variant="ghost" 
                    onClick={() => router.back()} 
                    className="mb-8 text-muted-foreground hover:text-foreground hover:bg-muted pl-0 group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to stories
                </Button>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ===== LEFT COLUMN: Main Story Content (span 8) ===== */}
                    <div className="lg:col-span-8 flex flex-col min-w-0 pb-10">
                        
                        {/* Title and Top Meta */}
                        <div className="mb-8">
                            <h1 className="text-[32px] md:text-[40px] font-bold text-foreground mb-6 leading-tight tracking-tight">
                                {selectedStory.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                        {selectedStory.user?.full_name ? (
                                            <span className="text-primary text-base font-bold tracking-wider">
                                                {selectedStory.user.full_name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="text-primary text-base font-bold tracking-wider">AN</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[16px] font-bold text-foreground leading-tight mb-1">
                                            {selectedStory.user?.full_name || 'Anonymous'}
                                        </p>
                                        <p className="text-[13px] font-medium text-muted-foreground flex items-center gap-2">
                                            {new Date(selectedStory.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Menu */}
                                <div className="flex items-center gap-3">
                                    <Button onClick={copyLink} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                        <LinkIcon className="h-4 w-4 mr-2" />
                                        Copy Link
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10">
                                        <Flag className="h-4 w-4 mr-2" />
                                        Report
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Feature Image */}
                        {(selectedStory.featured_image_url || (selectedStory.images && selectedStory.images.length > 0)) && (
                            <div className="relative h-[300px] sm:h-[450px] w-full rounded-[24px] overflow-hidden mb-8 border border-border shadow-sm bg-muted">
                                <OptimizedImage
                                    src={selectedStory.featured_image_url || selectedStory.images[0]}
                                    alt={selectedStory.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Tags */}
                        {selectedStory.tags && selectedStory.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 mb-8">
                                {selectedStory.tags.map((tag) => (
                                    <span key={tag} className="px-4 py-1.5 bg-muted border border-border rounded-full text-[13px] font-semibold text-foreground">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Story Content */}
                        <div 
                            className="prose prose-stone dark:prose-invert max-w-none mb-10 prose-p:text-[16px] prose-p:leading-relaxed prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(selectedStory.description) }}
                        />

                        {/* Interaction Bar */}
                        <div className="flex items-center justify-between py-6 border-y border-border mb-10">
                            <div className="flex items-center gap-8">
                                <button 
                                    onClick={handleLike}
                                    disabled={loadingLike}
                                    className="flex items-center gap-2.5 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className={`p-2 rounded-full transition-all duration-300 ${isLiked ? 'bg-rose-500/20 text-rose-500' : 'bg-muted text-muted-foreground group-hover:bg-rose-500/10 group-hover:text-rose-400'}`}>
                                        <Heart className={`h-5 w-5 stroke-[2.5] transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
                                    </div>
                                    <span className={`font-bold text-[15px] ${isLiked ? 'text-rose-500' : 'text-foreground group-hover:text-rose-400'}`}>
                                        {likeCount} Likes
                                    </span>
                                </button>
                                
                                <button 
                                    onClick={() => document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-2.5 group"
                                >
                                    <div className="p-2 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <MessageCircle className="h-5 w-5 stroke-[2.5]" />
                                    </div>
                                    <span className="font-bold text-[15px] text-foreground group-hover:text-primary">
                                        {selectedStory.comment_count} Comments
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Comments Section (Merged form and list like YouTube) */}
                        <div className="space-y-6 mb-10">
                            <h2 className="text-[20px] font-bold text-foreground mb-6">Comments ({storyComments.length})</h2>
                            
                            {/* Comment Input Form */}
                            <div id="comment-form" className="flex gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-primary/20 border border-border flex items-center justify-center shrink-0">
                                    <span className="text-[13px] font-bold text-primary tracking-wider">M</span> {/* Hardcoded M for ME as placeholder or fetch user */}
                                </div>
                                <div className="flex-1">
                                    {replyingToComment && (
                                        <div className="flex items-center gap-2 mb-2 text-sm">
                                            <span className="text-muted-foreground">Replying to</span>
                                            <span className="font-bold text-foreground">@{replyingToComment.author?.full_name?.replace(' ', '') || 'Anonymous'}</span>
                                            <button 
                                                onClick={() => setReplyingTo(null)}
                                                className="text-muted-foreground hover:text-rose-400 ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-muted"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                    <textarea
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full bg-transparent border-0 border-b border-border pb-2 focus:ring-0 focus:border-primary text-foreground placeholder:text-muted-foreground/50 text-[15px] resize-none overflow-hidden min-h-[30px]"
                                        rows={1}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = target.scrollHeight + 'px';
                                        }}
                                    />
                                    {/* Action Buttons (Show only if typing or replying) */}
                                    {(commentContent.length > 0 || replyingTo) && (
                                        <div className="flex justify-end gap-3 mt-3">
                                            <button
                                                onClick={() => {
                                                    setCommentContent('');
                                                    setReplyingTo(null);
                                                }}
                                                className="px-4 py-2 rounded-full text-[14px] font-semibold text-muted-foreground hover:bg-muted transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={handleComment} 
                                                disabled={submitting || !commentContent.trim()}
                                                className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-colors flex items-center ${
                                                    commentContent.trim() 
                                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
                                                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                                                }`}
                                            >
                                                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                                {replyingTo ? 'Reply' : 'Comment'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {storyComments.length > 0 ? (
                                    <NestedComments 
                                        comments={storyComments} 
                                        onReply={handleReply}
                                        onDelete={handleDeleteComment}
                                    />
                                ) : (
                                    <div className="text-center py-12 rounded-2xl bg-muted/30 border border-dashed border-border">
                                        <p className="text-muted-foreground font-medium">No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT COLUMN: Recommended Sidebar (span 4) ===== */}
                    <aside className="hidden lg:block lg:col-span-4 shrink-0">
                        <div className="sticky top-28 flex flex-col space-y-6 pb-4">
                            <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
                                <h3 className="font-bold text-[18px] text-foreground mb-6 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-primary fill-primary/20" />
                                    More Inspiring Stories
                                </h3>

                                <div className="flex flex-col gap-5">
                                    {loadingRecommended ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                    ) : recommendedStories.length > 0 ? (
                                        recommendedStories.map((story) => (
                                            <Link 
                                                key={story.id} 
                                                href={`/community/stories/${story.id}`}
                                                className="group flex flex-col gap-3 p-3 -mx-3 rounded-xl hover:bg-muted transition-colors"
                                            >
                                                <h4 className="font-bold text-[15px] text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                    {story.title}
                                                </h4>
                                                
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-border flex items-center justify-center shrink-0">
                                                        <span className="text-primary text-[10px] font-bold">
                                                            {story.user?.full_name ? story.user.full_name.charAt(0).toUpperCase() : 'A'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[13px] font-medium text-muted-foreground truncate">
                                                        {story.user?.full_name || 'Anonymous'}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-stone-500 text-sm font-medium text-center py-4">
                                            No other stories found.
                                        </p>
                                    )}
                                </div>

                                <Button 
                                    variant="outline" 
                                    onClick={() => router.push('/community/stories')}
                                    className="w-full mt-6 border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl bg-transparent"
                                >
                                    Browse All Stories
                                </Button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

