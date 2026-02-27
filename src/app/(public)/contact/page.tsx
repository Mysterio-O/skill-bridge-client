import MarketingPageShell from "@/components/marketing/MarketingPageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <MarketingPageShell
            eyebrow="We’re here to help"
            title="Contact"
            subtitle="Send a message and we’ll get back to you. This is a static page UI — hook it to your API later."
            crumbs={[
                { label: "Home", href: "/" },
                { label: "Contact" },
            ]}
        >
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 lg:col-span-2">
                    <h2 className="text-lg font-semibold">Send us a message</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Share what you need — booking help, tutor questions, or account support.
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
                            <p className="text-sm font-medium">Subject</p>
                            <Input className="rounded-xl" placeholder="How can we help?" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <p className="text-sm font-medium">Message</p>
                            <Textarea className="min-h-[140px] rounded-xl" placeholder="Write your message..." />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <Button className="rounded-xl">Send message</Button>
                        <Button variant="outline" className="rounded-xl">
                            View help center
                        </Button>
                    </div>
                </Card>

                <div className="space-y-4">
                    <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start gap-3">
                            <Mail className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-sm font-semibold">Email</p>
                                <p className="mt-1 text-sm text-muted-foreground">support@skillbridge.app</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start gap-3">
                            <Phone className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-sm font-semibold">Phone</p>
                                <p className="mt-1 text-sm text-muted-foreground">+880 1XXX-XXXXXX</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-sm font-semibold">Location</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Online-first, supporting learners worldwide.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MarketingPageShell>
    );
}