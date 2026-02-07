"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { FieldError } from "./Section";
import type { Category } from "../lib/types";
import { Check } from "lucide-react";

function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function SubjectsPicker({
    categories,
    value,
    onChange,
    error,
}: {
    categories: Category[];
    value: string[];
    onChange: (next: string[]) => void;
    error?: string;
}) {
    const uid = React.useId();

    const toggle = React.useCallback(
        (rawId: string) => {
            const id = String(rawId); // safety if backend sends number-like ids
            const isOn = value.includes(id);

            const next = isOn ? value.filter((x) => x !== id) : [...value, id];

            // optional: keep stable order (prevents jitter)
            // next.sort();

            onChange(next);
        },
        [value, onChange]
    );

    return (
        <div className="rounded-2xl border bg-background/40 p-4">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Subjects</Label>
                <span className="text-xs text-muted-foreground">{value.length} selected</span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((c) => {
                    const id = String(c.id);
                    const checked = value.includes(id);
                    const inputId = `${uid}-subject-${id}`;

                    return (
                        <label
                            key={id}
                            htmlFor={inputId}
                            className={cx(
                                "group cursor-pointer select-none text-left rounded-2xl border p-3 transition outline-none",
                                "bg-card/55 backdrop-blur",
                                "focus-within:ring-2 focus-within:ring-primary/20",
                                checked
                                    ? "border-primary/40 ring-1 ring-primary/15"
                                    : "hover:border-border/80"
                            )}
                        >
                            {/* Native checkbox (no Radix Presence) */}
                            <input
                                id={inputId}
                                type="checkbox"
                                className="peer sr-only"
                                checked={checked}
                                onChange={() => toggle(c.id)}
                            />

                            <div className="flex items-start gap-3">
                                {/* Visual checkbox */}
                                <span
                                    className={cx(
                                        "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md border transition",
                                        "bg-background/70",
                                        "peer-checked:border-primary/40 peer-checked:bg-primary/10"
                                    )}
                                    aria-hidden="true"
                                >
                                    <Check className={cx("h-3.5 w-3.5 transition", checked ? "opacity-100" : "opacity-0")} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="truncate text-sm font-medium text-foreground">
                                            <span className="mr-1">{c.icon ?? ""}</span>
                                            {c.name}
                                        </div>

                                        {checked ? (
                                            <Badge variant="secondary" className="rounded-2xl text-xs">
                                                Selected
                                            </Badge>
                                        ) : null}
                                    </div>

                                    {c.description ? (
                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                                    ) : (
                                        <p className="mt-1 text-xs text-muted-foreground">—</p>
                                    )}
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>

            <FieldError msg={error} />
        </div>
    );
}
