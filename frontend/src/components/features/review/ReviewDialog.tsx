'use client'

import React, { useState } from 'react'
import { Star, Loader2, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'
import { useReviewStore } from '@/stores'
import { toast } from 'sonner'
import type { Session, Review } from '@/types'

interface ReviewDialogProps {
    session: Session;
    existingReview?: Review; // The existing review data, if any
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

const StarRating = ({ rating, onChange, label, tooltip }: { rating: number | null, onChange: (val: number) => void, label: string, tooltip?: string }) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    return (
        <div className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-muted/20 border border-border/10">
            <Label className="text-[13px] sm:text-sm font-bold text-foreground/80">{label}</Label>
            <div className="flex gap-0.5 sm:gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className={`transition-all duration-200 ${
                            star <= (hoverRating || rating || 0)
                                ? 'text-amber-400 scale-105 sm:scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : 'text-muted-foreground/30 hover:scale-110 hover:text-amber-200'
                        }`}
                        title={tooltip || `Rate ${star} stars`}
                    >
                        <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-current stroke-current" />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default function ReviewDialog({ session, existingReview, onSuccess, trigger }: ReviewDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Ratings
    const [rating, setRating] = useState<number | null>(existingReview?.rating || null)
    const [communicationRating, setCommunicationRating] = useState<number | null>(existingReview?.communication_rating || null)
    const [punctualityRating, setPunctualityRating] = useState<number | null>(existingReview?.punctuality_rating || null)
    const [knowledgeRating, setKnowledgeRating] = useState<number | null>(existingReview?.knowledge_rating || null)
    
    // Other fields
    const [comment, setComment] = useState(existingReview?.comment || '')
    const [selectedTags, setSelectedTags] = useState<string[]>(
        existingReview?.tags ? existingReview.tags.split(',').map((t: string) => t.trim()) : []
    )

    const { createReview, updateReview } = useReviewStore()

    const availableTags = [
        "Patient", "Clear Explanation", "Engaging", 
        "Punctual", "Well Prepared", "Knowledgeable"
    ]

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const resetForm = () => {
        if (!existingReview) {
            setRating(null)
            setCommunicationRating(null)
            setPunctualityRating(null)
            setKnowledgeRating(null)
            setComment('')
            setSelectedTags([])
        } else {
            setRating(existingReview.rating)
            setCommunicationRating(existingReview.communication_rating)
            setPunctualityRating(existingReview.punctuality_rating)
            setKnowledgeRating(existingReview.knowledge_rating)
            setComment(existingReview.comment || '')
            setSelectedTags(existingReview.tags ? existingReview.tags.split(',').map((t: string) => t.trim()) : [])
        }
        setIsSuccess(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Wait for exit animation to finish before resetting
            setTimeout(resetForm, 300);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!rating) {
            toast.error('Please provide an Overall Rating')
            return
        }

        try {
            setIsSubmitting(true)
            
            const reviewData = {
                session_id: session.id,
                rating,
                comment,
                tags: selectedTags.join(','),
                communication_rating: communicationRating,
                punctuality_rating: punctualityRating,
                knowledge_rating: knowledgeRating,
            }

            if (existingReview) {
                await updateReview(existingReview.id, reviewData)
            } else {
                await createReview(reviewData)
            }
            
            // Show Success Animation View
            setIsSuccess(true)
            
            // Auto close dialog after showing success state
            setTimeout(() => {
                setOpen(false)
                onSuccess?.()
                setTimeout(resetForm, 300)
            }, 2500)

        } catch (error) {
            toast.error('Failed to submit review')
        } finally {
            setIsSubmitting(false)
        }
    }

    const revieweeName = session.teacher_id === session?.student_id 
        ? session.student?.full_name 
        : session.teacher?.full_name || 'your mentor'

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="w-full">Write a Review</Button>
                )}
            </DialogTrigger>
            
            <DialogContent className="w-[95vw] sm:max-w-[550px] p-0 overflow-hidden bg-background/95 backdrop-blur-2xl border-border/40 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-6"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="w-24 h-24 rounded-full bg-linear-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                            >
                                <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-3xl font-bold tracking-tight text-foreground mb-2">Makasih review nya ya! ✨</h3>
                                <p className="text-muted-foreground font-medium">Your feedback helps the community grow.</p>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div className="p-5 sm:p-8 sm:pb-6 bg-muted/10 border-b border-border/5">
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-1 sm:mb-2">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Rate Your Session</DialogTitle>
                                            <DialogDescription className="text-xs sm:text-[13px] font-medium text-muted-foreground/80">
                                                How was your experience with <span className="text-foreground font-semibold">{revieweeName}</span>?
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>

                            <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                
                                {/* Overall Rating - Prominent */}
                                <div className="space-y-3 sm:space-y-4 text-center pb-5 sm:pb-6 border-b border-border/10">
                                    <Label className="text-sm sm:text-base font-bold text-foreground">Overall Rating</Label>
                                    <div className="flex justify-center gap-1 sm:gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`text-3xl sm:text-5xl transition-all duration-300 hover:scale-110 active:scale-90 ${
                                                    star <= (rating || 0) 
                                                        ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                                                        : 'text-muted-foreground/20 hover:text-amber-200'
                                                }`}
                                            >
                                                ⭐
                                            </button>
                                        ))}
                                    </div>
                                    {rating && (
                                        <motion.p 
                                            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} 
                                            className="text-sm font-bold text-amber-500 uppercase tracking-widest"
                                        >
                                            {rating} out of 5 stars
                                        </motion.p>
                                    )}
                                </div>

                                {/* Detailed Ratings - Vertical List */}
                                <div className="flex flex-col gap-3 pt-2">
                                    <StarRating 
                                        label="Communication" 
                                        rating={communicationRating} 
                                        onChange={setCommunicationRating} 
                                    />
                                    <StarRating 
                                        label="Punctuality" 
                                        rating={punctualityRating} 
                                        onChange={setPunctualityRating} 
                                    />
                                    <StarRating 
                                        label="Knowledge" 
                                        rating={knowledgeRating} 
                                        onChange={setKnowledgeRating} 
                                    />
                                </div>

                                {/* Tags Selection */}
                                <div className="space-y-3 sm:space-y-4 pt-4 border-t border-border/10">
                                    <Label className="text-sm font-bold text-foreground">Highlight Strengths</Label>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {availableTags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[13px] font-bold tracking-wide transition-all duration-300 ${
                                                    selectedTags.includes(tag)
                                                        ? 'bg-primary text-primary-foreground shadow-[0_8px_20px_-6px_rgba(255,85,0,0.4)] scale-[1.02]'
                                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/40 hover:border-border/80'
                                                }`}
                                            >
                                                {selectedTags.includes(tag) && <CheckCircle className="inline-block w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 -mt-0.5" />}
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div className="space-y-3 pt-2">
                                    <Label htmlFor="comment" className="text-sm font-bold text-foreground">Your Review <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                    <Textarea
                                        id="comment"
                                        placeholder="Share details about your learning experience..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                        className="resize-none rounded-2xl bg-muted/20 border-border/20 focus-visible:ring-primary/20 p-4 text-[15px] leading-relaxed"
                                    />
                                    <p className="text-xs text-muted-foreground font-medium text-right">{comment.length}/500</p>
                                </div>
                                
                                <DialogFooter className="pt-4 pb-2 sm:justify-between items-center border-t border-border/10 mt-6 gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                        disabled={isSubmitting}
                                        className="rounded-full font-bold px-6 text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !rating}
                                        className="rounded-full h-12 px-8 font-bold text-[15px] tracking-wide bg-primary hover:bg-primary/95 text-white shadow-[0_10px_25px_-5px_rgba(255,85,0,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                {existingReview ? 'Updating...' : 'Submitting...'}
                                            </>
                                        ) : (
                                            existingReview ? 'Update Review' : 'Submit Review'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
