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
            className={`border-l-2 ${depth > 0 ? 'border-muted ml-4 pl-4' : 'border-transparent'}`}
        >
            <div className="bg-card rounded-lg border border-border p-4 mb-2">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                                {comment.author?.full_name?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{comment.author?.full_name || 'Anonymous'}</p>
                            <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {depth < maxDepth && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onReply(comment.id)}
                                className="text-muted-foreground hover:text-foreground h-8 px-2"
                            >
                                <Reply className="h-3 w-3 mr-1" /> Reply
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(comment.id)}
                            className="text-destructive hover:text-destructive h-8 px-2"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <p className="text-muted-foreground text-sm">{comment.content}</p>
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
