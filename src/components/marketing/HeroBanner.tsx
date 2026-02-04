"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BackgroundGlow from "../shared/BackgroundGlow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
    ArrowRight,
    BadgeCheck,
    Search,
    ShieldCheck,
    Users,
    BookOpen,
} from "lucide-react";

type HeroBannerProps = {
    className?: string;
    onSearch?: (q: string) => void;
};

export default function HeroBanner({ className, onSearch }: HeroBannerProps) {
    const [q, setQ] = React.useState("");

    function submit(e: React.FormEvent) {
        e.preventDefault();
        onSearch?.(q);
    }

    return (
        <section className={cn("relative overflow-hidden", className)}>
            <BackgroundGlow className="opacity-60 dark:opacity-80" />

            <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-10 md:pt-10 md:pb-14">
                <div className="mx-auto max-w-3xl text-center">
                    <Badge
                        variant="secondary"
                        className="mb-4 inline-flex items-center gap-2 border border-border/60 bg-background/60 backdrop-blur secondary-font"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Trusted learning platform
                    </Badge>

                    <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Learn faster with expert tutors, matched to your goals
                    </h1>

                    <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">
                        Find verified tutors for programming, design, languages, and more.
                        Book sessions in minutes and track progress in your dashboard.
                    </p>

                    {/* Search */}
                    <form
                        onSubmit={submit}
                        className="mx-auto mt-6 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-border/60 bg-background/60 p-2 shadow-sm backdrop-blur"
                    >
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search tutors, subjects, skills..."
                                className="h-10 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                            />
                        </div>

                        <Button type="submit" className="h-10 rounded-xl">
                            Search
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    {/* CTAs */}
                    <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button asChild className="rounded-xl">
                            <Link href="/tutors">
                                Browse Tutors
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="rounded-xl bg-background/50 backdrop-blur">
                            <Link href="/register">
                                Create account
                                <BadgeCheck className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                        <StatCard icon={Users} label="Active Tutors" value="150+" />
                        <StatCard icon={BookOpen} label="Subjects" value="60+" />
                        <StatCard icon={ShieldCheck} label="Verified Profiles" value="100%" />
                    </div>
                </div>

                {/* Compact “trust strip” */}
                <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur">
                    <div className="grid gap-4 md:grid-cols-3">
                        <MiniFeature
                            icon={BadgeCheck}
                            title="Verified tutors"
                            desc="Profiles reviewed to ensure quality and reliability."
                        />
                        <MiniFeature
                            icon={ShieldCheck}
                            title="Secure booking"
                            desc="Safe login flow and structured session management."
                        />
                        <MiniFeature
                            icon={Users}
                            title="Progress driven"
                            desc="Track milestones and improve consistently."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-border/60 bg-background/60">
                    <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="text-left">
                    <div className="text-lg font-semibold leading-none">{value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                </div>
            </div>
        </div>
    );
}

function MiniFeature({
    icon: Icon,
    title,
    desc,
}: {
    icon: React.ElementType;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-border/60 bg-background/60">
                <Icon className="h-4 w-4 text-foreground" />
            </div>
            <div>
                <div className="text-sm font-medium text-foreground">{title}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {desc}
                </div>
            </div>
        </div>
    );
}
