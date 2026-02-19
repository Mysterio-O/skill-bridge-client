"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function UserStatusDialog({
    open,
    onOpenChange,
    mode,
    userName,
    loading,
    banReason,
    setBanReason,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    mode: "ban" | "unban";
    userName: string;
    loading?: boolean;
    banReason: string;
    setBanReason: (v: string) => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "ban" ? "Ban user" : "Unban user"} — {userName}
                    </DialogTitle>
                </DialogHeader>

                {mode === "ban" ? (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Optionally add a reason. This will be stored in the user record.
                        </p>
                        <Textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Ban reason (optional)"
                            className="min-h-[110px]"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        This will remove banned status and allow the user to access the platform again.
                    </p>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={mode === "ban" ? "destructive" : "default"}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : mode === "ban" ? "Ban" : "Unban"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
