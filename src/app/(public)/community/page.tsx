import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    HeartHandshake,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Flag,
    ArrowRight,
} from "lucide-react";

const PRINCIPLES = [
    {
        title: "Be respectful",
        desc: "Keep it professional and kind — learners and tutors deserve a safe space.",
        icon: HeartHandshake,
    },
    {
        title: "Stay learning-focused",
        desc: "Use the platform for tutoring goals, structured practice, and helpful feedback.",
        icon: MessageCircle,
    },
    {
        title: "Protect privacy",
        desc: "Don’t share sensitive personal data publicly. Use platform-safe communication.",
        icon: ShieldCheck,
    },
    {
        title: "Help others improve",
        desc: "Share resources, tips, and constructive feedback. Keep the tone encouraging.",
        icon: Sparkles,
    },
];

const DO_DONT = [
    {
        title: "Do",
        items: [
            "Ask clear questions and share your learning goal",
            "Respect session times and tutor policies",
            "Give honest, constructive feedback after sessions",
            "Report suspicious activity or harassment",
        ],
    },
    {
        title: "Don’t",
        items: [
            "Share passwords, OTPs, or payment details in chat",
            "Harass, spam, or pressure anyone on the platform",
            "Post personal contact info publicly",
            "Misrepresent skills or identity",
        ],
    },
];

export default function CommunityPage() {
    return (
        <MarketingPageShell
            eyebrow="Guidelines & culture"
            title="Community"
            subtitle="SkillBridge is built for calm, respectful learning. These guidelines keep the platform safe, productive, and enjoyable for everyone."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Community" },
            ]}
            rightAction={
                <Button asChild className="rounded-xl">
                    <Link href="/tutors">
                        Browse tutors <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            }
        >
            {/* Principles */}
            <div>
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">Community principles</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Simple rules that match the clean, structured feel of SkillBridge.
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                    >
                        Updated regularly
                    </Badge>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {PRINCIPLES.map((p) => {
                        const Icon = p.icon;
                        return (
                            <Card
                                key={p.title}
                                className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold">{p.title}</h3>
                                        <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Do/Don't */}
            <div className="grid gap-4 lg:grid-cols-2">
                {DO_DONT.map((b) => (
                    <Card
                        key={b.title}
                        className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold">{b.title}</h3>
                            <Badge
                                variant="secondary"
                                className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                            >
                                Guidelines
                            </Badge>
                        </div>

                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                            {b.items.map((x) => (
                                <li key={x} className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600/80 dark:bg-blue-400/80" />
                                    <span>{x}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>

            {/* Reporting */}
            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                            <Flag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Report an issue</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                If you see harassment, spam, suspicious behavior, or unsafe activity — report it.
                                We take safety seriously.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button asChild className="rounded-xl">
                            <Link href="/contact">Contact support</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href="/safety">View safety</Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </MarketingPageShell>
    );
}