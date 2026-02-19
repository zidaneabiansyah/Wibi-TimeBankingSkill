import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const skills = [
    {
        emoji: "📐",
        title: "Mathematics",
        description: "Algebra, Calculus, Statistics",
        category: "Academic",
        tutors: "25+"
    },
    {
        emoji: "💻",
        title: "Programming",
        description: "Web Dev, Python, Mobile Apps",
        category: "Technical",
        tutors: "18+"
    },
    {
        emoji: "🌐",
        title: "Languages",
        description: "English, Japanese, Korean",
        category: "Language",
        tutors: "30+"
    },
];

export function FeaturedSkillsSection() {
    return (
        <section className="relative w-full py-16 md:py-24 lg:py-28 border-t border-border/40">
            <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <Badge className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary border-secondary/20">
                        Popular Skills
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Explore What's Popular
                    </h2>
                    <p className="max-w-175 text-muted-foreground text-lg">
                        Browse the most sought-after skills taught by our community members.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {skills.map((skill, idx) => (
                        <Card key={idx} className="relative h-full flex flex-col group overflow-hidden hover:border-primary transition-all duration-300">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="text-3xl">{skill.emoji}</div>
                                    <Badge variant="outline" className="text-xs">{skill.tutors} Tutors</Badge>
                                </div>
                                <CardTitle className="text-lg">{skill.title}</CardTitle>
                                <CardDescription className="text-sm">{skill.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4 flex-1">
                                <Badge className="bg-primary/10 text-primary border-primary/20">{skill.category}</Badge>
                            </CardContent>
                            <CardFooter>
                                <Link href="/marketplace" className="w-full">
                                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                                        Explore <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardFooter>

                            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
