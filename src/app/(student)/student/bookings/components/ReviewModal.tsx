"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { postReview } from "../actions";
import type { Booking } from "../types";

function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function clampRating(n: number) {
    if (n < 1) return 1;
    if (n > 5) return 5;
    return n;
}

export default function ReviewModal({
    open,
    onOpenChange,
    booking,
    onSubmitted,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    booking: Booking | null;
    onSubmitted: (patch: Partial<Booking> & { id: string }) => void;
}) {
    const [rating, setRating] = React.useState<number>(5);
    const [comment, setComment] = React.useState<string>("");
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!open) return;
        setRating(5);
        setComment("");
    }, [open, booking?.id]);

    const tutorName = booking?.tutorProfile?.user?.name || "Tutor";
    const topic = booking?.topic || "General Session";

    async function handleSubmit() {
        if (!booking) return;

        const t = toast({ title: "Submitting review...", description: "Please wait a moment." });

        try {
            setSubmitting(true);

            const cleanRating = clampRating(rating);
            const res = await postReview({
                tutorId:booking.tutorProfile.userId,
                bookingId: booking.id,
                rating: cleanRating,
                comment,
            });

            const createdReview = res?.data?.review ?? null;

            onSubmitted({
                id: booking.id,
                review: createdReview ?? {
                    rating: cleanRating,
                    comment: comment?.trim() || null,
                    createdAt: new Date().toISOString(),
                },
            });

            t.update({ title: "Review submitted", description: "Thanks! Your review has been posted." });
            onOpenChange(false);
        } catch (e) {
            t.update({
                title: "Failed",
                description: e instanceof Error ? e.message : "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    }

    function Stars() {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className={cx(
                            "rounded-md p-1 transition",
                            "hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        )}
                        aria-label={`Rate ${n} stars`}
                    >
                        <Star
                            className={cx(
                                "h-5 w-5",
                                n <= rating ? "fill-current text-primary" : "text-muted-foreground"
                            )}
                        />
                    </button>
                ))}

                <span className="ml-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{rating}</span>/5
                </span>
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cx(
                    "sm:max-w-lg p-0 overflow-hidden",
                    "max-h-[85vh] flex flex-col" // key
                )}
            >
                <DialogHeader className="px-6 py-4 border-b bg-background/60 backdrop-blur">
                    <DialogTitle className="flex items-center justify-between gap-3">
                        <span>Submit a Review</span>
                        <Badge variant="secondary" className="capitalize">
                            {booking?.status?.replace?.("_", " ") ?? "booking"}
                        </Badge>
                    </DialogTitle>

                    {booking?.id && (
                        <p className="text-sm text-muted-foreground">
                            Booking ID: <span className="text-foreground font-medium">{booking.id}</span>
                        </p>
                    )}
                </DialogHeader>

                <ScrollArea className="flex-1">
                    <div className="px-6 py-5 space-y-4">
                        <div className="rounded-xl border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">Tutor</p>
                            <p className="text-base font-semibold text-foreground truncate">{tutorName}</p>

                            <p className="mt-2 text-sm text-muted-foreground">Topic</p>
                            <p className="text-sm text-foreground/90 truncate">{topic}</p>
                        </div>

                        <div className="rounded-xl border bg-background/60 p-4">
                            <p className="text-sm font-medium text-foreground mb-2">Rating</p>
                            <Stars />
                        </div>

                        <div className="rounded-xl border bg-background/60 p-4">
                            <p className="text-sm font-medium text-foreground mb-2">Comment (optional)</p>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share what you liked, what could be improved, etc."
                                className="min-h-[120px]"
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                                Keep it clear and helpful.
                            </p>
                        </div>
                        <div className="h-2" />
                    </div>
                </ScrollArea>

                <div className="px-6 py-4 border-t bg-background/60 backdrop-blur">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={submitting || !booking}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Submit Review
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
