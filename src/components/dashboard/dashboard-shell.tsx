import * as React from "react";
import { cn } from "@/lib/utils";

export function DashboardShell({
    title,
    description,
    right,
    children,
    className,
}: {
    title: string;
    description?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                // Light: soft blue tint
                // Dark: deep navy
                "min-h-[calc(100vh-4rem)] w-full",
                "bg-gradient-to-b from-sky-50/70 to-white dark:from-[#050B14] dark:to-[#040910]",
                className
            )}
        >
            <div className="mx-auto w-full px-4 py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    {right ? <div className="shrink-0">{right}</div> : null}
                </div>

                <div className="mt-2">{children}</div>
            </div>
        </div>
    );
}
