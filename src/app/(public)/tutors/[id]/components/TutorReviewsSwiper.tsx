"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Review } from "../page";


function safeDateLabel(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function Stars({ rating }: { rating: number }) {
    const r = Math.max(0, Math.min(5, Math.floor(rating || 0)));
    return (
        <div className="flex items-center gap-0.5" aria-label={`${r} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={[
                        "h-3.5 w-3.5",
                        i < r ? "text-primary fill-current" : "text-muted-foreground/35",
                    ].join(" ")}
                />
            ))}
        </div>
    );
}

export default function TutorReviewsSwiper({
    reviews,
    title = "Reviews",
    subtitle = "Real feedback from students",
}: {
    reviews?: Review[];
    title?: string;
    subtitle?: string;
}) {
    const clean = React.useMemo(() => {
        return (reviews ?? [])
            .filter((r) => !r.isHidden)
            .filter((r) => typeof r.rating === "number" && r.rating > 0)
            .filter((r) => (r.comment ?? "").trim().length > 0);
    }, [reviews]);
    console.log(reviews);

    if (!clean.length) {
        return (
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-foreground">{title}</h2>
                    <span className="text-xs text-muted-foreground">0 reviews</span>
                </div>

                <Card className="mt-3 rounded-3xl border bg-background/40 p-4">
                    <p className="text-sm text-muted-foreground">
                        No reviews yet. After a completed session, students can leave feedback here.
                    </p>
                </Card>
            </div>
        );
    }

    const base = clean.slice(0, 20); 
    const items = [...base, ...base];

    return (
        <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-sm font-medium text-foreground">{title}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
                </div>

                <Badge variant="outline" className="rounded-2xl text-xs">
                    {clean.length} total
                </Badge>
            </div>

            <div className="relative mt-3 overflow-hidden rounded-3xl border bg-background/30">
                {/* edge fades (dark/light friendly) */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

                <div
                    className={[
                        "flex w-max gap-3 p-3",
                        "animate-[tutorMarquee_var(--dur)_linear_infinite]",
                        "hover:[animation-play-state:paused]",
                        "focus-within:[animation-play-state:paused]",
                    ].join(" ")}
                    style={{ ["--dur" as string]: "42s" } as React.CSSProperties}
                >
                    {items.map((r, idx) => {
                        const studentName = r.student?.name?.trim() || "Student";
                        const initials = studentName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((p) => p[0]?.toUpperCase())
                            .join("");

                        return (
                            <Card
                                key={`${r.id}-${idx}`}
                                className={[
                                    "shrink-0",
                                    "w-[240px] sm:w-[290px]",
                                    "rounded-3xl border",
                                    "bg-card/55 backdrop-blur",
                                    "p-3",
                                ].join(" ")}
                            >
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={r.student?.image ?? undefined} alt={studentName} />
                                        <AvatarFallback className="text-[11px]">{initials || "ST"}</AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-foreground">
                                                    {studentName}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {safeDateLabel(r.createdAt)}
                                                </div>
                                            </div>

                                            <Badge variant="outline" className="rounded-2xl px-2 py-1">
                                                <Stars rating={r.rating} />
                                            </Badge>
                                        </div>

                                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                            {r.comment}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <style jsx>{`
          @keyframes tutorMarquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-\\[tutorMarquee_var\\(--dur\\)_linear_infinite\\] {
              animation: none !important;
              transform: none !important;
            }
          }
        `}</style>
            </div>
        </div>
    );
}
