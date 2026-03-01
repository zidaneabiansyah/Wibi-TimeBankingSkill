'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, MessageSquare, ArrowLeft, Pin, Lock, Unlock, Reply, Trash2, MoreVertical, Link as LinkIcon, Flag, Image as ImageIcon, Paperclip, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { communityService } from '@/lib/services/community.service';
import { useCommunityStore } from '@/stores/community.store';
import { useAuthStore } from '@/stores/auth.store';
import type { ForumThread, ForumReply } from '@/types';
import { toast } from 'sonner';
import { sanitizeHTML } from '@/lib/utils/sanitization';

export default function ForumThreadPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const threadId = parseInt(params.id as string);

    const { selectedThread, setSelectedThread, replies, setReplies, loading, setLoading, error, setError } =
        useCommunityStore();

    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    // Vote state
    const [hasVoted, setHasVoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [voteSubmitting, setVoteSubmitting] = useState(false);

    useEffect(() => {
        fetchThread();
        fetchReplies();
    }, [threadId]);

    useEffect(() => {
        if (selectedThread) {
            setUpvoteCount((selectedThread as any).upvote_count || 0);
            checkVoteStatus();
        }
    }, [selectedThread?.id]);

    const checkVoteStatus = async () => {
        if (!selectedThread) return;
        try {
            const data = await communityService.checkThreadUpvote(selectedThread.id);
            setHasVoted(data.voted);
            setUpvoteCount(data.count);
        } catch (err) {
            console.error('Failed to check vote status:', err);
        }
    };

    const handleToggleUpvote = async () => {
        if (!selectedThread) {
            toast.error('Thread not loaded');
            return;
        }

        if (!isAuthenticated) {
            toast.error('Please login to upvote threads');
            router.push('/login');
            return;
        }
        
        // Optimistic update
        const prevVoted = hasVoted;
        const prevCount = upvoteCount;
        setHasVoted(!prevVoted);
        setUpvoteCount(prevVoted ? prevCount - 1 : prevCount + 1);

        try {
            setVoteSubmitting(true);
            const data = await communityService.toggleThreadUpvote(selectedThread.id);
            setHasVoted(data.voted);
            setUpvoteCount(data.count);
        } catch (err) {
            // Revert changes on error
            setHasVoted(prevVoted);
            setUpvoteCount(prevCount);
            toast.error('Failed to vote');
        } finally {
            setVoteSubmitting(false);
        }
    };

    const fetchThread = async () => {
        try {
            setLoading(true);
            const data = await communityService.getThread(threadId);
            setSelectedThread(data);
        } catch (err) {
            setError('Failed to load thread');
            toast.error('Failed to load thread');
        } finally {
            setLoading(false);
        }
    };

    const fetchReplies = async () => {
        try {
            const data = await communityService.getReplies(threadId);
            setReplies(data.replies);
        } catch (err) {
            console.error('Failed to fetch replies:', err);
        }
    };

    const handlePin = async () => {
        if (!selectedThread) return;
        try {
            await communityService.pinThread(selectedThread.id, !selectedThread.is_pinned);
            setSelectedThread({ ...selectedThread, is_pinned: !selectedThread.is_pinned });
            toast.success(selectedThread.is_pinned ? 'Thread unpinned' : 'Thread pinned');
        } catch (err) {
            toast.error('Failed to update pin status');
        }
    };

    const handleLock = async () => {
        if (!selectedThread) return;
        try {
            await communityService.lockThread(selectedThread.id, !selectedThread.is_closed);
            setSelectedThread({ ...selectedThread, is_closed: !selectedThread.is_closed });
            toast.success(selectedThread.is_closed ? 'Thread unlocked' : 'Thread locked');
        } catch (err) {
            toast.error('Failed to update lock status');
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim()) {
            toast.error('Please enter a reply');
            return;
        }

        try {
            setSubmitting(true);
            const newReply = await communityService.createReply(threadId, replyContent, replyingTo);
            setReplies([newReply, ...replies]);
            setReplyContent('');
            setReplyingTo(null);
            toast.success('Reply posted successfully!');
        } catch (err) {
            toast.error('Failed to post reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReply = async (replyId: number) => {
        if (!confirm('Are you sure you want to delete this reply?')) return;

        try {
            await communityService.deleteReply(replyId);
            setReplies(replies.filter((r) => r.id !== replyId));
            toast.success('Reply deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete reply');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !selectedThread) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">{error || 'Thread not found'}</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
                
                {/* Breadcrumb / Back button */}
                <div className="mb-8 flex items-center">
                    <Button variant="link" onClick={() => router.back()} className="text-sm font-medium tracking-wide text-primary hover:text-primary/80 uppercase p-0 h-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Community
                    </Button>
                </div>

                {/* 2-Column Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ===== LEFT WORKSPACE (span 8) ===== */}
                    <main className="col-span-1 lg:col-span-8 flex flex-col min-w-0 space-y-6">

                        {/* Thread */}
                        <div className="bg-card rounded-4xl border border-border p-8 relative shadow-sm">
                    {/* Author & Meta */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${selectedThread.author?.full_name || 'Anonymous'}&background=random`} 
                                    alt={selectedThread.author?.full_name || 'Anonymous'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-[24px] font-bold text-foreground mb-1 leading-tight tracking-tight">
                                    {selectedThread.title}
                                </h1>
                                <div className="flex items-center gap-3 text-[13px] text-muted-foreground font-medium">
                                    <span className="text-foreground font-semibold">{selectedThread.author?.full_name || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{new Date(selectedThread.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Right Actions */}
                        <div className="flex items-center gap-2">
                            {selectedThread.is_pinned && (
                                <div className="p-2 bg-primary/10 rounded-xl" title="Pinned">
                                    <Pin className="h-5 w-5 text-primary rotate-45" />
                                </div>
                            )}
                            {selectedThread.is_closed && (
                                <div className="p-2 bg-destructive/10 rounded-xl" title="Locked">
                                    <Lock className="h-5 w-5 text-destructive" />
                                </div>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border border-border rounded-xl shadow-xl w-40">
                                    <DropdownMenuItem onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('Link copied to clipboard');
                                    }} className="focus:bg-muted rounded-lg cursor-pointer flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>Copy Link</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toast.success('Content reported')} className="focus:bg-muted rounded-lg cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive">
                                        <Flag className="h-4 w-4" />
                                        <span>Report</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Content */}
                    <div 
                        className="prose prose-stone dark:prose-invert max-w-none mb-8 text-[14px] leading-relaxed text-muted-foreground
                            prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(selectedThread.content) }}
                    />

                    {selectedThread.tags && selectedThread.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedThread.tags.map((tag) => (
                                <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Interaction Bar */}
                    <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border">
                        <button 
                            onClick={handleToggleUpvote}
                            disabled={voteSubmitting}
                            className={`flex items-center gap-2.5 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className={`p-2 rounded-full transition-colors ${hasVoted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                <ArrowUp className={`h-5 w-5 stroke-[2.5] transition-transform duration-300 ${hasVoted ? 'scale-110' : ''}`} />
                            </div>
                            <span className={`font-bold text-[14px] ${hasVoted ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                {upvoteCount} Upvotes
                            </span>
                        </button>
                        
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                            <div className="p-2 rounded-full bg-muted text-muted-foreground">
                                <MessageSquare className="h-5 w-5 stroke-[2.5]" />
                            </div>
                            <span className="font-bold text-[14px] text-foreground">
                                {selectedThread.reply_count} Replies
                            </span>
                        </div>
                    </div>
                </div>

                {/* Reply form */}
                <div className="bg-card rounded-3xl border border-border p-4 mb-8 relative shadow-sm">
                    {selectedThread.is_closed ? (
                        <div className="bg-muted p-4 rounded-2xl border border-border text-center text-muted-foreground">
                            <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground/60" />
                            <p className="font-medium text-[14px]">This thread is locked. Replies are disabled.</p>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-muted border border-border shrink-0 mt-2">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=You&background=random`} 
                                    alt="You"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                {replyingTo && (
                                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-2 rounded-xl mb-2 text-sm">
                                        <span className="text-primary font-medium flex items-center gap-1.5"><Reply className="w-3.5 h-3.5"/> Replying to a comment...</span>
                                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="h-auto p-1 text-primary hover:text-primary hover:bg-white/10 rounded-lg text-xs">Cancel</Button>
                                    </div>
                                )}
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Type your reply here..."
                                    className="w-full p-3 border border-border rounded-2xl mb-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground/50 text-[14px] resize-none overflow-hidden min-h-[80px] transition-all"
                                />
                                <div className="flex justify-between items-center">
                                    {/* Left Actions */}
                                    <div className="flex items-center gap-1 ml-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" title="Add Image">
                                            <ImageIcon className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" title="Attach File">
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Right Action */}
                                    <Button onClick={handleReply} disabled={submitting} size="sm" className="rounded-xl px-5 h-9 bg-primary hover:bg-primary/90 text-white font-semibold text-[13px]">
                                        {submitting ? 'Posting...' : 'Post Reply'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Replies */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground px-2">{replies.length} {replies.length === 1 ? 'Comment' : 'Comments'}</h2>
                    
                    {replies.length === 0 ? (
                        <div className="text-center py-12 px-4 rounded-3xl border border-border border-dashed bg-card/20">
                            <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                            <p className="text-muted-foreground font-medium text-[15px]">No replies yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {replies.map((reply) => (
                                <div key={reply.id} className="bg-card rounded-3xl border border-border p-6 shadow-sm hover:border-primary/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border shrink-0 mt-0.5">
                                            <img 
                                                src={`https://ui-avatars.com/api/?name=${reply.author?.full_name || 'Anonymous'}&background=random`} 
                                                alt={reply.author?.full_name || 'Anonymous'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Content Area */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-bold text-[14px] text-foreground tracking-tight">{reply.author?.full_name || 'Anonymous'}</p>
                                                    <p className="text-[11px] font-medium text-muted-foreground">
                                                        {new Date(reply.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                    </p>
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="flex items-center gap-1 -mt-1 -mr-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                             setReplyingTo(reply.id);
                                                             window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                                        }}
                                                        className="h-8 px-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg text-xs font-semibold"
                                                    >
                                                        <Reply className="h-3.5 w-3.5 mr-1.5" /> Reply
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteReply(reply.id)}
                                                        className="h-8 px-2.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg text-xs font-semibold"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            <div 
                                                className="prose prose-sm prose-stone dark:prose-invert max-w-none text-[13.5px] leading-relaxed text-muted-foreground
                                                    prose-p:my-1.5 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground wrap-break-word"
                                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(reply.content) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                    </main>

                    {/* ===== RIGHT SIDEBAR (span 4) ===== */}
                    <aside className="hidden lg:block lg:col-span-4 shrink-0">
                        <div className="sticky top-28 flex flex-col space-y-8 pb-10">
                            
                            {/* Category, Tags, Top Contributors Combo Card */}
                            <div className="bg-card border border-border rounded-4xl p-6">
                                <h3 className="font-semibold text-[17px] text-foreground mb-4">Thread Details</h3>
                                
                                <div className="space-y-6">
                                    {/* Category */}
                                    {selectedThread.category && (
                                        <div>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Category</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedThread.category.color || '#f97316' }} />
                                                <span className="text-sm font-medium text-foreground">{selectedThread.category.name}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {selectedThread.tags && selectedThread.tags.length > 0 && (
                                        <div>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedThread.tags.map((tag) => (
                                                    <span key={tag} className="px-3 py-1 bg-muted border border-border rounded-xl text-[12px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors cursor-pointer">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Top Contributors Mock */}
                                    <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">Top Contributors</p>
                                        <ul className="space-y-3">
                                            {[
                                                { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', replies: 120 },
                                                { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', replies: 84 },
                                                { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', replies: 79 },
                                                { name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', replies: 56 },
                                                { name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', replies: 32 }
                                            ].map((user, i) => (
                                                <li key={i} className="flex items-center justify-between group cursor-pointer p-1 -ml-1 rounded-lg hover:bg-muted transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-border" />
                                                        <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground">{user.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground/60 font-medium">
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        <span>{user.replies}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Unanswered Talks Mock */}
                            <div>
                                <h3 className="font-semibold text-[17px] text-foreground mb-2">Unanswered Talks</h3>
                                <p className="text-xs text-muted-foreground font-medium mb-4">Discussions with no comments. Be the first to reply!</p>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Any recommended books for learning Golang?', author: 'Alice', time: '2 hours ago' },
                                        { title: 'Tips for passing technical interviews?', author: 'Bob', time: '5 hours ago' }
                                    ].map((talk, i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                     <img src={`https://i.pravatar.cc/150?u={talk.author}`} alt={talk.author} className="w-full h-full object-cover opacity-70" />
                                                </div>
                                                <p className="text-[12px] text-muted-foreground font-medium">{talk.author} <span className="text-muted-foreground/40 font-normal">posted</span></p>
                                            </div>
                                            <h4 className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                                                {talk.title}
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                                                <MessageSquare className="w-3 h-3" />
                                                <span>0 comments</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
