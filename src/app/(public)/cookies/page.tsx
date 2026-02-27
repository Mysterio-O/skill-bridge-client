import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CookiesPage() {
    return (
        <MarketingPageShell
            eyebrow="Legal"
            title="Cookies Policy"
            subtitle="A simple cookie policy page that matches your design system."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Cookies" },
            ]}
        >
            <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <Badge
                    variant="secondary"
                    className="rounded-full border border-slate-200/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
                >
                    Summary
                </Badge>

                <p className="mt-3 text-sm text-muted-foreground">
                    Cookies help remember preferences, keep sessions secure, and understand how the platform is used.
                    You can disable cookies in your browser settings, but some features may not work correctly.
                </p>

                <div className="mt-6 space-y-5">
                    <div>
                        <h2 className="text-base font-semibold">Essential cookies</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Required for login/session behavior and basic security.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-base font-semibold">Performance cookies</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Help us understand usage patterns so we can improve speed and UX.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-base font-semibold">Preference cookies</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Remember UI choices like theme and layout preferences.
                        </p>
                    </div>
                </div>
            </Card>
        </MarketingPageShell>
    );
}