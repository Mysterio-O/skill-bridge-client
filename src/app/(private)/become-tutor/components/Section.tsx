import * as React from "react";

export function Section({
    title,
    hint,
    children,
}: {
    title: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-6">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-sm font-medium text-foreground">{title}</h2>
                    {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
                </div>
            </div>
            <div className="mt-3">{children}</div>
        </div>
    );
}

export function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="mt-1 text-xs text-destructive">{msg}</p>;
}
