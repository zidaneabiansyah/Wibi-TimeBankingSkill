'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/layout";
import { useSkillStore } from "@/stores/skill.store";
import type { Skill } from "@/types";

const categories = [
    { value: 'all', label: 'All Skills' },
    { value: 'academic', label: 'Academic' },
    { value: 'technical', label: 'Technical' },
    { value: 'creative', label: 'Creative' },
    { value: 'language', label: 'Language' },
    { value: 'sports', label: 'Sports' },
];

const days = [
    { value: 'all', label: 'Any Day' },
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
];

const ratings = [
    { value: 'all', label: 'Any Rating' },
    { value: '4', label: '4.0+ Stars' },
    { value: '3', label: '3.0+ Stars' },
];

const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
];

export default function MarketplacePage() {
    const { 
        skills, skillsTotal, recommendations, isLoading, 
        currentPage, pageSize, 
        fetchSkills, fetchRecommendations, setCurrentPage 
    } = useSkillStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDay, setSelectedDay] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [locationQuery, setLocationQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [debouncedLocation, setDebouncedLocation] = useState('');

    // Debounce search and location
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLocation(locationQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [locationQuery]);

    // Fetch skills when filters or page changes
    useEffect(() => {
        fetchSkills({
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            search: debouncedSearch || undefined,
            day: selectedDay === 'all' ? undefined : Number(selectedDay),
            rating: selectedRating === 'all' ? undefined : Number(selectedRating),
            location: debouncedLocation || undefined,
            sort: sortBy,
        }).catch(console.error);
    }, [fetchSkills, selectedCategory, debouncedSearch, selectedDay, selectedRating, debouncedLocation, sortBy, currentPage, pageSize]);

    // Fetch recommendations on mount
    useEffect(() => {
        fetchRecommendations(3);
    }, [fetchRecommendations]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page on filter change
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col space-y-8">
                    {/* Page Title */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Skill Marketplace</h1>
                            <p className="text-muted-foreground text-lg">Discover skills to learn or find students to teach</p>
                        </div>
                        <Link href="/dashboard/skills">
                            <Button className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M5 12h14" />
                                    <path d="M12 5v14" />
                                </svg>
                                Offer a Skill
                            </Button>
                        </Link>
                    </div>

                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </span>
                                Recommended for You
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {recommendations.map((skill) => (
                                    <Card key={`rec-${skill.id}`} className="group relative overflow-hidden bg-linear-to-br from-primary/5 to-transparent border-primary/10 hover:border-primary/30 transition-all duration-300">
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none text-[10px] uppercase font-bold tracking-wider">Top Rated</Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-background/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                                                    {skill.icon || '🎓'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold truncate">{skill.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center text-xs text-muted-foreground">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500 mr-1">
                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                            </svg>
                                                            {(skill as any).max_teacher_rating?.toFixed(1) || '5.0'}
                                                        </div>
                                                        <span className="text-muted-foreground/30 text-[10px]">•</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{skill.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href={`/marketplace/${skill.id}`} className="absolute inset-0 z-0" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search and Filter Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <Input 
                                placeholder="Search skills..." 
                                className="w-full pl-10 bg-muted/50 border-border/50 focus:bg-background" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <Input 
                                placeholder="City or region..." 
                                className="w-full pl-9 bg-muted/50 border-border/50 focus:bg-background" 
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="bg-muted/50 border-border/50">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Filter Row 2 */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="w-full md:w-48">
                            <Select value={selectedDay} onValueChange={setSelectedDay}>
                                <SelectTrigger className="bg-muted/50 border-border/50">
                                    <SelectValue placeholder="Available on" />
                                </SelectTrigger>
                                <SelectContent>
                                    {days.map((day) => (
                                        <SelectItem key={day.value} value={day.value}>
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={selectedRating} onValueChange={setSelectedRating}>
                                <SelectTrigger className="bg-muted/50 border-border/50">
                                    <SelectValue placeholder="Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ratings.map((rating) => (
                                        <SelectItem key={rating.value} value={rating.value}>
                                            {rating.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="ml-auto text-sm text-muted-foreground flex items-center bg-muted/50 px-4 py-2 rounded-lg whitespace-nowrap">
                            <span className="font-medium text-foreground">{skillsTotal}</span>&nbsp;skills found
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
                        <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex md:flex-row gap-2">
                            {categories.map((cat) => (
                                <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
                            ))}
                        </TabsList>
                        
                        <div className="mt-6">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-2 text-muted-foreground">Loading skills...</p>
                                </div>
                            ) : skills.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                    <p className="text-lg font-medium">No skills found</p>
                                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {skills.map((skill: Skill) => (
                                        <Card key={skill.id} className="group overflow-hidden bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
                                            <div className="aspect-video w-full overflow-hidden bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                                                {skill.icon ? (
                                                    <span className="text-5xl group-hover:scale-110 transition-transform">{skill.icon}</span>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40 group-hover:text-primary/60 transition-colors">
                                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                                    </svg>
                                                )}
                                            </div>
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="space-y-1">
                                                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                                                        <CardDescription className="line-clamp-2">{skill.description || 'No description'}</CardDescription>
                                                    </div>
                                                    <Badge variant="outline" className="capitalize shrink-0 border-border/50">{skill.category}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                            <circle cx="12" cy="7" r="4" />
                                                        </svg>
                                                        <span>{skill.total_teachers || 0} teachers</span>
                                                    </div>
                                                    <span className="text-border">•</span>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <span>{skill.total_learners || 0} learners</span>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="flex items-center text-primary">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span className="font-semibold text-sm">
                                                            {skill.min_rate === skill.max_rate 
                                                                ? `${skill.min_rate || 0} Credit/hour` 
                                                                : `${skill.min_rate || 0} - ${skill.max_rate || 0} Credits/hour`}
                                                        </span>
                                                    </div>
                                                    {skill.max_rate >= 1.5 && (
                                                        <Badge variant="secondary" className="text-[8px] h-3.5 px-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-none font-bold uppercase tracking-tighter">
                                                            Advanced
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <Link href={`/marketplace/${skill.id}`} className="w-full">
                                                    <Button className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                                                        View Tutors
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {skillsTotal > pageSize && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1 || isLoading}
                                        className="border-border/50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                            <path d="m15 18-6-6 6-6" />
                                        </svg>
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.ceil(skillsTotal / pageSize) }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                                disabled={isLoading}
                                                className={`h-8 w-8 p-0 ${currentPage === page ? "" : "border-border/50"}`}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setCurrentPage(Math.min(Math.ceil(skillsTotal / pageSize), currentPage + 1))}
                                        disabled={currentPage >= Math.ceil(skillsTotal / pageSize) || isLoading}
                                        className="border-border/50"
                                    >
                                        Next
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}