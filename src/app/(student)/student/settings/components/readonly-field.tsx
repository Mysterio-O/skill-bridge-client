import React from "react";
import { cn } from "@/lib/utils";

export default function ReadonlyField({
    label,
    value,
    className,
}: {
    label: string;
    value?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("space-y-1", className)}>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                {value ?? <span className="text-muted-foreground">—</span>}
            </div>
        </div>
    );
}
