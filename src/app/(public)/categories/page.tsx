import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, PenTool, MessageSquare, Sigma, Briefcase } from "lucide-react";

const CATEGORIES = [
    {
        title: "Web Development",
        desc: "HTML, CSS, React, Next.js, API basics — project-based learning.",
        icon: Code2,
        tags: ["Beginner", "Project-based", "Career-ready"],
    },
    {
        title: "UI/UX Design",
        desc: "Figma, design systems, UX flows, portfolio feedback.",
        icon: PenTool,
        tags: ["Portfolio", "Wireframes", "Real feedback"],
    },
    {
        title: "English Speaking",
        desc: "Confidence, fluency, pronunciation, interview prep.",
        icon: MessageSquare,
        tags: ["Daily practice", "IELTS", "Interview prep"],
    },
    {
        title: "Math & Science",
        desc: "From core concepts to advanced topics with clear explanations.",
        icon: Sigma,
        tags: ["Concepts", "Exam prep", "Step-by-step"],
    },
    {
        title: "Programming Basics",
        desc: "Python, logic, problem solving, assignments support.",
        icon: Code2,
        tags: ["Beginner-friendly", "Guided", "Assignments"],
    },
    {
        title: "Career Coaching",
        desc: "CV, interviews, roadmap planning, and mentorship.",
        icon: Briefcase,
        tags: ["Mock interviews", "Mentorship", "Roadmap"],
    },
];

export default function CategoriesPage() {
    return (
        <MarketingPageShell
            eyebrow="Browse by category"
            title="Categories"
            subtitle="Discover learning paths by topic — designed to be simple, static, and easy to explore in both light and dark mode."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Categories" },
            ]}
            rightAction={
                <Button asChild className="rounded-xl">
                    <Link href="/tutors">
                        Browse tutors <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            }
        >
            <div className="grid gap-4 md:grid-cols-2">
                {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    return (
                        <Card
                            key={c.title}
                            className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-base font-semibold">{c.title}</h3>
                                        <Button asChild variant="outline" size="sm" className="rounded-xl">
                                            <Link href="/tutors">Explore</Link>
                                        </Button>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {c.tags.map((t) => (
                                            <Badge
                                                key={t}
                                                variant="secondary"
                                                className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                                            >
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <h2 className="text-lg font-semibold">Suggested next step</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Pick a category, then use search to filter by skill, budget, and availability.
                    You’ll see verified tutors and clear booking options.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild className="rounded-xl">
                        <Link href="/tutors">Search tutors</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/how-it-works">How it works</Link>
                    </Button>
                </div>
            </Card>
        </MarketingPageShell>
    );
}