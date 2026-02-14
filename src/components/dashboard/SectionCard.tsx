import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SectionCard({
    title,
    children,
    right,
}: {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <Card className="rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {title}
                </CardTitle>
                {right ? <div className="shrink-0">{right}</div> : null}
            </CardHeader>
            <CardContent className="pt-0">{children}</CardContent>
        </Card>
    );
}
