"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { FieldError } from "./Section";

export default function LanguagesInput({
    value,
    onChange,
    error,
}: {
    value: string[];
    onChange: (next: string[]) => void;
    error?: string;
}) {
    const [draft, setDraft] = React.useState("");

    function add() {
        const v = draft.trim();
        if (!v) return;

        const normalized = v.replace(/\s+/g, " ");
        if (value.some((x) => x.toLowerCase() === normalized.toLowerCase())) {
            setDraft("");
            return;
        }

        onChange([...value, normalized].slice(0, 10));
        setDraft("");
    }

    function remove(item: string) {
        onChange(value.filter((x) => x !== item));
    }

    return (
        <div className="rounded-2xl border bg-background/40 p-4">
            <Label className="text-xs text-muted-foreground">Languages</Label>

            <div className="mt-2 flex gap-2">
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a language (e.g., English) and press Enter"
                    className="rounded-2xl"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            add();
                        }
                    }}
                />
                <Button type="button" onClick={add} className="rounded-2xl" variant="secondary">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <FieldError msg={error} />

            <div className="mt-3 flex flex-wrap gap-2">
                {value.length ? (
                    value.map((l) => (
                        <Badge key={l} variant="outline" className="rounded-2xl">
                            {l}
                            <button
                                type="button"
                                className="ml-2 inline-flex items-center justify-center rounded-full hover:opacity-80"
                                onClick={() => remove(l)}
                                aria-label={`Remove ${l}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    ))
                ) : (
                    <Badge variant="outline" className="rounded-2xl">
                        No languages added
                    </Badge>
                )}
            </div>
        </div>
    );
}
