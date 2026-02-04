import React from "react";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Quote, Star } from "lucide-react";

export type Review = {
    id: string | number;
    name: string;
    title?: string; // e.g. "Student", "Parent"
    rating: number; // 0-5
    text: string;
};

type ReviewsSectionProps = {
    className?: string;
    title?: string;
    subtitle?: string;
    reviews: Review[];
};

export default function ReviewsSection({
    className,
    title = "What learners say",
    subtitle = "Real feedback from students and parents who booked tutors.",
    reviews,
}: ReviewsSectionProps) {
    return (
        <section className={cn("relative", className)}>
            <div className="mx-auto max-w-6xl px-4 pb-14">
                <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm backdrop-blur md:p-8">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                {title}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                        </div>
                    </div>

                    <Separator className="my-6 opacity-60" />

                    <div className="grid gap-4 md:grid-cols-3">
                        {reviews.slice(0, 3).map((r) => (
                            <Card
                                key={String(r.id)}
                                className="rounded-2xl border-border/60 bg-background/50 shadow-sm backdrop-blur"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">
                                                {r.name}
                                            </div>
                                            {r.title ? (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {r.title}
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Quote className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-1">
                                        <Stars value={r.rating} />
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            {r.rating.toFixed(1)} / 5
                                        </span>
                                    </div>

                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {r.text}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Stars({ value }: { value: number }) {
    const full = Math.round(value); // keeps it simple & clean
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < full;
                return (
                    <Star
                        key={i}
                        className={cn(
                            "h-4 w-4",
                            filled ? "text-primary" : "text-muted-foreground/50"
                        )}
                        fill={filled ? "currentColor" : "none"}
                    />
                );
            })}
        </div>
    );
}
