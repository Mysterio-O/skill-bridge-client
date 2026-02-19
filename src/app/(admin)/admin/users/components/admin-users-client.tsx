"use client";

import React, { useMemo, useState, useTransition } from "react";
import type { AdminUserDTO, GetUsersResult } from "../types";
import { getAdminUsersAction, updateAdminUserStatusAction } from "../actions";

import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserStatusDialog from "./user-status-dialog";

function fmtDate(v?: string | null) {
    if (!v) return "—";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}

export default function AdminUsersClient({
    initial,
    initialSearch = "",
    initialPage = 1,
    initialLimit = 10,
}: {
    initial: GetUsersResult;
    initialSearch?: string;
    initialPage?: number;
    initialLimit?: number;
}) {
    const [pending, startTransition] = useTransition();

    const [users, setUsers] = useState<AdminUserDTO[]>(initial.users);
    const [meta, setMeta] = useState(initial.meta);

    const [search, setSearch] = useState(initialSearch);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    // dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"ban" | "unban">("ban");
    const [activeUser, setActiveUser] = useState<AdminUserDTO | null>(null);
    const [banReason, setBanReason] = useState("");

    const canPrev = meta?.hasPrev;
    const canNext = meta?.hasNext;

    const headerStats = useMemo(() => {
        const total = meta?.total ?? 0;
        const banned = users.filter((u) => u.status === "banned").length;
        const active = users.filter((u) => u.status !== "banned").length;
        return { total, banned, active };
    }, [meta, users]);

    function load(next: { page?: number; limit?: number; search?: string }) {
        const nextPage = next.page ?? page;
        const nextLimit = next.limit ?? limit;
        const nextSearch = next.search ?? search;

        startTransition(async () => {
            const t = toast({ title: "Loading users...", description: "Please wait." });

            try {
                const result = await getAdminUsersAction({
                    page: nextPage,
                    limit: nextLimit,
                    search: nextSearch.trim() || undefined,
                });

                t.dismiss();
                setUsers(result.users);
                setMeta(result.meta);
                setPage(nextPage);
                setLimit(nextLimit);
            } catch (e) {
                t.dismiss();
                toast({
                    title: "Failed to load users",
                    description: e instanceof Error ? e.message : "Something went wrong.",
                    variant: "destructive",
                });
            }
        });
    }

    function onSearchSubmit(e?: React.FormEvent) {
        e?.preventDefault();
        load({ page: 1, search });
    }

    function openBan(u: AdminUserDTO) {
        setActiveUser(u);
        setDialogMode("ban");
        setBanReason("");
        setDialogOpen(true);
    }

    function openUnban(u: AdminUserDTO) {
        setActiveUser(u);
        setDialogMode("unban");
        setBanReason("");
        setDialogOpen(true);
    }

    function confirmStatusChange() {
        if (!activeUser) return;

        const targetStatus = dialogMode === "ban" ? "banned" : "active";

        // optimistic update
        const prevUsers = users;
        setUsers((p) =>
            p.map((u) =>
                u.id === activeUser.id
                    ? {
                        ...u,
                        status: targetStatus,
                        bannedAt: dialogMode === "ban" ? new Date().toISOString() : null,
                        banReason: dialogMode === "ban" ? (banReason.trim() || null) : null,
                    }
                    : u
            )
        );

        startTransition(async () => {
            const t = toast({
                title: dialogMode === "ban" ? "Banning user..." : "Unbanning user...",
                description: "Applying changes.",
            });

            try {
                const updated = await updateAdminUserStatusAction({
                    userId: activeUser.id,
                    status: targetStatus,
                    banReason: banReason.trim() || undefined,
                });

                t.dismiss();
                toast({
                    title: "Success",
                    description: dialogMode === "ban" ? "User has been banned." : "User has been unbanned.",
                });

                // sync the row with backend truth
                setUsers((p) => p.map((u) => (u.id === updated.id ? updated : u)));
                setDialogOpen(false);
            } catch (e) {
                t.dismiss();
                // rollback optimistic update
                setUsers(prevUsers);

                toast({
                    title: "Action failed",
                    description: e instanceof Error ? e.message : "Something went wrong.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <div className="space-y-6 p-2">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage all users. Ban/unban access from here.
                    </p>
                </div>

                <div className="grid grid-cols-3 overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="px-3 py-2 text-center">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Total</p>
                        <p className="text-sm font-semibold tabular-nums">{headerStats.total}</p>
                    </div>
                    <div className="border-l px-3 py-2 text-center">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Active</p>
                        <p className="text-sm font-semibold tabular-nums">{headerStats.active}</p>
                    </div>
                    <div className="border-l px-3 py-2 text-center">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Banned</p>
                        <p className="text-sm font-semibold tabular-nums">{headerStats.banned}</p>
                    </div>
                </div>
            </div>

            <Card className="rounded-2xl">
                <CardHeader className="space-y-3">
                    <CardTitle className="text-base">All users</CardTitle>

                    <form onSubmit={onSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, phone, bio..."
                            className="sm:max-w-[420px]"
                        />
                        <div className="flex gap-2">
                            <Button type="submit" disabled={pending}>
                                Search
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={pending}
                                onClick={() => {
                                    setSearch("");
                                    load({ page: 1, search: "" });
                                }}
                            >
                                Reset
                            </Button>
                        </div>

                        <div className="sm:ml-auto flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Per page</span>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value || 10))}
                                className="h-9 w-[90px]"
                            />
                            <Button type="button" variant="outline" disabled={pending} onClick={() => load({ page: 1, limit })}>
                                Apply
                            </Button>
                        </div>
                    </form>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="whitespace-nowrap">User</TableHead>
                                    <TableHead className="whitespace-nowrap">Role</TableHead>
                                    <TableHead className="whitespace-nowrap">Status</TableHead>
                                    <TableHead className="whitespace-nowrap">Banned At</TableHead>
                                    <TableHead className="whitespace-nowrap">Created</TableHead>
                                    <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell className="min-w-[260px]">
                                                <div className="space-y-0.5">
                                                    <p className="font-medium leading-none">{u.name}</p>
                                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                                    {u.phone ? <p className="text-xs text-muted-foreground">{u.phone}</p> : null}
                                                </div>
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap">
                                                <Badge variant="secondary">{u.role ?? "student"}</Badge>
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap">
                                                {u.status === "banned" ? (
                                                    <Badge variant="destructive">Banned</Badge>
                                                ) : (
                                                    <Badge variant="default">Active</Badge>
                                                )}
                                                {u.status === "banned" && u.banReason ? (
                                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                                        Reason: {u.banReason}
                                                    </p>
                                                ) : null}
                                            </TableCell>

                                            <TableCell className="whitespace-nowrap">{fmtDate(u.bannedAt)}</TableCell>
                                            <TableCell className="whitespace-nowrap">{fmtDate(u.createdAt)}</TableCell>

                                            <TableCell className="text-right whitespace-nowrap">
                                                {u.status === "banned" ? (
                                                    <Button size="sm" variant="outline" disabled={pending} onClick={() => openUnban(u)}>
                                                        Unban
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="destructive" disabled={pending} onClick={() => openBan(u)}>
                                                        Ban
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                            Page {meta.page} of {meta.totalPages} • Total {meta.total}
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                disabled={pending || !canPrev}
                                onClick={() => load({ page: Math.max(1, page - 1) })}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                disabled={pending || !canNext}
                                onClick={() => load({ page: page + 1 })}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <UserStatusDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={dialogMode}
                userName={activeUser?.name ?? "User"}
                loading={pending}
                banReason={banReason}
                setBanReason={setBanReason}
                onConfirm={confirmStatusChange}
            />
        </div>
    );
}
