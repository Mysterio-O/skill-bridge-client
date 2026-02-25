import Link from "next/link";
import {
    BadgeCheck,
    BookOpen,
    CalendarCheck2,
    GraduationCap,
    LineChart,
    MessageSquareText,
    ShieldCheck,
    Sparkles,
    Timer,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Step = {
    title: string;
    description: string;
    icon: React.ElementType;
    meta: string;
};

type Path = {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    tags: string[];
};

type Benefit = {
    title: string;
    description: string;
    icon: React.ElementType;
};

const steps: Step[] = [
    {
        title: "Tell us what you’re learning",
        description:
            "Search a topic, choose your level, and set your weekly goal. We’ll surface tutors who match your style.",
        icon: Sparkles,
        meta: "30 sec setup",
    },
    {
        title: "Book a time that works",
        description:
            "Pick a slot, confirm, and you’re set. You’ll get reminders and a clear session plan in your dashboard.",
        icon: CalendarCheck2,
        meta: "Instant booking",
    },
    {
        title: "Learn, track, improve",
        description:
            "After each session, keep notes and milestones. You’ll see progress over time—no guesswork.",
        icon: LineChart,
        meta: "Progress tracking",
    },
];

const learningPaths: Path[] = [
    {
        title: "Web Development",
        subtitle: "HTML • CSS • React • Next.js",
        icon: BookOpen,
        tags: ["Beginner", "Project-based", "Career-ready"],
    },
    {
        title: "UI/UX Design",
        subtitle: "Figma • Systems • UX flows",
        icon: Sparkles,
        tags: ["Portfolio", "Wireframes", "Real feedback"],
    },
    {
        title: "English Speaking",
        subtitle: "Confidence • Fluency • Pronunciation",
        icon: MessageSquareText,
        tags: ["Daily practice", "Interview prep", "IELTS"],
    },
    {
        title: "Math & Science",
        subtitle: "School • College • Basics to advanced",
        icon: GraduationCap,
        tags: ["Clear concepts", "Exam prep", "Step-by-step"],
    },
    {
        title: "Programming Basics",
        subtitle: "Python • Logic • Problem solving",
        icon: Users,
        tags: ["Beginner-friendly", "Assignments", "Guided"],
    },
    {
        title: "Career Coaching",
        subtitle: "CV • Interview • Roadmap",
        icon: BadgeCheck,
        tags: ["Mock interviews", "Portfolio", "Mentorship"],
    },
];

const trustBenefits: Benefit[] = [
    {
        title: "Verified profiles",
        description:
            "Profiles are reviewed so learners can book with confidence and clarity.",
        icon: ShieldCheck,
    },
    {
        title: "Clear session structure",
        description:
            "Each booking stays organized with goals, notes, and next-step follow-ups.",
        icon: BadgeCheck,
    },
    {
        title: "Fast responses",
        description:
            "Message tutors quickly and reduce back-and-forth before booking.",
        icon: Timer,
    },
];

function SoftGlow() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            {/* light */}
            <div className="absolute -top-20 left-1/2 h-56 w-[38rem] -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl dark:hidden" />
            <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl dark:hidden" />

            {/* dark */}
            <div className="absolute -top-24 left-1/2 hidden h-64 w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:block" />
            <div className="absolute -bottom-24 right-10 hidden h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl dark:block" />
        </div>
    );
}

function SectionShell({
    eyebrow,
    title,
    description,
    right,
    children,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="w-full py-10 sm:py-14">
            <div className="mx-auto w-full max-w-6xl px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        {eyebrow ? (
                            <div className="mb-2">
                                <Badge
                                    variant="secondary"
                                    className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm backdrop-blur dark:bg-white/5"
                                >
                                    {eyebrow}
                                </Badge>
                            </div>
                        ) : null}

                        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                            {title}
                        </h2>
                        {description ? (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                {description}
                            </p>
                        ) : null}
                    </div>

                    {right ? <div className="pt-2 sm:pt-0">{right}</div> : null}
                </div>

                <div className="mt-6">{children}</div>
            </div>
        </section>
    );
}

export default function HomeExtraSections() {
    return (
        <div className="w-full">
            {/* 1) How it works */}
            <SectionShell
                eyebrow="Simple, guided flow"
                title="How SkillBridge works"
                description="Pick a tutor, book in minutes, and keep a clear learning path with progress tracking."
                right={
                    <Button asChild variant="outline" className="rounded-full">
                        <Link href="/how-it-works">How it works</Link>
                    </Button>
                }
            >
                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 p-4 shadow-sm backdrop-blur sm:p-6 dark:bg-white/5">
                    <SoftGlow />

                    <div className="relative grid gap-4 md:grid-cols-3">
                        {steps.map((s, idx) => {
                            const Icon = s.icon;
                            return (
                                <Card
                                    key={s.title}
                                    className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-5 shadow-sm backdrop-blur dark:bg-black/20"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border/60 bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Step{" "}
                                                <span className="font-medium text-foreground">
                                                    {idx + 1}
                                                </span>
                                            </div>
                                        </div>

                                        <Badge
                                            variant="secondary"
                                            className="rounded-full border border-border/60 bg-background/60 text-[11px] text-foreground/80 dark:bg-white/5"
                                        >
                                            {s.meta}
                                        </Badge>
                                    </div>

                                    <h3 className="mt-4 text-base font-semibold text-foreground">
                                        {s.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {s.description}
                                    </p>

                                    <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-600/60 dark:bg-blue-400/60" />
                                        Built for consistent weekly progress
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </SectionShell>

            {/* 2) Learning paths */}
            <SectionShell
                eyebrow="Popular choices"
                title="Popular learning paths"
                description="Static, relatable paths learners usually book for—great for quicker discovery."
                right={
                    <Button asChild className="rounded-full">
                        <Link href="/tutors">Browse tutors</Link>
                    </Button>
                }
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {learningPaths.map((p) => {
                        const Icon = p.icon;
                        return (
                            <Card
                                key={p.title}
                                className="group rounded-2xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur transition hover:shadow-md dark:bg-white/5"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border/60 bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-base font-semibold text-foreground">
                                            {p.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {p.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {p.tags.map((t) => (
                                        <Badge
                                            key={t}
                                            variant="secondary"
                                            className="rounded-full border border-border/60 bg-background/60 text-[11px] text-foreground/80 dark:bg-white/5"
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <div className="text-xs text-muted-foreground">
                                        Match with verified tutors
                                    </div>
                                    {/* <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                                        Explore →
                                    </span> */}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </SectionShell>

            {/* 3) Trust + CTA band */}
            <SectionShell
                eyebrow="Trust & support"
                title="Learn with confidence"
                description="A clean, static trust band that reinforces safety, structure, and fast booking—fits your theme perfectly."
            >
                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 p-5 shadow-sm backdrop-blur sm:p-7 dark:bg-white/5">
                    <SoftGlow />

                    <div className="relative grid gap-5 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-foreground/80 shadow-sm backdrop-blur dark:bg-white/5">
                                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                Trusted learning platform
                            </div>

                            <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                Book better sessions, not just sessions.
                            </h3>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                SkillBridge is built for real progress—verified tutors, organized
                                bookings, and a dashboard that keeps goals and milestones clear.
                            </p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                {trustBenefits.map((b) => {
                                    const Icon = b.icon;
                                    return (
                                        <div
                                            key={b.title}
                                            className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur dark:bg-black/20"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="grid h-9 w-9 place-items-center rounded-2xl border border-border/60 bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-foreground">
                                                        {b.title}
                                                    </div>
                                                    <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                        {b.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Card className="relative rounded-2xl border border-border/60 bg-background/70 p-5 shadow-sm backdrop-blur dark:bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border/60 bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-foreground">
                                        Ready to start learning?
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Find a tutor that fits your goals today.
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3">
                                <Button asChild className="w-full rounded-xl">
                                    <Link href="/tutors">Find a tutor</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full rounded-xl"
                                >
                                    <Link href="/become-a-tutor">Become a tutor</Link>
                                </Button>
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-xs text-muted-foreground dark:bg-white/5">
                                <div className="flex items-center gap-2">
                                    <Timer className="h-4 w-4" />
                                    Quick booking
                                </div>
                                <div className="h-4 w-px bg-border/70" />
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4" />
                                    Verified tutors
                                </div>
                                <div className="h-4 w-px bg-border/70" />
                                <div className="flex items-center gap-2">
                                    <LineChart className="h-4 w-4" />
                                    Progress tracking
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </SectionShell>
        </div>
    );
}