"use client";

import * as React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Clock, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { TutorProfile, TutorSubject } from "@/app/actions/tutorActions/getTutors";

type CreateBookingPayload = {
    tutorProfileId: string;

    startAt: string;
    endAt: string;
    timezone?: string;
    durationMinutes: number;

    topic?: string;
    meetingLink?: string;
};

function initials(name?: string) {
    if (!name) return "T";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return (parts[0]?.[0] ?? "T") + (parts[1]?.[0] ?? "");
}

function subjectLabel(s: TutorSubject) {
    return s?.category?.name || s?.name || s?.title || s?.slug || "Subject";
}

function formatTime12h(timeHHmm: string) {
    const [hh, mm] = timeHHmm.split(":").map(Number);
    const d = new Date();
    d.setHours(hh || 0, mm || 0, 0, 0);
    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(d);
}

function money(currency: string, amount: number) {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency || "USD",
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

function parseHourlyRate(rate: string | number) {
    const n = typeof rate === "number" ? rate : Number(rate);
    return Number.isFinite(n) ? n : 0;
}

function toISOStringLocal(date: Date) {
    return date.toISOString();
}

function buildTimes(stepMinutes = 15) {
    const out: string[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += stepMinutes) {
            const hh = String(h).padStart(2, "0");
            const mm = String(m).padStart(2, "0");
            out.push(`${hh}:${mm}`);
        }
    }
    return out;
}

export default function ScheduleBookingSheet({
    open,
    onOpenChange,
    tutor,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    tutor: TutorProfile | null;
    onSubmit: (payload: CreateBookingPayload) => Promise<void>;
}) {
    const times = React.useMemo(() => buildTimes(15), []);

    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [time, setTime] = React.useState<string>(""); // "HH:mm"
    const [durationMinutes, setDurationMinutes] = React.useState<number>(60);

    const [timezone, setTimezone] = React.useState<string>("");
    const [topic, setTopic] = React.useState<string>("");
    const [meetingLink, setMeetingLink] = React.useState<string>("");

    const [busy, setBusy] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setBusy(false);
            setDate(undefined);
            setTime("");
            setDurationMinutes(60);
            setTimezone(tutor?.timezone || "");
            setTopic("");
            setMeetingLink("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, tutor?.id]);

    const hourlyRateNum = React.useMemo(
        () => parseHourlyRate(tutor?.hourlyRate ?? 0),
        [tutor?.hourlyRate]
    );

    const startDateTime = React.useMemo(() => {
        if (!date || !time) return null;
        const [hh, mm] = time.split(":").map(Number);
        const d = new Date(date);
        d.setHours(hh || 0, mm || 0, 0, 0);
        return d;
    }, [date, time]);

    const endDateTime = React.useMemo(() => {
        if (!startDateTime) return null;
        const d = new Date(startDateTime);
        d.setMinutes(d.getMinutes() + (durationMinutes || 0));
        return d;
    }, [startDateTime, durationMinutes]);

    const totalCost = React.useMemo(() => {
        if (!hourlyRateNum || !durationMinutes) return 0;
        const total = (hourlyRateNum * durationMinutes) / 60;
        return Math.round(total * 100) / 100;
    }, [hourlyRateNum, durationMinutes]);

    const canSubmit =
        !!tutor && !!startDateTime && !!endDateTime && durationMinutes > 0;

    async function handleSubmit() {
        if (!tutor || !startDateTime || !endDateTime) return;

        const payload: CreateBookingPayload = {
            tutorProfileId: tutor.id,
            startAt: toISOStringLocal(startDateTime),
            endAt: toISOStringLocal(endDateTime),
            durationMinutes,
        };

        if (timezone.trim()) payload.timezone = timezone.trim();
        if (topic.trim()) payload.topic = topic.trim();
        if (meetingLink.trim()) payload.meetingLink = meetingLink.trim();

        try {
            setBusy(true);
            await onSubmit(payload);
            onOpenChange(false);
        } finally {
            setBusy(false);
        }
    }

    const tutorName = tutor?.user?.name ?? "Tutor";
    const tutorEmail = tutor?.user?.email ?? "";

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className={[
                    "w-[100vw] sm:w-[520px] sm:max-w-[520px]",
                    "h-[100dvh] flex flex-col",
                    "p-0",
                    "overflow-hidden",
                ].join(" ")}
            >
                {/* Header (fixed) */}
                <div className="shrink-0 px-4 py-4 sm:px-6 border-b border-border">
                    <SheetHeader>
                        <SheetTitle className="flex items-center justify-between gap-3">
                            <span className="truncate">Schedule booking</span>
                            {tutor ? (
                                <Badge variant="secondary" className="shrink-0 rounded-xl">
                                    {money(tutor.currency, hourlyRateNum)}/hr
                                </Badge>
                            ) : null}
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground">
                            Pick a date & time, set duration, and confirm.
                        </SheetDescription>
                    </SheetHeader>

                    {tutor ? (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-muted/10 p-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={tutor.user?.image ?? ""} alt={tutorName} />
                                <AvatarFallback>{initials(tutorName)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {tutorName}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {tutor.headline || tutorEmail}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 rounded-2xl border border-border bg-muted/10 p-3 text-sm text-muted-foreground">
                            No tutor selected.
                        </div>
                    )}
                </div>

                <div className="min-h-0 flex-1">
                    <ScrollArea className="h-full">
                        <div className="px-4 py-4 sm:px-6 space-y-4 pb-6">
                            {tutor?.subjects?.length ? (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Subjects</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.subjects.slice(0, 8).map((s, idx) => (
                                            <Badge
                                                key={(s.id as string) ?? `${tutor.id}-sub-${idx}`}
                                                variant="secondary"
                                                className="rounded-xl"
                                            >
                                                {subjectLabel(s)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-border p-3">
                                    <p className="text-xs text-muted-foreground mb-2">Date</p>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full justify-start rounded-xl"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date
                                                    ? new Intl.DateTimeFormat(undefined, {
                                                        dateStyle: "medium",
                                                    }).format(date)
                                                    : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-2 w-auto" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Choose a day for the session.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border p-3 space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">Time</p>
                                        <Select value={time} onValueChange={setTime}>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[260px]">
                                                {times.map((t) => (
                                                    <SelectItem key={t} value={t}>
                                                        {formatTime12h(t)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Duration
                                        </p>
                                        <Select
                                            value={String(durationMinutes)}
                                            onValueChange={(v) => setDurationMinutes(Number(v))}
                                        >
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[30, 45, 60, 90, 120].map((m) => (
                                                    <SelectItem key={m} value={String(m)}>
                                                        {m} minutes
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border p-3 space-y-3">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Timezone (optional)
                                        </p>
                                        <Input
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            placeholder="e.g. Asia/Dhaka"
                                            className="rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Meeting link (optional)
                                        </p>
                                        <Input
                                            value={meetingLink}
                                            onChange={(e) => setMeetingLink(e.target.value)}
                                            placeholder="https://meet.google.com/..."
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Topic (optional)
                                    </p>
                                    <Textarea
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="What do you want to cover?"
                                        className="rounded-xl min-h-[84px]"
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-muted/10 p-4">
                                <p className="text-xs text-muted-foreground mb-2">Summary</p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Start</span>
                                        <span className="font-medium text-foreground">
                                            {startDateTime
                                                ? new Intl.DateTimeFormat(undefined, {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                    hour12: true,
                                                }).format(startDateTime)
                                                : "—"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">End</span>
                                        <span className="font-medium text-foreground">
                                            {endDateTime
                                                ? new Intl.DateTimeFormat(undefined, {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                    hour12: true,
                                                }).format(endDateTime)
                                                : "—"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium text-foreground">
                                            {durationMinutes} min
                                        </span>
                                    </div>

                                    <Separator className="my-2" />

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Hourly rate</span>
                                        <span className="font-medium text-foreground">
                                            {tutor ? `${money(tutor.currency, hourlyRateNum)}/hr` : "—"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-muted-foreground">Total cost</span>
                                        <span className="font-semibold text-foreground">
                                            {tutor ? money(tutor.currency, totalCost) : "—"}
                                        </span>
                                    </div>

                                    <div className="pt-2 text-xs text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" />
                                        Total is calculated as hourlyRate × duration / 60.
                                    </div>
                                </div>
                            </div>

                            <div className="h-2" />
                        </div>
                    </ScrollArea>
                </div>

                {/* Footer (fixed) */}
                <div className="shrink-0 border-t border-border bg-background px-4 py-3 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => onOpenChange(false)}
                            disabled={busy}
                        >
                            Close
                        </Button>

                        <Button
                            type="button"
                            className="rounded-xl"
                            onClick={handleSubmit}
                            disabled={!canSubmit || busy}
                        >
                            {busy ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scheduling…
                                </>
                            ) : (
                                "Confirm booking"
                            )}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
