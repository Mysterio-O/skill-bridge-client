"use client";

import * as React from "react";
import { Booking } from "../types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check, X, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { updateBookingStatus } from "../actions";

function formatDT(dt: string | null | undefined) {
    if (!dt) return "-";
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return dt;
    return d.toLocaleString();
}

function safe(v: unknown) {
    if (v === null || v === undefined || v === "") return "-";
    return String(v);
}

export default function TutorBookingDetailsSheet({
    booking,
    onClose,
    onBookingUpdated,
}: {
    booking: Booking | null;
    onClose: () => void;
    onBookingUpdated: (patch: Partial<Booking> & { id: string }) => void;
}) {
    const open = !!booking;
    const [busy, setBusy] = React.useState<null | "accept" | "reject" | "complete">(null);

    if (!booking) return null;

    const tutor = booking.tutorProfile?.user;
    const student = booking.student;

    async function copy(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: "Copied", description: "Copied to clipboard." });
        } catch {
            toast({ title: "Copy failed", description: "Could not copy.", variant: "destructive" });
        }
    }

    async function run(action: "accept" | "reject" | "complete") {
        const t = toast({ title: "Please wait...", description: "Processing..." });
        if (!booking) return;
        try {
            setBusy(action);

            const nextStatus =
                action === "accept" ? "confirmed" :
                    action === "reject" ? "rejected" :
                        "completed";

            await updateBookingStatus({
                bookingId: booking.id,
                status: nextStatus,
            });

            onBookingUpdated({
                id: booking.id,
                status: nextStatus,
                updatedAt: new Date().toISOString(),
                ...(nextStatus === "completed" ? { completedAt: new Date().toISOString() } : {}),
            });

            t.update({ title: "Success", description: `Updated to ${nextStatus}.` });
        } catch (e) {
            t.update({
                title: "Action failed",
                description: e instanceof Error ? e.message : "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setBusy(null);
        }
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0">
                <SheetHeader className="px-6 py-4 border-b bg-background/60 backdrop-blur">
                    <SheetTitle className="flex items-center justify-between gap-3">
                        <span>Booking Details</span>
                        <Badge variant="secondary" className="capitalize">
                            {booking.status.replaceAll("_", " ")}
                        </Badge>
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        ID: <span className="text-foreground font-medium">{booking.id}</span>
                    </p>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-90px)]">
                    <div className="p-6 space-y-6">
                        {/* Actions */}
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

                            <Button variant="outline" className="gap-2" onClick={() => copy(booking.id)}>
                                <Copy className="h-4 w-4" />
                                Copy Booking ID
                            </Button>

                            {booking.status === "pending" && (
                                <>
                                    <Button onClick={() => run("accept")} disabled={!!busy} className="gap-2">
                                        {busy === "accept" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Accept
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="gap-2 border-destructive"
                                        onClick={() => run("reject")}
                                        disabled={!!busy}
                                    >
                                        {busy === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                        Reject
                                    </Button>
                                </>
                            )}

                            {booking.status === "confirmed" && (
                                <Button
                                    variant="outline"
                                    className="gap-2 border-primary"
                                    onClick={() => run("complete")}
                                    disabled={!!busy}
                                >
                                    {busy === "complete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Mark completed
                                </Button>
                            )}
                        </div>

                        {/* Booking info */}
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

                        <Section title="Schedule">
                            <Grid>
                                <Item label="Start" value={formatDT(booking.startAt)} />
                                <Item label="End" value={formatDT(booking.endAt)} />
                                <Item label="Duration" value={`${booking.durationMinutes} minutes`} />
                            </Grid>
                        </Section>

                        <Section title="Pricing">
                            <div className="rounded-xl border bg-muted/30 p-4">
                                <Grid>
                                    <Item label="Currency" value={safe(booking.currency)} />
                                    <Item label="Hourly Rate Snapshot" value={safe(booking.hourlyRateSnapshot)} />
                                    <Item label="Total Price" value={`${booking.currency} ${booking.totalPrice}`} />
                                </Grid>
                            </div>
                        </Section>

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

                        <Section title="Tutor">
                            <div className="rounded-xl border bg-background/60 p-4">
                                <Grid>
                                    <Item label="Name" value={safe(tutor?.name)} />
                                    <Item label="Email" value={safe(tutor?.email)} />
                                    <Item label="Phone" value={safe(tutor?.phone)} />
                                    <Item label="Tutor Profile ID" value={safe(booking.tutorProfile?.id)} />
                                </Grid>
                            </div>
                        </Section>

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
