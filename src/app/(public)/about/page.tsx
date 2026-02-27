import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Sparkles, ShieldCheck } from "lucide-react";

const VALUES = [
    {
        title: "Goal-matched learning",
        desc: "Find tutors aligned with your level, pace, and learning objective — not random browsing.",
        icon: Target,
    },
    {
        title: "Verified tutors",
        desc: "Profiles are reviewed to keep quality high and reduce uncertainty for learners.",
        icon: ShieldCheck,
    },
    {
        title: "Progress-driven",
        desc: "Simple milestones and notes help you stay consistent week to week.",
        icon: Sparkles,
    },
    {
        title: "Built for real people",
        desc: "Clear UI, calm layout, and fast booking designed for busy learners and parents.",
        icon: Users,
    },
];

export default function AboutPage() {
    return (
        <MarketingPageShell
            eyebrow="Trusted learning platform"
            title="About SkillBridge"
            subtitle="SkillBridge connects learners with expert tutors and a structured booking experience — built to keep learning simple, calm, and measurable."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "About" },
            ]}
        >
            <div className="grid gap-4 md:grid-cols-2">
                {VALUES.map((v) => {
                    const Icon = v.icon;
                    return (
                        <Card
                            key={v.title}
                            className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold">{v.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <Badge
                    variant="secondary"
                    className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                >
                    Our promise
                </Badge>
                <h2 className="mt-3 text-lg font-semibold">Clear booking. Real progress. Less stress.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    We focus on a clean experience: discover tutors quickly, book without confusion, and track learning in a simple way.
                    Everything is designed to look professional in both light and dark mode — like your landing page.
                </p>
            </Card>
        </MarketingPageShell>
    );
}