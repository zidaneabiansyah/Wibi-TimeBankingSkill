'use client';

import { Reply, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StoryComment } from '@/types';

interface CommentItemProps {
    comment: StoryComment;
    allComments: StoryComment[];
    onReply: (commentId: number) => void;
    onDelete: (commentId: number) => void;
    depth?: number;
}

export function CommentItem({ 
    comment, 
    allComments, 
    onReply, 
    onDelete, 
    depth = 0 
}: CommentItemProps) {
    const childComments = allComments.filter(c => c.parent_id === comment.id);
    const maxDepth = 4; // Limit nesting depth for UI clarity
    
    return (
        <div 
            className={`flex flex-col ${depth > 0 ? 'ml-12 mt-2 relative before:absolute before:-left-6 before:top-0 before:bottom-0 before:w-px before:bg-white/10' : 'mb-6'}`}
        >
            <div className="flex gap-4 group">
                {/* Avatar */}
                <div className="w-10 h-10 bg-[#5B21B6] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[13px] font-bold text-white tracking-wider">
                        {comment.author?.full_name ? comment.author.full_name.charAt(0).toUpperCase() : 'A'}
                    </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-[14px] text-white">
                            @{comment.author?.full_name?.replace(/\s+/g, '') || 'Anonymous'}
                        </p>
                        <span className="text-[12px] font-medium text-stone-500">
                            {new Date(comment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    
                    <p className="text-white text-[15px] leading-relaxed mb-2 font-medium">
                        {comment.content}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 -ml-2">
                        {depth < maxDepth && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onReply(comment.id)}
                                className="text-stone-400 hover:text-white hover:bg-white/10 h-8 px-3 rounded-full text-[13px] font-semibold"
                            >
                                <Reply className="h-4 w-4 mr-2" /> Reply
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(comment.id)}
                            className="text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Nested Replies */}
            {childComments.length > 0 && (
                <div className="space-y-2">
                    {childComments.map((child) => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            allComments={allComments}
                            onReply={onReply}
                            onDelete={onDelete}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface NestedCommentsProps {
    comments: StoryComment[];
    onReply: (commentId: number) => void;
    onDelete: (commentId: number) => void;
}

export function NestedComments({ comments, onReply, onDelete }: NestedCommentsProps) {
    // Get only root-level comments (no parent)
    const rootComments = comments.filter(c => !c.parent_id);
    
    if (comments.length === 0) {
        return (
            <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
            </p>
        );
    }
    
    return (
        <div className="space-y-4">
            {rootComments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    allComments={comments}
                    onReply={onReply}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
