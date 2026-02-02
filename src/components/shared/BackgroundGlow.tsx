import React from "react";
import { cn } from "@/lib/utils";

export default function BackgroundGlow({
    className,
}: {
    className?: string;
}) {
    return (
        <div
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden",
                className
            )}
        >
            {/* top glow */}
            <div className="absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl [background:radial-gradient(circle_at_center,var(--glow-1),transparent_60%)]" />

            {/* right glow */}
            <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full blur-3xl [background:radial-gradient(circle_at_center,var(--glow-2),transparent_60%)]" />

            {/* bottom glow */}
            <div className="absolute -bottom-44 left-[-160px] h-[560px] w-[560px] rounded-full blur-3xl [background:radial-gradient(circle_at_center,var(--glow-3),transparent_60%)]" />

            {/* subtle vignette */}
            <div className="absolute inset-0 opacity-70 [background:linear-gradient(to_bottom,transparent,oklch(0_0_0/0.06))] dark:opacity-90 dark:[background:linear-gradient(to_bottom,transparent,oklch(0_0_0/0.35))]" />
        </div>
    );
}
