import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for skills
const skills = [
    {
        id: 1,
        title: "Mathematics - Calculus",
        category: "Academic",
        description: "Learn differential and integral calculus",
        tutor: "Sarah Johnson",
        rating: 4.8,
        sessions: 42,
        hourlyRate: 1,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    },
    {
        id: 2,
        title: "Web Development",
        category: "Technical",
        description: "HTML, CSS, JavaScript fundamentals",
        tutor: "Michael Chen",
        rating: 4.9,
        sessions: 38,
        hourlyRate: 1,
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    },
    {
        id: 3,
        title: "English Conversation",
        category: "Language",
        description: "Practice English speaking and listening",
        tutor: "Emily Wilson",
        rating: 4.7,
        sessions: 56,
        hourlyRate: 1,
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    },
    {
        id: 4,
        title: "Guitar Lessons",
        category: "Creative",
        description: "Learn guitar basics and popular songs",
        tutor: "David Martinez",
        rating: 4.6,
        sessions: 29,
        hourlyRate: 1,
        image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0",
    },
    {
        id: 5,
        title: "Physics",
        category: "Academic",
        description: "Mechanics, thermodynamics, and more",
        tutor: "Alex Turner",
        rating: 4.9,
        sessions: 31,
        hourlyRate: 1,
        image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
    },
    {
        id: 6,
        title: "Digital Art",
        category: "Creative",
        description: "Create digital illustrations and designs",
        tutor: "Sophia Lee",
        rating: 4.8,
        sessions: 24,
        hourlyRate: 1,
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
    }
];

export default function MarketplacePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Time Banking Logo" className="h-8 w-8 rounded-md" />
                            <span className="text-xl font-bold">Time Banking</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/marketplace" className="text-sm font-medium text-primary hover:underline underline-offset-4">Marketplace</Link>
                        <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">Dashboard</Link>
                        <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">Profile</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <circle cx="8" cy="21" r="1" />
                                <circle cx="19" cy="21" r="1" />
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                            <span className="sr-only">Cart</span>
                        </Button>
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">3.0 Credits</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-8">
                <div className="flex flex-col space-y-8">
                    {/* Page Title */}
                    <div>
                        <h1 className="text-3xl font-bold">Skill Marketplace</h1>
                        <p className="text-muted-foreground">Discover skills to learn or find students to teach</p>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input placeholder="Search skills, subjects, or tutors..." className="w-full" />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                                    <path d="M3 6h18" />
                                    <path d="M7 12h10" />
                                    <path d="M10 18h4" />
                                </svg>
                                Filter
                            </Button>
                            <Button variant="outline">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                                    <path d="m3 16 4 4 4-4" />
                                    <path d="M7 20V4" />
                                    <path d="M11 4h10" />
                                    <path d="M11 8h7" />
                                    <path d="M11 12h4" />
                                </svg>
                                Sort
                            </Button>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-2">
                            <TabsTrigger value="all">All Skills</TabsTrigger>
                            <TabsTrigger value="academic">Academic</TabsTrigger>
                            <TabsTrigger value="technical">Technical</TabsTrigger>
                            <TabsTrigger value="creative">Creative</TabsTrigger>
                            <TabsTrigger value="language">Language</TabsTrigger>
                            <TabsTrigger value="sports">Sports</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {skills.map((skill) => (
                                    <Card key={skill.id} className="overflow-hidden">
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img
                                                src={skill.image}
                                                alt={skill.title}
                                                className="h-full w-full object-cover transition-all hover:scale-105"
                                            />
                                        </div>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{skill.title}</CardTitle>
                                                    <CardDescription>{skill.description}</CardDescription>
                                                </div>
                                                <Badge>{skill.category}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">By {skill.tutor}</span>
                                                <span className="text-muted-foreground">•</span>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-400 mr-1">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                    <span>{skill.rating}</span>
                                                    <span className="text-muted-foreground ml-1">({skill.sessions} sessions)</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    <span className="font-medium">{skill.hourlyRate} Credit/hour</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full">Book Session</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="academic" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {skills.filter(skill => skill.category === "Academic").map((skill) => (
                                    <Card key={skill.id} className="overflow-hidden">
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img
                                                src={skill.image}
                                                alt={skill.title}
                                                className="h-full w-full object-cover transition-all hover:scale-105"
                                            />
                                        </div>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{skill.title}</CardTitle>
                                                    <CardDescription>{skill.description}</CardDescription>
                                                </div>
                                                <Badge>{skill.category}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium">By {skill.tutor}</span>
                                                <span className="text-muted-foreground">•</span>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-400 mr-1">
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                    </svg>
                                                    <span>{skill.rating}</span>
                                                    <span className="text-muted-foreground ml-1">({skill.sessions} sessions)</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    <span className="font-medium">{skill.hourlyRate} Credit/hour</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full">Book Session</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        {/* Other tabs would follow the same pattern */}
                    </Tabs>
                </div>
            </main>
        </div>
    );
}