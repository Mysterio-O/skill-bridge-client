import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    ArrowRight,
    Briefcase,
    HeartHandshake,
    Sparkles,
    ShieldCheck,
    Users,
} from "lucide-react";

const VALUES = [
    {
        title: "Learner-first",
        desc: "Every decision should make learning simpler, calmer, and more consistent.",
        icon: Users,
    },
    {
        title: "Quality & trust",
        desc: "We care about verified profiles, clear booking, and safety for everyone.",
        icon: ShieldCheck,
    },
    {
        title: "Clear communication",
        desc: "We move fast, but we keep feedback constructive and concrete.",
        icon: HeartHandshake,
    },
    {
        title: "Progress-driven",
        desc: "We measure outcomes and improve the product step by step.",
        icon: Sparkles,
    },
];

const ROLES = [
    {
        title: "Frontend Engineer",
        type: "Full-time • Remote",
        location: "Remote",
        tags: ["Next.js", "TypeScript", "UI polish"],
        summary:
            "Build clean, accessible interfaces that feel fast and consistent in both dark and light mode.",
        responsibilities: [
            "Implement marketing + dashboard UI with strong component reuse",
            "Maintain design tokens, responsiveness, and performance",
            "Collaborate with backend engineers to ship end-to-end features",
        ],
        requirements: [
            "Strong React + TypeScript fundamentals",
            "Comfort with Tailwind + component libraries (shadcn/ui)",
            "Attention to spacing, hierarchy, and interactive details",
        ],
    },
    {
        title: "Backend Engineer",
        type: "Full-time • Remote",
        location: "Remote",
        tags: ["API", "Auth", "Bookings"],
        summary:
            "Design reliable APIs for tutor discovery, booking, and progress tracking with scalable data modeling.",
        responsibilities: [
            "Build and maintain secure REST endpoints",
            "Improve performance with caching, pagination, and indexing",
            "Design booking workflows and audit-friendly logging",
        ],
        requirements: [
            "Strong backend fundamentals (Django/Node/etc.)",
            "Experience with PostgreSQL and clean schema design",
            "Good security instincts (auth, permissions, rate limits)",
        ],
    },
    {
        title: "Tutor Success Specialist",
        type: "Part-time • Remote",
        location: "Remote",
        tags: ["Support", "Operations", "Quality"],
        summary:
            "Help tutors and learners succeed with fast support and quality checks.",
        responsibilities: [
            "Support onboarding and profile review workflows",
            "Assist with booking issues and account questions",
            "Document common issues into help-center articles",
        ],
        requirements: [
            "Strong communication and empathy",
            "Great organization and follow-up habits",
            "Comfort working with dashboards/tools",
        ],
    },
];

const FAQS = [
    {
        q: "Do you hire internationally?",
        a: "Yes. Many roles are remote-first. If a role has location constraints, it will be listed in the job details.",
    },
    {
        q: "What does the hiring process look like?",
        a: "Typically: application → short screening → role interview → small practical task (for some roles) → final call.",
    },
    {
        q: "How should I apply?",
        a: "Use the form on this page to send your details. You can also contact us through the Contact page.",
    },
];

export default function CareersPage() {
    return (
        <MarketingPageShell
            eyebrow="Company"
            title="Careers"
            subtitle="Join SkillBridge and help build a clean, trusted learning platform — matching learners with tutors and tracking real progress."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Careers" },
            ]}
            rightAction={
                <Button asChild className="rounded-xl">
                    <Link href="#open-roles">
                        View open roles <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            }
        >
            {/* Intro / highlight strip */}
            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                            <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Work with purpose</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                We’re focused on a calm UX, verified tutors, and a booking flow
                                that feels simple and trustworthy.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant="secondary"
                            className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                        >
                            Remote-first
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                        >
                            Product-minded
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                        >
                            Quality-driven
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Values */}
            <div>
                <h2 className="text-lg font-semibold">What we value</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    These principles keep the product consistent and the team aligned.
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {v.desc}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Open roles */}
            <div id="open-roles">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">Open roles</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Static listings UI — plug real jobs from your database later.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="#apply">Apply now</Link>
                    </Button>
                </div>

                <div className="mt-4 grid gap-4">
                    {ROLES.map((r) => (
                        <Card
                            key={r.title}
                            className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-base font-semibold">{r.title}</h3>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                                        >
                                            {r.type}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                                        >
                                            {r.location}
                                        </Badge>
                                    </div>

                                    <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {r.tags.map((t) => (
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

                                <div className="flex shrink-0 flex-wrap gap-2">
                                    <Button className="rounded-xl" asChild>
                                        <Link href="#apply">Apply</Link>
                                    </Button>
                                    <Button variant="outline" className="rounded-xl" asChild>
                                        <Link href="/contact">Ask a question</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-semibold">Responsibilities</p>
                                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                        {r.responsibilities.map((x) => (
                                            <li key={x} className="flex gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600/80 dark:bg-blue-400/80" />
                                                <span>{x}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">Requirements</p>
                                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                                        {r.requirements.map((x) => (
                                            <li key={x} className="flex gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600/80 dark:bg-blue-400/80" />
                                                <span>{x}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Apply */}
            <div id="apply" className="grid gap-4 lg:grid-cols-3">
                <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 lg:col-span-2">
                    <h2 className="text-lg font-semibold">Apply</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This is a static form UI. Connect it to your API later.
                    </p>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Full name</p>
                            <Input className="rounded-xl" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Email</p>
                            <Input className="rounded-xl" placeholder="you@example.com" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <p className="text-sm font-medium">Role you’re applying for</p>
                            <Input className="rounded-xl" placeholder="e.g. Frontend Engineer" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <p className="text-sm font-medium">Portfolio / LinkedIn / GitHub</p>
                            <Input className="rounded-xl" placeholder="Paste a link" />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <Button className="rounded-xl">Submit application</Button>
                        <Button variant="outline" className="rounded-xl" asChild>
                            <Link href="/help-center">Visit help center</Link>
                        </Button>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground">
                        By submitting, you agree that we may review the information you provide for hiring purposes.
                    </p>
                </Card>

                <div className="space-y-4">
                    <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm font-semibold">Hiring basics</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We prioritize clear communication, practical skills, and respectful collaboration.
                        </p>
                    </Card>

                    <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm font-semibold">Response time</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            If your profile matches, we’ll reach out with next steps.
                        </p>
                    </Card>
                </div>
            </div>

            {/* FAQ */}
            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <Accordion type="single" collapsible className="px-3 py-2">
                    {FAQS.map((f) => (
                        <AccordionItem
                            key={f.q}
                            value={f.q}
                            className="border-b border-slate-200/60 dark:border-white/10"
                        >
                            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">
                                {f.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Card>
        </MarketingPageShell>
    );
}