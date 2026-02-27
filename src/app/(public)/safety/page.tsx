import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserCheck, CreditCard, Flag } from "lucide-react";

const SAFETY = [
    {
        title: "Verified profiles",
        desc: "Tutor profiles are reviewed to reduce risk and ensure clarity before booking.",
        icon: UserCheck,
    },
    {
        title: "Safe booking flow",
        desc: "A structured booking experience helps keep sessions organized and predictable.",
        icon: ShieldCheck,
    },
    {
        title: "Payment awareness",
        desc: "Keep payments on-platform where possible and avoid sharing sensitive financial info in chat.",
        icon: CreditCard,
    },
    {
        title: "Report issues",
        desc: "If something feels wrong, report it. We prioritize safety for learners and tutors.",
        icon: Flag,
    },
];

export default function SafetyPage() {
    return (
        <MarketingPageShell
            eyebrow="Trust & support"
            title="Safety"
            subtitle="Guidelines that protect learners and tutors — styled consistently with your landing UI."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Safety" },
            ]}
        >
            <div className="grid gap-4 md:grid-cols-2">
                {SAFETY.map((s) => {
                    const Icon = s.icon;
                    return (
                        <Card
                            key={s.title}
                            className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="flex items-start gap-3">
                                <div className="rounded-xl border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
                                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold">{s.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
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
                    Quick tip
                </Badge>
                <p className="mt-3 text-sm text-muted-foreground">
                    Avoid sharing passwords, OTP codes, or private payment details. Use platform tools and keep learning sessions focused on the goal.
                </p>
            </Card>
        </MarketingPageShell>
    );
}