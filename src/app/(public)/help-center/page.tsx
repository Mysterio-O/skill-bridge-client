import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        q: "How do I book a tutor?",
        a: "Go to Tutors, filter by subject and availability, open a profile, then choose a time slot and confirm booking.",
    },
    {
        q: "Are tutors verified?",
        a: "Yes — profiles are reviewed to keep quality and reliability high. You’ll also see clear profile details and session info.",
    },
    {
        q: "Can I reschedule a session?",
        a: "Typically yes, depending on the tutor’s policy and notice period. Your bookings page shows your upcoming sessions and options.",
    },
    {
        q: "How does progress tracking work?",
        a: "After sessions, keep notes and milestones so your learning stays structured. It’s designed to be simple and consistent.",
    },
    {
        q: "I’m a tutor — how do I join?",
        a: "Use the Become a Tutor flow. You’ll set subjects, availability, and your profile details for review.",
    },
];

export default function HelpCenterPage() {
    return (
        <MarketingPageShell
            eyebrow="Support & resources"
            title="Help Center"
            subtitle="Quick answers to common questions — clean, static UI that matches your landing style."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Help Center" },
            ]}
        >
            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Search help articles</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Try keywords like booking, reschedule, tutor, payments, progress.
                        </p>
                    </div>
                    <Badge
                        variant="secondary"
                        className="w-fit rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                    >
                        Updated regularly
                    </Badge>
                </div>
                <div className="mt-4">
                    <Input className="rounded-xl" placeholder="Search help topics..." />
                </div>
            </Card>

            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <Accordion type="single" collapsible className="px-3 py-2">
                    {FAQS.map((f) => (
                        <AccordionItem key={f.q} value={f.q} className="border-b border-slate-200/60 dark:border-white/10">
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