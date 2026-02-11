"use client";

import * as React from "react";
import { Booking } from "../types";
import { Badge } from "@/components/ui/badge";

function formatDT(dt: string) {
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return dt;
    return d.toLocaleString();
}

function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function BookingListItem({
    booking,
    onClick,
}: {
    booking: Booking;
    onClick: () => void;
}) {
    const tutorName = booking.tutorProfile?.user?.name || "Tutor";
    const studentName = booking.student?.name || "Student";

    return (
        <div
            onClick={onClick}
            className={cx(
                "cursor-pointer rounded-xl border bg-background/60 backdrop-blur",
                "p-4 transition hover:bg-accent/40"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">
                            {studentName} <span className="text-muted-foreground">→</span> {tutorName}
                        </p>
                        <Badge variant="secondary" className="capitalize">
                            {booking.status.replaceAll("_", " ")}
                        </Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground truncate">
                        Topic:{" "}
                        <span className="text-foreground/90">
                            {booking.topic || "General Session"}
                        </span>
                    </p>

                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                        <p className="text-muted-foreground">
                            Start: <span className="text-foreground">{formatDT(booking.startAt)}</span>
                        </p>
                        <p className="text-muted-foreground">
                            End: <span className="text-foreground">{formatDT(booking.endAt)}</span>
                        </p>
                        <p className="text-muted-foreground">
                            Duration: <span className="text-foreground">{booking.durationMinutes} min</span>
                        </p>
                        <p className="text-muted-foreground">
                            Total: <span className="text-foreground">{booking.currency} {booking.totalPrice}</span>
                        </p>
                    </div>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">Timezone</p>
                    <p className="text-sm font-medium text-foreground">{booking.timezone || "-"}</p>
                </div>
            </div>
        </div>
    );
}
