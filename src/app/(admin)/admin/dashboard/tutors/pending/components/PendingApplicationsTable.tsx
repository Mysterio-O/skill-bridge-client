"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PendingAppsResponse, TutorApplication } from "../types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Search } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ApplicationDetailsSheet from "./ApplicationDetailsSheet";

function initials(nameOrEmail: string) {
    const s = (nameOrEmail || "").trim();
    if (!s) return "U";
    const parts = s.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

export default function PendingApplicationsTable({ initial }: { initial: PendingAppsResponse }) {
    const router = useRouter();
    const sp = useSearchParams();

    const [selected, setSelected] = React.useState<TutorApplication | null>(null);
    const [open, setOpen] = React.useState(false);

    const page = Number(sp.get("page") ?? initial.meta.page ?? 1);
    const limit = Number(sp.get("limit") ?? initial.meta.limit ?? 10);
    const search = sp.get("search") ?? "";

    const [q, setQ] = React.useState(search);

    // debounce for URL update (server will refetch)
    React.useEffect(() => {
        const t = setTimeout(() => {
            const next = new URLSearchParams(sp.toString());
            if (q.trim()) next.set("search", q.trim());
            else next.delete("search");
            next.set("page", "1");
            router.replace(`?${next.toString()}`);
        }, 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    const rows = initial.data;

    function goTo(nextPage: number) {
        const next = new URLSearchParams(sp.toString());
        next.set("page", String(nextPage));
        next.set("limit", String(limit));
        router.replace(`?${next.toString()}`);
    }

    return (
        <>
            <Card className="border-border bg-background overflow-hidden">
                <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-[360px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search name, email, headline, subject…"
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                            {initial.meta.total} total • Page {initial.meta.page}/{initial.meta.totalPages}
                        </span>
                    </div>
                </div>

                {/* compact table */}
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40">
                            <TableHead className="w-[280px]">Tutor</TableHead>
                            <TableHead className="hidden md:table-cell">Headline</TableHead>
                            <TableHead className="w-[120px]">Rate</TableHead>
                            <TableHead className="w-[140px]">Subjects</TableHead>
                            <TableHead className="w-[110px]">Status</TableHead>
                            <TableHead className="w-[44px]" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                    No pending applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((app) => {
                                const name = app.user?.name || app.user.email;
                                const primarySubject = app.subjects?.[0]?.category?.name;
                                const restCount = Math.max(0, (app.subjects?.length ?? 0) - 1);

                                return (
                                    <TableRow
                                        key={app.id}
                                        className="cursor-pointer hover:bg-muted/30"
                                        onClick={() => {
                                            setSelected(app);
                                            setOpen(true);
                                        }}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={app.user.image || ""} alt={name} />
                                                    <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-foreground">{name}</p>
                                                    <p className="truncate text-xs text-muted-foreground">{app.user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden md:table-cell">
                                            <p className="truncate text-sm text-foreground/90">{app.headline || "—"}</p>
                                        </TableCell>

                                        <TableCell className="text-sm">
                                            <span className="font-medium text-foreground">{app.hourlyRate}</span>{" "}
                                            <span className="text-muted-foreground">{app.currency}</span>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                {primarySubject ? (
                                                    <Badge variant="secondary" className="bg-muted text-foreground">
                                                        {primarySubject}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                                {restCount > 0 ? (
                                                    <Badge variant="outline" className="border-border text-muted-foreground">
                                                        +{restCount}
                                                    </Badge>
                                                ) : null}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <StatusBadge status={app.status} />
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {/* footer */}
                <div className="flex items-center justify-between border-t border-border p-3">
                    <p className="text-xs text-muted-foreground">
                        Showing {rows.length} • Limit {limit}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goTo(Math.max(1, page - 1))}
                            disabled={!initial.meta.hasPrev}
                        >
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goTo(page + 1)}
                            disabled={!initial.meta.hasNext}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            <ApplicationDetailsSheet
                open={open}
                onOpenChange={setOpen}
                application={selected}
            />
        </>
    );
}
