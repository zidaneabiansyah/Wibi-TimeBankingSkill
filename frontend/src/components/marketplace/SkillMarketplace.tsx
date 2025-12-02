'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Search,
    Filter,
    Star,
    Users,
    Clock,
    Globe,
    Home,
    Zap,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal
} from 'lucide-react'
import { useSkillStore } from '@/store/useSkillStore'
import type { SkillCategory, Skill } from '@/types'

const categories: { value: SkillCategory; label: string; icon: string }[] = [
    { value: 'academic', label: 'Academic', icon: '📚' },
    { value: 'technical', label: 'Technical', icon: '💻' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'language', label: 'Language', icon: '🌍' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'other', label: 'Other', icon: '📋' },
]

export default function SkillMarketplace() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all')
    const [showFilters, setShowFilters] = useState(false)
    
    const {
        skills,
        skillsLoading,
        skillsError,
        skillsTotal,
        skillsPage,
        skillsLimit,
        fetchSkills,
        setFilters
    } = useSkillStore()

    // Load initial skills
    useEffect(() => {
        fetchSkills()
    }, [fetchSkills])

    // Handle search dengan debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFilters({
                search: searchQuery || undefined,
                category: selectedCategory === 'all' ? undefined : selectedCategory
            })
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery, selectedCategory, setFilters])

    const handlePageChange = (page: number) => {
        fetchSkills({ page })
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const totalPages = Math.ceil(skillsTotal / skillsLimit)

    const SkillCard = ({ skill }: { skill: Skill }) => (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="text-3xl">{skill.icon}</div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {skill.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                            {categories.find(c => c.value === skill.category)?.icon} {skill.category}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {skill.description || "Skill description coming soon..."}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{skill.total_teachers} teachers</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        <span>{skill.total_learners} learners</span>
                    </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                    Explore Teachers
                </Button>
            </CardContent>
        </Card>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Skill Marketplace</h1>
                <p className="text-xl text-muted-foreground">
                    Discover amazing skills and connect with passionate teachers
                </p>
            </div>

            {/* Search & Filter Bar */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search skills, topics, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select 
                            value={selectedCategory} 
                            onValueChange={(value) => setSelectedCategory(value as SkillCategory | 'all')}
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                        <div className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            <span>{category.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Toggle Filters Button */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>

                    {/* Advanced Filters (Collapsible) */}
                    {showFilters && (
                        <div className="border-t mt-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Skill Level
                                    </label>
                                    <Select defaultValue="all">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Levels</SelectItem>
                                            <SelectItem value="beginner">🌱 Beginner</SelectItem>
                                            <SelectItem value="intermediate">📈 Intermediate</SelectItem>
                                            <SelectItem value="advanced">🚀 Advanced</SelectItem>
                                            <SelectItem value="expert">👑 Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Teaching Mode
                                    </label>
                                    <Select defaultValue="all">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Modes</SelectItem>
                                            <SelectItem value="online">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4" />
                                                    Online Only
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="offline">
                                                <div className="flex items-center gap-2">
                                                    <Home className="w-4 h-4" />
                                                    Offline Only
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Sort By
                                    </label>
                                    <Select defaultValue="popular">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular">Most Popular</SelectItem>
                                            <SelectItem value="newest">Newest</SelectItem>
                                            <SelectItem value="rating">Highest Rated</SelectItem>
                                            <SelectItem value="price">Price (Low to High)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Category Tabs */}
            <div className="mb-8">
                <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as SkillCategory | 'all')}>
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        {categories.map((category) => (
                            <TabsTrigger key={category.value} value={category.value} className="text-xs">
                                <span className="hidden md:inline">{category.icon}</span>
                                <span className="md:ml-1">{category.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-muted-foreground">
                    {skillsLoading ? (
                        "Loading skills..."
                    ) : (
                        `Showing ${skills.length} of ${skillsTotal} skills`
                    )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Page {skillsPage} of {totalPages}</span>
                </div>
            </div>

            {/* Skills Grid */}
            {skillsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-muted rounded mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-20"></div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted rounded"></div>
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : skillsError ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">{skillsError}</p>
                        <Button onClick={() => fetchSkills()}>Try Again</Button>
                    </CardContent>
                </Card>
            ) : skills.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No Skills Found</h3>
                        <p className="text-muted-foreground mb-4">
                            Try adjusting your search terms or filters
                        </p>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedCategory('all')
                            }}
                        >
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {skills.map((skill) => (
                            <SkillCard key={skill.id} skill={skill} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={skillsPage <= 1}
                                onClick={() => handlePageChange(skillsPage - 1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>
                            
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1;
                                    } else if (skillsPage <= 3) {
                                        pageNumber = i + 1;
                                    } else if (skillsPage >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i;
                                    } else {
                                        pageNumber = skillsPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={skillsPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={skillsPage >= totalPages}
                                onClick={() => handlePageChange(skillsPage + 1)}
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
