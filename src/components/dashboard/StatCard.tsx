import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({
    icon,
    label,
    value,
    hint,
    className,
}: {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
    hint?: string;
    className?: string;
}) {
    return (
        <Card
            className={cn(
                "rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur",
                "dark:border-slate-800/70 dark:bg-white/5",
                className
            )}
        >
            <CardContent className="flex items-center gap-3 p-5">
                {icon ? (
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/70 bg-slate-50 dark:border-slate-800/70 dark:bg-white/5">
                        {icon}
                    </div>
                ) : null}

                <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {label}
                    </div>
                    <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        {value}
                    </div>
                    {hint ? (
                        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {hint}
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}
