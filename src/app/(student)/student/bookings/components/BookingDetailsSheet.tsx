"use client";

import * as React from "react";
import { Booking } from "../types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from "lucide-react";

function formatDT(dt: string | null | undefined) {
    if (!dt) return "-";
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return dt;
    return d.toLocaleString();
}

function safe(v:unknown) {
    if (v === null || v === undefined || v === "") return "-";
    return String(v);
}

export default function BookingDetailsSheet({
    booking,
    onClose,
}: {
    booking: Booking | null;
    onClose: () => void;
}) {
    const open = !!booking;

    async function copy(text: string) {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
        }
    }

    if (!booking) return null;

    const tutor = booking.tutorProfile?.user;
    const student = booking.student;

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent
                // responsive: full width on mobile, right panel on larger screens
                side="right"
                className="w-full sm:max-w-xl p-0"
            >
                <SheetHeader className="px-6 py-4 border-b bg-background/60 backdrop-blur">
                    <SheetTitle className="flex items-center justify-between gap-3">
                        <span>Booking Details</span>
                        <Badge variant="secondary" className="capitalize">
                            {booking.status.replace("_", " ")}
                        </Badge>
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        ID: <span className="text-foreground font-medium">{booking.id}</span>
                    </p>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-90px)]">
                    <div className="p-6 space-y-6">
                        {/* Quick actions */}
                        <div className="flex flex-wrap gap-2">
                            {booking.meetingLink ? (
                                <Button asChild className="gap-2">
                                    <a href={booking.meetingLink} target="_blank" rel="noreferrer">
                                        Join Meeting <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                            ) : (
                                <Button variant="secondary" disabled>
                                    No Meeting Link
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => copy(booking.id)}
                            >
                                <Copy className="h-4 w-4" />
                                Copy Booking ID
                            </Button>
                        </div>

                        {/* Booking Info */}
                        <Section title="Booking">
                            <Grid>
                                <Item label="Topic" value={safe(booking.topic)} />
                                <Item label="Timezone" value={safe(booking.timezone)} />
                                <Item label="Created At" value={formatDT(booking.createdAt)} />
                                <Item label="Updated At" value={formatDT(booking.updatedAt)} />
                                <Item label="Completed At" value={formatDT(booking.completedAt)} />
                                <Item label="Cancel Reason" value={safe(booking.cancelReason)} />
                                <Item label="Cancelled By" value={safe(booking.cancelled_by)} />
                            </Grid>
                        </Section>

                        {/* Schedule */}
                        <Section title="Schedule">
                            <Grid>
                                <Item label="Start" value={formatDT(booking.startAt)} />
                                <Item label="End" value={formatDT(booking.endAt)} />
                                <Item label="Duration" value={`${booking.durationMinutes} minutes`} />
                            </Grid>
                        </Section>

                        {/* Pricing */}
                        <Section title="Pricing">
                            <div className="rounded-xl border bg-muted/30 p-4">
                                <Grid>
                                    <Item label="Currency" value={safe(booking.currency)} />
                                    <Item label="Hourly Rate Snapshot" value={safe(booking.hourlyRateSnapshot)} />
                                    <Item label="Total Price" value={`${booking.currency} ${booking.totalPrice}`} />
                                </Grid>
                            </div>
                        </Section>

                        {/* Tutor */}
                        <Section title="Tutor">
                            <div className="rounded-xl border bg-background/60 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-lg font-semibold text-foreground truncate">
                                            {safe(tutor?.name)}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {safe(tutor?.email)}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            Phone: {safe(tutor?.phone)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Tutor Profile</p>
                                        <p className="text-sm font-medium text-foreground">
                                            {safe(booking.tutorProfile?.id)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <InfoCard label="Headline" value={safe(booking.tutorProfile?.headline)} />
                                    <InfoCard label="Education" value={safe(booking.tutorProfile?.education)} />
                                    <InfoCard label="Certification" value={safe(booking.tutorProfile?.certification)} />
                                    <InfoCard label="Languages" value={(booking.tutorProfile?.languages?.length ? booking.tutorProfile.languages.join(", ") : "-")} />
                                    <InfoCard label="Session Mode" value={safe(booking.tutorProfile?.sessionMode)} />
                                    <InfoCard label="Meeting Platform" value={safe(booking.tutorProfile?.meetingPlatform)} />
                                    <InfoCard label="Availability" value={safe(booking.tutorProfile?.availability)} />
                                    <InfoCard label="Profile Status" value={safe(booking.tutorProfile?.status)} />
                                    <InfoCard label="Avg Rating" value={safe(booking.tutorProfile?.avgRating)} />
                                    <InfoCard label="Review Count" value={safe(booking.tutorProfile?.reviewCount)} />
                                    <InfoCard label="Years Experience" value={safe(booking.tutorProfile?.yearsOfExperience)} />
                                    <InfoCard label="Tutor Timezone" value={safe(booking.tutorProfile?.timezone)} />
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm font-medium text-foreground mb-1">About</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {safe(booking.tutorProfile?.about)}
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {/* Student */}
                        <Section title="Student">
                            <div className="rounded-xl border bg-background/60 p-4">
                                <Grid>
                                    <Item label="Name" value={safe(student?.name)} />
                                    <Item label="Email" value={safe(student?.email)} />
                                    <Item label="Phone" value={safe(student?.phone)} />
                                    <Item label="Student ID" value={safe(booking.studentId)} />
                                </Grid>
                            </div>
                        </Section>

                        {/* Review */}
                        <Section title="Review">
                            <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                                {booking.review ? (
                                    <pre className="whitespace-pre-wrap break-words text-foreground">
                                        {JSON.stringify(booking.review, null, 2)}
                                    </pre>
                                ) : (
                                    <p>No review yet.</p>
                                )}
                            </div>
                        </Section>

                        {/* Meeting */}
                        <Section title="Meeting">
                            <Grid>
                                <Item label="Meeting Link" value={booking.meetingLink ? booking.meetingLink : "-"} />
                            </Grid>

                            {booking.meetingLink && (
                                <div className="mt-2 flex gap-2">
                                    <Button variant="outline" className="gap-2" onClick={() => copy(booking.meetingLink!)}>
                                        <Copy className="h-4 w-4" />
                                        Copy Link
                                    </Button>
                                    <Button asChild className="gap-2">
                                        <a href={booking.meetingLink} target="_blank" rel="noreferrer">
                                            Open Link <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </Section>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {children}
        </div>
    );
}

function Grid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Item({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-background/60 p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground break-words">{value}</p>
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground break-words">{value}</p>
        </div>
    );
}
