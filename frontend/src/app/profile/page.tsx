import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data
const user = {
  id: 1,
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@example.com",
  school: "SMA Negeri 1 Jakarta",
  grade: "11",
  major: "IPA",
  bio: "High school student passionate about mathematics and programming. I love helping others understand complex concepts in a simple way.",
  avatar: "https://i.pravatar.cc/150?img=12",
  creditBalance: 3.0,
  joinedDate: "2025-10-15",
  teachingSkills: [
    {
      id: 1,
      name: "Mathematics - Calculus",
      category: "Academic",
      level: "Advanced",
      description: "Differential and integral calculus, limits, derivatives, and applications.",
      experience: 2,
      rating: 4.8,
      sessions: 15,
      available: true,
    },
    {
      id: 2,
      name: "Programming - Python",
      category: "Technical",
      level: "Intermediate",
      description: "Python basics, data structures, algorithms, and simple applications.",
      experience: 1,
      rating: 4.6,
      sessions: 8,
      available: true,
    }
  ],
  learningSkills: [
    {
      id: 1,
      name: "Web Development",
      category: "Technical",
      desiredLevel: "Intermediate",
      notes: "Want to learn React and Next.js for building web applications.",
    },
    {
      id: 2,
      name: "English Conversation",
      category: "Language",
      desiredLevel: "Advanced",
      notes: "Improve speaking fluency and pronunciation.",
    }
  ],
  badges: [
    {
      id: 1,
      name: "Early Bird",
      description: "Completed first session",
      icon: "🐣",
    },
    {
      id: 2,
      name: "Quick Learner",
      description: "Completed 5 learning sessions",
      icon: "📚",
    }
  ],
  reviews: [
    {
      id: 1,
      reviewer: "Sarah Johnson",
      rating: 5,
      comment: "John is an excellent math tutor! He explained calculus concepts clearly and patiently.",
      date: "2025-11-20",
    },
    {
      id: 2,
      reviewer: "Michael Chen",
      rating: 4,
      comment: "Very helpful with Python programming. Helped me understand object-oriented concepts.",
      date: "2025-11-15",
    },
    {
      id: 3,
      reviewer: "Emily Wilson",
      rating: 5,
      comment: "Patient and knowledgeable. Made calculus much easier to understand!",
      date: "2025-11-05",
    }
  ]
};

export default function ProfilePage() {
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
            <Link href="/marketplace" className="text-sm font-medium hover:underline underline-offset-4">Marketplace</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">Dashboard</Link>
            <Link href="/profile" className="text-sm font-medium text-primary hover:underline underline-offset-4">Profile</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="sr-only">Notifications</span>
            </Button>
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">3.0 Credits</span>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="flex flex-col space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-grow space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username} • Joined {new Date(user.joinedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      <path d="m15 5 3 3" />
                    </svg>
                    Edit Profile
                  </Button>
                  <Button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M12 18v-6" />
                      <path d="M9 15h6" />
                    </svg>
                    Add Skill
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                    <path d="M13 13h4" />
                    <path d="M13 17h4" />
                    <path d="M9 13h.01" />
                    <path d="M9 17h.01" />
                  </svg>
                  <span>{user.school}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  <span>Grade {user.grade} • {user.major}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{user.creditBalance} Credits</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-yellow-400">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>4.7 Rating</span>
                </div>
              </div>
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="teaching" className="w-full">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-2">
              <TabsTrigger value="teaching">Teaching Skills</TabsTrigger>
              <TabsTrigger value="learning">Learning Wishlist</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            {/* Teaching Skills Tab */}
            <TabsContent value="teaching" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.teachingSkills.map((skill) => (
                  <Card key={skill.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{skill.name}</CardTitle>
                          <CardDescription>{skill.level} Level</CardDescription>
                        </div>
                        <Badge>{skill.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{skill.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1 text-yellow-400">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          <span>{skill.rating} ({skill.sessions} sessions)</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                          </svg>
                          <span>{skill.experience} year{skill.experience !== 1 ? "s" : ""} experience</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full ${skill.available ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                        <span className="text-sm">{skill.available ? 'Available' : 'Unavailable'}</span>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </CardFooter>
                  </Card>
                ))}
                <Card className="border-dashed flex flex-col items-center justify-center p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Add New Skill</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">Share your knowledge and earn time credits</p>
                  <Button variant="outline">Add Skill</Button>
                </Card>
              </div>
            </TabsContent>

            {/* Learning Wishlist Tab */}
            <TabsContent value="learning" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.learningSkills.map((skill) => (
                  <Card key={skill.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{skill.name}</CardTitle>
                          <CardDescription>Desired Level: {skill.desiredLevel}</CardDescription>
                        </div>
                        <Badge variant="outline">{skill.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{skill.notes}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button size="sm">Find Tutors</Button>
                    </CardFooter>
                  </Card>
                ))}
                <Card className="border-dashed flex flex-col items-center justify-center p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Add Learning Goal</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">What skills would you like to learn?</p>
                  <Button variant="outline">Add Skill</Button>
                </Card>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {user.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <CardDescription>From {review.reviewer}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {user.badges.map((badge) => (
                  <Card key={badge.id} className="flex flex-col items-center p-6">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-medium text-center">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                  </Card>
                ))}
                <Card className="border-dashed flex flex-col items-center justify-center p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                      <path d="M6 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8h-8" />
                      <polyline points="15 14 18 10 21 14" />
                      <path d="M6 14H3" />
                      <path d="M6 18H3" />
                      <path d="M6 22H3" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">More Badges</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">Keep teaching and learning to earn more badges!</p>
                  <Button variant="outline">View All Badges</Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
