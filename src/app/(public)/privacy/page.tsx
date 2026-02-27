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

export default function PrivacyPage() {
    return (
        <MarketingPageShell
            eyebrow="Legal"
            title="Privacy Policy"
            subtitle="A clear, static privacy policy page — you can replace text with your real legal policy later."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Privacy" },
            ]}
        >
            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <Section title="Overview">
                    <p>
                        SkillBridge is designed to help learners book tutors and track progress. This policy explains what we collect and how we use it.
                    </p>
                </Section>

                <div className="mt-6 space-y-6">
                    <Section title="Information we collect">
                        <p>Account information (name, email), booking details, and basic usage data to improve the experience.</p>
                    </Section>

                    <Section title="How we use information">
                        <p>To provide bookings, reminders, progress tracking, support, and platform security.</p>
                    </Section>

                    <Section title="Sharing">
                        <p>We don’t sell your personal data. We may share limited information with service providers needed to operate the platform.</p>
                    </Section>

                    <Section title="Security">
                        <p>We use practical safeguards, but no online system is 100% risk-free. Keep your login secure.</p>
                    </Section>

                    <Section title="Your choices">
                        <p>You can update your profile details and manage settings from your dashboard.</p>
                    </Section>
                </div>
            </Card>
        </MarketingPageShell>
    );
}