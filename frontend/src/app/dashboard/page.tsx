import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for upcoming sessions
const upcomingSessions = [
    {
        id: 1,
        title: "Mathematics - Calculus",
        date: "2025-12-05T14:00:00",
        duration: 1,
        type: "teaching",
        student: "Alex Chen",
        status: "confirmed",
    },
    {
        id: 2,
        title: "Web Development",
        date: "2025-12-07T10:00:00",
        duration: 1.5,
        type: "learning",
        teacher: "Michael Wong",
        status: "pending",
    },
    {
        id: 3,
        title: "English Conversation",
        date: "2025-12-10T16:30:00",
        duration: 1,
        type: "teaching",
        student: "Sarah Johnson",
        status: "confirmed",
    },
];

// Mock data for transaction history
const transactions = [
    {
        id: 1,
        date: "2025-12-01T09:30:00",
        type: "earned",
        amount: 1,
        description: "Mathematics tutoring for Alex Chen",
        balance: 3.5,
    },
    {
        id: 2,
        date: "2025-11-28T14:00:00",
        type: "spent",
        amount: -1.5,
        description: "Web Development session with Michael Wong",
        balance: 2.5,
    },
    {
        id: 3,
        date: "2025-11-25T11:00:00",
        type: "earned",
        amount: 1,
        description: "Mathematics tutoring for Sarah Johnson",
        balance: 4,
    },
    {
        id: 4,
        date: "2025-11-20T16:30:00",
        type: "bonus",
        amount: 0.5,
        description: "Early Bird badge earned",
        balance: 3,
    },
];

// Format date
function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function DashboardPage() {
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
                        <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline underline-offset-4">Dashboard</Link>
                        <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">Profile</Link>
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
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, John!</h1>
                            <p className="text-muted-foreground">Here's what's happening with your Time Banking account</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/marketplace">
                                <Button variant="outline">Find Skills</Button>
                            </Link>
                            <Link href="/profile/skills/new">
                                <Button>Add New Skill</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Credit Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">3.0</div>
                                <p className="text-xs text-muted-foreground mt-1">+1.0 this month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Teaching Hours</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground mt-1">5 students taught</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Learning Hours</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">9</div>
                                <p className="text-xs text-muted-foreground mt-1">3 skills learned</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="text-3xl font-bold">4.8</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-400 ml-1">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">From 15 reviews</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Sessions */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                            <Link href="/dashboard/sessions">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingSessions.map((session) => (
                                <Card key={session.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{session.title}</CardTitle>
                                            <Badge variant={session.status === "confirmed" ? "default" : "outline"}>
                                                {session.status === "confirmed" ? "Confirmed" : "Pending"}
                                            </Badge>
                                        </div>
                                        <CardDescription>{formatDate(session.date)}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <span>{session.duration} hour{session.duration > 1 ? "s" : ""}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <span>
                                                    {session.type === "teaching"
                                                        ? <span>Teaching <strong>{session.student}</strong></span>
                                                        : <span>Learning from <strong>{session.teacher}</strong></span>}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" size="sm">Reschedule</Button>
                                        <Button size="sm">Join Session</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Transaction History</h2>
                            <Link href="/dashboard/transactions">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-4">Date</th>
                                                <th className="text-left p-4">Description</th>
                                                <th className="text-right p-4">Amount</th>
                                                <th className="text-right p-4">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction) => (
                                                <tr key={transaction.id} className="border-b last:border-0 hover:bg-muted/50">
                                                    <td className="p-4">{formatDate(transaction.date)}</td>
                                                    <td className="p-4">{transaction.description}</td>
                                                    <td className={`p-4 text-right ${transaction.type === 'spent' ? 'text-red-500' : 'text-green-500'}`}>
                                                        {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                                                    </td>
                                                    <td className="p-4 text-right font-medium">{transaction.balance}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Badges */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Your Badges</h2>
                            <Link href="/dashboard/badges">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                                        <path d="M6 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8h-8" />
                                        <polyline points="15 14 18 10 21 14" />
                                        <path d="M6 14H3" />
                                        <path d="M6 18H3" />
                                        <path d="M6 22H3" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium mt-2">Early Bird</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <path d="M16 13H8" />
                                        <path d="M16 17H8" />
                                        <path d="M10 9H8" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium mt-2">Quick Learner</span>
                            </div>
                            <div className="flex flex-col items-center opacity-40">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                        <path d="m15 5 3 3" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium mt-2">Top Tutor</span>
                                <span className="text-xs text-muted-foreground">In progress</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
