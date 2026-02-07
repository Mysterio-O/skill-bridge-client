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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import type { TutorApplication } from "../types";
import StatusBadge from "./StatusBadge";
import {
    adminDeleteTutorApplication,
    adminUpdateTutorApplicationStatus,
} from "../actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

function initials(nameOrEmail: string) {
    const s = (nameOrEmail || "").trim();
    if (!s) return "U";
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

export default function ApplicationDetailsSheet({
    open,
    onOpenChange,
    application,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    application: TutorApplication | null;
}) {
    const router = useRouter();
    const [busy, setBusy] = React.useState<null | "approve" | "cancel" | "delete">(
        null
    );

    const canDelete =
        application?.status === "pending" || application?.status === "cancelled";

    async function run(action: "approve" | "cancel" | "delete") {
        if (!application) return;

        const label =
            action === "approve"
                ? "Approving..."
                : action === "cancel"
                    ? "Cancelling..."
                    : "Deleting...";

        const t = toast({ title: label, description: "Please wait a moment." });

        try {
            setBusy(action);

            if (action === "approve") {
                const res = await adminUpdateTutorApplicationStatus({
                    applicationId: application.id,
                    status: "active",
                });

                if (res?.success) {
                    t.update({
                        title: "Approved",
                        description: "Tutor application has been approved.",
                    });
                    onOpenChange(false);
                    router.refresh();
                } else {
                    t.update({
                        title: "Failed",
                        description: res?.message || "Failed to approve application.",
                        variant: "destructive",
                    });
                }
                return;
            }

            if (action === "cancel") {
                const res = await adminUpdateTutorApplicationStatus({
                    applicationId: application.id,
                    status: "cancelled",
                });

                if (res?.success) {
                    t.update({
                        title: "Cancelled",
                        description: "Tutor application has been cancelled.",
                    });
                    onOpenChange(false);
                    router.refresh();
                } else {
                    t.update({
                        title: "Failed",
                        description: res?.message || "Failed to cancel application.",
                        variant: "destructive",
                    });
                }
                return;
            }

            // delete
            if (!canDelete) {
                t.update({
                    title: "Not allowed",
                    description: "Only pending/cancelled applications can be deleted.",
                    variant: "destructive",
                });
                return;
            }

            const res = await adminDeleteTutorApplication({
                applicationId: application.id,
            });

            if (res?.success) {
                t.update({
                    title: "Deleted",
                    description: "Application has been deleted.",
                });
                onOpenChange(false);
                router.refresh();
            } else {
                t.update({
                    title: "Failed",
                    description: res?.message || "Failed to delete application.",
                    variant: "destructive",
                });
            }
        } catch (e) {
            t.update({
                title: "Action failed",
                description: (e instanceof Error) ? e?.message : "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setBusy(null);
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className={[
                    "w-[100vw] sm:w-[520px] sm:max-w-[520px]",
                    "h-[100dvh] flex flex-col",
                    "p-6",
                    "overflow-hidden",
                ].join(" ")}
            >
                {!application ? null : (
                    <>
                        <div className="shrink-0">
                            <SheetHeader>
                                <SheetTitle className="flex items-center justify-between gap-3">
                                    <span className="truncate">Application Details</span>
                                    <StatusBadge status={application.status} />
                                </SheetTitle>
                                <SheetDescription className="text-muted-foreground">
                                    Review profile details and take action.
                                </SheetDescription>
                            </SheetHeader>
                        </div>

                        <div className="min-h-0 flex-1 pt-4">
                            <ScrollArea className="h-full pr-2">
                                <div className="space-y-4 pb-6">
                                    {/* user header */}
                                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={application.user.image || ""} />
                                            <AvatarFallback>
                                                {initials(application.user.name || application.user.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-foreground">
                                                {application.user.name || application.user.email}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {application.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* quick info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-border p-3">
                                            <p className="text-xs text-muted-foreground">Rate</p>
                                            <p className="font-medium text-foreground">
                                                {application.hourlyRate}{" "}
                                                <span className="text-muted-foreground">
                                                    {application.currency}/hr
                                                </span>
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border p-3">
                                            <p className="text-xs text-muted-foreground">Experience</p>
                                            <p className="font-medium text-foreground">
                                                {application.yearsOfExperience ?? 0} year(s)
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border p-3">
                                            <p className="text-xs text-muted-foreground">Mode</p>
                                            <p className="font-medium text-foreground">
                                                {application.sessionMode}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border p-3">
                                            <p className="text-xs text-muted-foreground">Platform</p>
                                            <p className="font-medium text-foreground">
                                                {application.meetingPlatform}
                                            </p>
                                        </div>
                                    </div>

                                    {/* headline/about */}
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Headline</p>
                                            <p className="text-sm text-foreground">
                                                {application.headline || "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">About</p>
                                            <p className="text-sm text-foreground whitespace-pre-line">
                                                {application.about || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* subjects */}
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">Subjects</p>
                                        <div className="flex flex-wrap gap-2">
                                            {application.subjects?.length ? (
                                                application.subjects.map((s) => (
                                                    <Badge
                                                        key={s.id}
                                                        variant="secondary"
                                                        className="bg-muted text-foreground"
                                                    >
                                                        <span className="mr-1">{s.category.icon ?? "•"}</span>
                                                        {s.category.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* extras */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-border p-3">
                                            <p className="text-xs text-muted-foreground">Timezone</p>
                                            <p className="text-sm text-foreground">
                                                {application.timezone || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border p-3">
                                            <p className="text-xs text-muted-foreground">Availability</p>
                                            <p className="text-sm text-foreground">
                                                {application.availability}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border p-3 sm:col-span-2">
                                            <p className="text-xs text-muted-foreground">Languages</p>
                                            <p className="text-sm text-foreground">
                                                {application.languages?.join(", ") || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border p-3 sm:col-span-2">
                                            <p className="text-xs text-muted-foreground">Education</p>
                                            <p className="text-sm text-foreground">
                                                {application.education || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-border p-3 sm:col-span-2">
                                            <p className="text-xs text-muted-foreground">Certification</p>
                                            <p className="text-sm text-foreground">
                                                {application.certification || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="shrink-0 pt-4 border-t border-border">
                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={() => run("approve")}
                                    disabled={!!busy}
                                >
                                    {busy === "approve" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4" />
                                    )}
                                    Approve
                                </Button>

                                <Button
                                    variant="outline"
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={() => run("cancel")}
                                    disabled={!!busy}
                                >
                                    {busy === "cancel" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <XCircle className="h-4 w-4" />
                                    )}
                                    Cancel
                                </Button>

                                <Button
                                    variant="destructive"
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={() => run("delete")}
                                    disabled={!!busy || !canDelete}
                                    title={
                                        canDelete
                                            ? "Delete application"
                                            : "Only pending/cancelled can be deleted"
                                    }
                                >
                                    {busy === "delete" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
