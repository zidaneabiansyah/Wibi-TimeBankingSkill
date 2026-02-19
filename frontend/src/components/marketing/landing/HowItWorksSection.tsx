import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Zap, TrendingUp } from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const steps = [
    {
        step: "1",
        title: "List Your Skills",
        description: "Create your profile and showcase skills you can teach. Set your availability and teaching style.",
        icon: BookOpen,
        color: "from-primary/20 to-primary/5"
    },
    {
        step: "2",
        title: "Book Sessions",
        description: "Browse marketplace and book sessions with experienced tutors. Choose time that fits your schedule.",
        icon: Zap,
        color: "from-secondary/20 to-secondary/5"
    },
    {
        step: "3",
        title: "Earn & Learn",
        description: "Earn time credits by teaching. Spend them to learn from other skilled tutors in our community.",
        icon: TrendingUp,
        color: "from-accent/20 to-accent/5"
    },
];

export function HowItWorksSection() {
    return (
        <section className="relative w-full py-16 md:py-24 lg:py-28 border-t border-border/40">
            <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <Badge className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-primary/20">
                        How It Works
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Time Banking Made Simple
                    </h2>
                    <p className="max-w-175 text-muted-foreground text-lg">
                        1 hour teaching = 1 Time Credit = 1 hour learning. No money involved, pure skill exchange.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {steps.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <Card key={idx} className="relative h-full flex flex-col overflow-hidden group hover:border-primary transition-all duration-300">
                                <div className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <CardHeader className="relative pb-4 flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                                            <IconComponent className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold text-primary mb-1">Step {item.step}</div>
                                            <CardTitle className="text-lg">{item.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative pt-0">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardContent>

                                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
