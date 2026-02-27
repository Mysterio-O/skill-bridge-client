import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function MarketingPageShell({
    eyebrow = "SkillBridge",
    title,
    subtitle,
    crumbs = [{ label: "Home", href: "/" }],
    rightAction,
    children,
}: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    crumbs?: Crumb[];
    rightAction?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            {/* Background (matches your landing vibe in both modes) */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#050812] dark:via-[#050812] dark:to-[#050812]" />
                <div className="absolute left-1/2 top-[-120px] h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/12" />
                <div className="absolute left-1/2 top-[280px] h-[340px] w-[760px] -translate-x-1/2 rounded-full bg-slate-400/10 blur-3xl dark:bg-white/5" />
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 md:px-6">
                {/* Breadcrumb row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {crumbs.map((c, idx) => (
                            <React.Fragment key={`${c.label}-${idx}`}>
                                {idx !== 0 && <span className="opacity-60">/</span>}
                                {c.href ? (
                                    <Link
                                        className="hover:text-foreground transition-colors"
                                        href={c.href}
                                    >
                                        {c.label}
                                    </Link>
                                ) : (
                                    <span className="text-foreground">{c.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {rightAction ? (
                        <div className="shrink-0">{rightAction}</div>
                    ) : (
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href="/tutors">
                                Browse tutors <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Hero header */}
                <div className="mt-10">
                    <Badge
                        variant="secondary"
                        className={cn(
                            "rounded-full px-3 py-1 text-xs border border-slate-200/60 bg-white/70",
                            "dark:border-white/10 dark:bg-white/5"
                        )}
                    >
                        {eyebrow}
                    </Badge>

                    <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                        {title}
                    </h1>

                    {subtitle ? (
                        <p className="mt-3 max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
                            {subtitle}
                        </p>
                    ) : null}
                </div>

                {/* Content */}
                <div className="mt-10 space-y-10">{children}</div>

                {/* Bottom CTA strip */}
                <Card className="mt-14 rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <p className="text-sm font-medium">Ready to start learning?</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Find a tutor that fits your goal today — quick booking, clear
                                progress.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild className="rounded-xl">
                                <Link href="/tutors">Find a tutor</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-xl">
                                <Link href="/become-tutor">Become a tutor</Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}