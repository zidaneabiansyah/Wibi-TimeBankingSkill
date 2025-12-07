import { create } from 'zustand';
import type {
    ForumCategory,
    ForumThread,
    ForumReply,
    SuccessStory,
    StoryComment,
    Endorsement,
} from '@/types';

interface CommunityStore {
    // Forum state
    categories: ForumCategory[];
    threads: ForumThread[];
    replies: ForumReply[];
    selectedCategory: ForumCategory | null;
    selectedThread: ForumThread | null;

    // Stories state
    stories: SuccessStory[];
    selectedStory: SuccessStory | null;
    storyComments: StoryComment[];

    // Endorsements state
    endorsements: Endorsement[];
    selectedEndorsement: Endorsement | null;

    // Loading states
    loading: boolean;
    error: string | null;

    // Pagination
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;

    // Forum actions
    setCategories: (categories: ForumCategory[]) => void;
    setThreads: (threads: ForumThread[]) => void;
    setReplies: (replies: ForumReply[]) => void;
    setSelectedCategory: (category: ForumCategory | null) => void;
    setSelectedThread: (thread: ForumThread | null) => void;
    addThread: (thread: ForumThread) => void;
    updateThread: (thread: ForumThread) => void;
    deleteThread: (threadId: number) => void;
    addReply: (reply: ForumReply) => void;
    deleteReply: (replyId: number) => void;

    // Story actions
    setStories: (stories: SuccessStory[]) => void;
    setSelectedStory: (story: SuccessStory | null) => void;
    setStoryComments: (comments: StoryComment[]) => void;
    addStory: (story: SuccessStory) => void;
    updateStory: (story: SuccessStory) => void;
    deleteStory: (storyId: number) => void;
    addStoryComment: (comment: StoryComment) => void;
    deleteStoryComment: (commentId: number) => void;
    likeStory: (storyId: number) => void;
    unlikeStory: (storyId: number) => void;

    // Endorsement actions
    setEndorsements: (endorsements: Endorsement[]) => void;
    setSelectedEndorsement: (endorsement: Endorsement | null) => void;
    addEndorsement: (endorsement: Endorsement) => void;
    deleteEndorsement: (endorsementId: number) => void;

    // Pagination actions
    setCurrentPage: (page: number) => void;
    setTotalItems: (total: number) => void;

    // Loading actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Reset
    reset: () => void;
}

export const useCommunityStore = create<CommunityStore>((set) => ({
    // Initial state
    categories: [],
    threads: [],
    replies: [],
    selectedCategory: null,
    selectedThread: null,
    stories: [],
    selectedStory: null,
    storyComments: [],
    endorsements: [],
    selectedEndorsement: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,

    // Forum actions
    setCategories: (categories) => set({ categories }),
    setThreads: (threads) => set({ threads }),
    setReplies: (replies) => set({ replies }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setSelectedThread: (thread) => set({ selectedThread: thread }),
    addThread: (thread) =>
        set((state) => ({ threads: [thread, ...state.threads] })),
    updateThread: (thread) =>
        set((state) => ({
            threads: state.threads.map((t) => (t.id === thread.id ? thread : t)),
            selectedThread: state.selectedThread?.id === thread.id ? thread : state.selectedThread,
        })),
    deleteThread: (threadId) =>
        set((state) => ({
            threads: state.threads.filter((t) => t.id !== threadId),
            selectedThread: state.selectedThread?.id === threadId ? null : state.selectedThread,
        })),
    addReply: (reply) =>
        set((state) => ({ replies: [reply, ...state.replies] })),
    deleteReply: (replyId) =>
        set((state) => ({
            replies: state.replies.filter((r) => r.id !== replyId),
        })),

    // Story actions
    setStories: (stories) => set({ stories }),
    setSelectedStory: (story) => set({ selectedStory: story }),
    setStoryComments: (comments) => set({ storyComments: comments }),
    addStory: (story) =>
        set((state) => ({ stories: [story, ...state.stories] })),
    updateStory: (story) =>
        set((state) => ({
            stories: state.stories.map((s) => (s.id === story.id ? story : s)),
            selectedStory: state.selectedStory?.id === story.id ? story : state.selectedStory,
        })),
    deleteStory: (storyId) =>
        set((state) => ({
            stories: state.stories.filter((s) => s.id !== storyId),
            selectedStory: state.selectedStory?.id === storyId ? null : state.selectedStory,
        })),
    addStoryComment: (comment) =>
        set((state) => ({ storyComments: [comment, ...state.storyComments] })),
    deleteStoryComment: (commentId) =>
        set((state) => ({
            storyComments: state.storyComments.filter((c) => c.id !== commentId),
        })),
    likeStory: (storyId) =>
        set((state) => ({
            stories: state.stories.map((s) =>
                s.id === storyId ? { ...s, like_count: s.like_count + 1 } : s
            ),
            selectedStory:
                state.selectedStory?.id === storyId
                    ? { ...state.selectedStory, like_count: state.selectedStory.like_count + 1 }
                    : state.selectedStory,
        })),
    unlikeStory: (storyId) =>
        set((state) => ({
            stories: state.stories.map((s) =>
                s.id === storyId ? { ...s, like_count: Math.max(0, s.like_count - 1) } : s
            ),
            selectedStory:
                state.selectedStory?.id === storyId
                    ? { ...state.selectedStory, like_count: Math.max(0, state.selectedStory.like_count - 1) }
                    : state.selectedStory,
        })),

    // Endorsement actions
    setEndorsements: (endorsements) => set({ endorsements }),
    setSelectedEndorsement: (endorsement) => set({ selectedEndorsement: endorsement }),
    addEndorsement: (endorsement) =>
        set((state) => ({ endorsements: [endorsement, ...state.endorsements] })),
    deleteEndorsement: (endorsementId) =>
        set((state) => ({
            endorsements: state.endorsements.filter((e) => e.id !== endorsementId),
            selectedEndorsement:
                state.selectedEndorsement?.id === endorsementId ? null : state.selectedEndorsement,
        })),

    // Pagination actions
    setCurrentPage: (page) => set({ currentPage: page }),
    setTotalItems: (total) => set({ totalItems: total }),

    // Loading actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Reset
    reset: () =>
        set({
            categories: [],
            threads: [],
            replies: [],
            selectedCategory: null,
            selectedThread: null,
            stories: [],
            selectedStory: null,
            storyComments: [],
            endorsements: [],
            selectedEndorsement: null,
            loading: false,
            error: null,
            currentPage: 1,
            totalItems: 0,
        }),
}));
