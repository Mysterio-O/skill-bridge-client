import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CalendarDays, Route, ShieldCheck } from "lucide-react";

const STEPS = [
    {
        step: "Step 1",
        title: "Tell us what you’re learning",
        desc: "Search a topic, choose your level, and set your weekly goal. We’ll help you match your style.",
        icon: Route,
        chips: ["30-sec setup", "Clear goals", "Fast discovery"],
    },
    {
        step: "Step 2",
        title: "Book a time that works",
        desc: "Pick a slot, confirm, and you’re set. You’ll get reminders and a clear session plan in your dashboard.",
        icon: CalendarDays,
        chips: ["Instant booking", "Reminders", "Session plan"],
    },
    {
        step: "Step 3",
        title: "Learn, track, improve",
        desc: "After each session, keep notes and milestones. See progress over time — no guesswork.",
        icon: CheckCircle2,
        chips: ["Milestones", "Notes", "Progress tracking"],
    },
];

export default function HowItWorksPage() {
    return (
        <MarketingPageShell
            eyebrow="Simple, guided flow"
            title="How SkillBridge works"
            subtitle="A clear three-step experience: match → book → improve. Built to feel calm, clean, and structured like your landing page."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "How it works" },
            ]}
        >
            <div className="grid gap-4 lg:grid-cols-3">
                {STEPS.map((s) => {
                    const Icon = s.icon;
                    return (
                        <Card
                            key={s.step}
                            className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="flex items-center justify-between">
                                <Badge
                                    variant="secondary"
                                    className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                                >
                                    {s.step}
                                </Badge>
                                <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {s.chips.map((c) => (
                                    <Badge
                                        key={c}
                                        variant="secondary"
                                        className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                                    >
                                        {c}
                                    </Badge>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                        <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">What makes it feel safe and consistent</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Verified tutor profiles, clear booking flow, and progress tracking that keeps your learning structured.
                            The goal is to remove confusion and keep everything predictable.
                        </p>
                    </div>
                </div>
            </Card>
        </MarketingPageShell>
    );
}