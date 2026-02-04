import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
    ArrowRight,
    BadgeCheck,
    MapPin,
    Star,
    Clock,
} from "lucide-react";

export type Tutor = {
    id: string | number;
    name: string;
    title: string;
    subjects: string[];
    rating: number; // 0-5
    reviewsCount: number;
    hourlyRate?: number;
    location?: string;
    verified?: boolean;
};

type TutorsSectionProps = {
    className?: string;
    title?: string;
    subtitle?: string;
    tutors: Tutor[];
    categories?: string[];
    onCategoryClick?: (category: string) => void;
};

export default function TutorsSection({
    className,
    title = "Featured Tutors",
    subtitle = "Hand-picked profiles to help you get results faster.",
    tutors,
    categories = ["Programming", "Design", "English", "Math", "IELTS", "Science"],
    onCategoryClick,
}: TutorsSectionProps) {
    return (
        <section className={cn("relative", className)}>
            <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                    </div>

                    <Button asChild variant="outline" className="w-fit rounded-xl">
                        <Link href="/tutors">
                            View all
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Category pills (optional) */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onCategoryClick?.(c)}
                            className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-foreground shadow-sm backdrop-blur hover:bg-background/80"
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <Separator className="my-6 opacity-60" />

                {/* Tutor grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tutors.slice(0, 6).map((t) => (
                        <TutorCard key={String(t.id)} tutor={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TutorCard({ tutor }: { tutor: Tutor }) {
    const subjectPreview = tutor.subjects.slice(0, 3);

    return (
        <Card className="rounded-2xl border-border/60 bg-card/50 shadow-sm backdrop-blur">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="text-base font-semibold text-foreground">
                                {tutor.name}
                            </div>
                            {tutor.verified ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] text-foreground">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Verified
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                            {tutor.title}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-foreground">
                        <Star className="h-3.5 w-3.5" />
                        <span className="font-medium">{tutor.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({tutor.reviewsCount})</span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {subjectPreview.map((s) => (
                        <Badge
                            key={s}
                            variant="secondary"
                            className="border border-border/60 bg-background/60 text-xs"
                        >
                            {s}
                        </Badge>
                    ))}
                    {tutor.subjects.length > 3 ? (
                        <Badge
                            variant="secondary"
                            className="border border-border/60 bg-background/60 text-xs"
                        >
                            +{tutor.subjects.length - 3} more
                        </Badge>
                    ) : null}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2">
                        <Clock className="h-4 w-4 text-foreground" />
                        <span>{tutor.hourlyRate ? `$${tutor.hourlyRate}/hour` : "Flexible rate"}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2">
                        <MapPin className="h-4 w-4 text-foreground" />
                        <span>{tutor.location || "Remote"}</span>
                    </div>
                </div>

                <Button asChild className="mt-4 w-full rounded-xl">
                    <Link href={`/tutors/${tutor.id}`}>
                        View profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
