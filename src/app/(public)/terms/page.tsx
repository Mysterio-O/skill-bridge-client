import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import { Card } from "@/components/ui/card";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-base font-semibold">{title}</h2>
            <div className="mt-2 text-sm text-muted-foreground space-y-2">{children}</div>
        </div>
    );
}

export default function TermsPage() {
    return (
        <MarketingPageShell
            eyebrow="Legal"
            title="Terms of Service"
            subtitle="A structured terms page UI. Replace with your official terms anytime."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Terms" },
            ]}
        >
            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <Section title="Using SkillBridge">
                    <p>Use the platform responsibly. Don’t abuse tutors, learners, or the booking system.</p>
                </Section>

                <div className="mt-6 space-y-6">
                    <Section title="Accounts">
                        <p>You’re responsible for your account activity. Keep your credentials private.</p>
                    </Section>

                    <Section title="Bookings & sessions">
                        <p>Bookings are scheduled interactions. Rescheduling rules may depend on tutor policy and notice time.</p>
                    </Section>

                    <Section title="Content & conduct">
                        <p>No harassment, spam, or illegal activity. Keep communication respectful and learning-focused.</p>
                    </Section>

                    <Section title="Termination">
                        <p>Accounts may be limited or removed if these terms are violated or if safety is at risk.</p>
                    </Section>

                    <Section title="Changes">
                        <p>We may update terms to improve safety and clarity. The latest version will be shown here.</p>
                    </Section>
                </div>
            </Card>
        </MarketingPageShell>
    );
}