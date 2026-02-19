// Skill Categories
export const SKILL_CATEGORIES = [
    { value: 'all', label: 'All Skills' },
    { value: 'academic', label: 'Academic' },
    { value: 'technical', label: 'Technical' },
    { value: 'creative', label: 'Creative' },
    { value: 'language', label: 'Language' },
    { value: 'sports', label: 'Sports' },
] as const;

// Days of Week
export const DAYS_OF_WEEK = [
    { value: 'all', label: 'Any Day' },
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
] as const;

// Rating Filters
export const RATING_FILTERS = [
    { value: 'all', label: 'Any Rating' },
    { value: '4', label: '4.0+ Stars' },
    { value: '3', label: '3.0+ Stars' },
] as const;

// Sort Options
export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
] as const;

// Session Status
export const SESSION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
    EARNED: 'earned',
    SPENT: 'spent',
    INITIAL: 'initial',
    BONUS: 'bonus',
    HOLD: 'hold',
    REFUND: 'refund',
} as const;

// Credit Constants
export const CREDITS = {
    INITIAL_BONUS: 3.0,
    MIN_BALANCE: 0,
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'wibi_auth_token',
    USER_DATA: 'wibi_user_data',
    REMEMBERED_EMAIL: 'wibi_remembered_email',
    REGISTRATION_EMAIL: 'registrationEmail',
} as const;

// API Endpoints Base
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    MARKETPLACE: '/marketplace',
    PROFILE: '/profile',
    ABOUT: '/about',
    HOW_IT_WORKS: '/how-it-works',
} as const;
