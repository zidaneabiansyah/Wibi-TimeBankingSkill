import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} {...props} />
);

export default function ProfileLoading() {
    return (
        <main className="container mx-auto px-4 py-8 mb-20 max-w-7xl">
            <div className="flex flex-col space-y-6">
                
                {/* Hero / Cover Section */}
                <div className="relative mb-8 md:mb-12">
                    <Skeleton className="rounded-[2rem] h-48 md:h-64 relative w-full" />
                    
                    {/* User Avatar & Actions overlapping the cover */}
                    <div className="absolute -bottom-14 left-8 md:left-12 flex items-end justify-between gap-6 z-10 w-[calc(100%-4rem)] md:w-[calc(100%-6rem)]">
                        <Skeleton className="h-28 w-28 md:h-36 md:w-36 border-4 border-background shadow-xl rounded-2xl md:rounded-3xl shrink-0" />
                        <div className="flex gap-3 shrink-0">
                            <Skeleton className="h-10 w-32 rounded-xl hidden md:block" />
                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Name and Bio directly below Avatar */}
                <div className="px-8 md:px-12 mt-8 md:mt-12 mb-8 space-y-3">
                     <Skeleton className="h-10 w-64" />
                     <Skeleton className="h-6 w-32" />
                     <div className="space-y-2 mt-4">
                         <Skeleton className="h-4 w-full max-w-2xl" />
                         <Skeleton className="h-4 w-full max-w-xl" />
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-8">
                    
                    {/* Left Sidebar (Col span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Contact Info */}
                        <Card className="border-border/20 bg-card/20 backdrop-blur-xl shadow-none rounded-[2rem]">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-4 w-20" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
                                        <Skeleton className="h-4 w-10/12" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Badges Layout */}
                        <Card className="border-border/20 bg-card/20 backdrop-blur-xl shadow-none rounded-[2rem]">
                            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-24 rounded-full" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Quick Links */}
                        <Card className="border-border/20 bg-card/20 backdrop-blur-xl shadow-none rounded-[2rem]">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3">
                                        <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Main Content (Col span 8) */}
                    <div className="lg:col-span-8 flex flex-col gap-8 md:gap-10">
                        
                        {/* Unified Stats Overview Panel */}
                        <Card className="relative overflow-hidden border-border/20 bg-card/20 backdrop-blur-2xl shadow-none rounded-[2rem] p-1">
                            <div className="grid grid-cols-2 lg:grid-cols-4 relative z-10 w-full divide-x divide-y lg:divide-y-0 divide-border/10">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                                        <Skeleton className="h-6 w-6 md:h-8 md:w-8 mb-3" />
                                        <Skeleton className="h-8 w-12 mb-2" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* My Skills Grid */}
                        <div className="mt-2">
                            <div className="flex justify-between items-end mb-6 px-1">
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                                <Skeleton className="h-8 w-20 rounded-xl hidden sm:block" />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <Card key={i} className="relative overflow-hidden border-border/20 bg-card/20 backdrop-blur-xl rounded-[2rem] shadow-none">
                                        <CardContent className="p-6 flex flex-col h-full h-40">
                                            <div className="flex items-start justify-between gap-3 mb-6">
                                                <Skeleton className="h-6 w-32" />
                                                <Skeleton className="h-6 w-12 rounded-xl shrink-0" />
                                            </div>
                                            <div className="mt-auto flex items-center justify-between">
                                                <Skeleton className="h-6 w-20 rounded-xl" />
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-4 w-10" />
                                                    <Skeleton className="h-4 w-10" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
