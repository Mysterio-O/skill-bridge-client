"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, MapPin } from "lucide-react";
import type { TutorProfile, TutorSubject } from "@/app/actions/tutorActions/getTutors";

function initials(name?: string) {
    if (!name) return "T";
    const parts = name.trim().split(" ");
    return (parts[0]?.[0] ?? "T") + (parts[1]?.[0] ?? "");
}

function subjectLabel(s: TutorSubject) {
    return s?.name || s?.title || s?.slug || "Subject";
}

export default function TutorCard({
    tutor,
    onOpen,
}: {
    tutor: TutorProfile;
    onOpen: () => void;
}) {
    const name = tutor.user?.name ?? "Tutor";
    const rating =
        tutor.avgRating != null ? Number(tutor.avgRating).toFixed(1) : null;

    return (
        <Card className="rounded-3xl border bg-card/55 backdrop-blur p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={tutor.user?.image ?? ""} alt={name} />
                    <AvatarFallback>{initials(name)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {tutor.headline}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-semibold text-foreground">
                                ${tutor.hourlyRate}
                                <span className="text-xs text-muted-foreground">/hr</span>
                            </div>

                            <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                                <Star className="h-3.5 w-3.5" />
                                {rating ? (
                                    <span className="text-foreground font-medium">{rating}</span>
                                ) : (
                                    <span>New</span>
                                )}
                                <span>·</span>
                                <span>{tutor.reviewCount ?? 0} reviews</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {tutor.sessionMode ? (
                            <Badge variant="secondary" className="rounded-2xl">
                                <Clock className="mr-1 h-3.5 w-3.5" />
                                {tutor.sessionMode}
                            </Badge>
                        ) : null}

                        {tutor.timezone ? (
                            <Badge variant="outline" className="rounded-2xl">
                                <MapPin className="mr-1 h-3.5 w-3.5" />
                                {tutor.timezone}
                            </Badge>
                        ) : null}

                        {(tutor.languages ?? []).slice(0, 2).map((l) => (
                            <Badge key={l} variant="outline" className="rounded-2xl">
                                {l}
                            </Badge>
                        ))}
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {tutor.about}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {(tutor.subjects ?? []).slice(0, 3).map((s, idx) => (
                            <Badge
                                key={(s?.id as string) ?? `${tutor.id}-${idx}`}
                                className="rounded-2xl"
                                variant="secondary"
                            >
                                {subjectLabel(s)}
                            </Badge>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <Button variant="secondary" className="rounded-2xl" onClick={onOpen}>
                            View details
                        </Button>

                        <Button className="rounded-2xl" asChild>
                            <Link href={`/bookings/new?tutorId=${encodeURIComponent(tutor.id)}`}>
                                Schedule booking
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
