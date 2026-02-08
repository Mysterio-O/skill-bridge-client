"use client";

import * as React from "react";
import { Booking, BPagination } from "../types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import BookingDetailsSheet from "./BookingDetailsSheet";

function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function formatDT(dt: string) {
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return dt;
    return d.toLocaleString();
}

export default function StudentBookingsClient({
    initialBookings,
    initialPagination,
}: {
    initialBookings: Booking[];
    initialPagination: BPagination;
}) {
    const [items, setItems] = React.useState<Booking[]>(initialBookings);
    const [pagination, setPagination] = React.useState<BPagination>(initialPagination);

    const [active, setActive] = React.useState<Booking | null>(null);

    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const pageRef = React.useRef(pagination.page);
    const hasNextRef = React.useRef(pagination.hasNext);

    React.useEffect(() => {
        pageRef.current = pagination.page;
        hasNextRef.current = pagination.hasNext;
    }, [pagination]);

    // Debounce search
    const [debounced, setDebounced] = React.useState("");
    React.useEffect(() => {
        const t = setTimeout(() => setDebounced(search.trim()), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Reset list when search changes
    React.useEffect(() => {
        let cancelled = false;

        async function refetchFirstPage() {
            setLoading(true);
            setError(null);

            try {
                const url = new URL("/api/bookings", window.location.origin);
                url.searchParams.set("page", "1");
                url.searchParams.set("page_size", String(initialPagination.page_size));
                if (debounced.length > 0) url.searchParams.set("search", debounced);

                const res = await fetch(url.toString(), { cache: "no-store" });
                const json = await res.json();

                if (!res.ok || !json?.success) {
                    throw new Error(json?.message || "Failed to fetch bookings");
                }

                if (cancelled) return;

                const nextBookings: Booking[] = json.data.bookings ?? [];
                const nextPagination: BPagination = json.data.pagination;

                setItems(nextBookings);
                setPagination(nextPagination);
            } catch (e) {
                if (!cancelled) setError((e instanceof Error) ? e?.message : "Something went wrong");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        // only refetch when user changes search (client)
        refetchFirstPage();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    async function loadMore() {
        if (loading) return;
        if (!hasNextRef.current) return;

        setLoading(true);
        setError(null);

        try {
            const nextPage = pageRef.current + 1;

            const url = new URL("/api/bookings", window.location.origin);
            url.searchParams.set("page", String(nextPage));
            url.searchParams.set("page_size", String(pagination.page_size));
            if (debounced.length > 0) url.searchParams.set("search", debounced);

            const res = await fetch(url.toString(), { cache: "no-store" });
            const json = await res.json();

            if (!res.ok || !json?.success) {
                throw new Error(json?.message || "Failed to fetch bookings");
            }

            const nextBookings: Booking[] = json.data.bookings ?? [];
            const nextPagination: BPagination = json.data.pagination;

            // De-dupe by id (safe)
            setItems((prev) => {
                const map = new Map(prev.map((b) => [b.id, b]));
                for (const b of nextBookings) map.set(b.id, b);
                return Array.from(map.values());
            });

            setPagination(nextPagination);
        } catch (e) {
            setError((e instanceof Error) ? e?.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    // Infinite scroll sentinel
    const sentinelRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first?.isIntersecting) loadMore();
            },
            { root: null, rootMargin: "700px", threshold: 0.01 }
        );

        obs.observe(el);
        return () => obs.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentinelRef.current, debounced, pagination.page_size]);

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tutor/student name, email, phone..."
                        className="pl-9"
                    />
                </div>

                <div className="hidden sm:block text-sm text-muted-foreground">
                    Total: <span className="text-foreground font-medium">{pagination.total}</span>
                </div>
            </div>

            {/* List */}
            {items.length === 0 && !loading ? (
                <div className="rounded-xl border bg-muted/30 p-10 text-center">
                    <p className="text-foreground font-medium">No bookings found</p>
                    <p className="text-sm text-muted-foreground">
                        Try a different search term.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((b) => (
                        <div
                            key={b.id}
                            onClick={() => setActive(b)}
                            className={cx(
                                "cursor-pointer rounded-xl border bg-background/60 backdrop-blur",
                                "p-4 transition hover:bg-accent/40"
                            )}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-foreground truncate">
                                            {b.tutorProfile?.user?.name || "Tutor"}
                                        </p>
                                        <Badge variant="secondary" className="capitalize">
                                            {b.status.replace("_", " ")}
                                        </Badge>
                                    </div>

                                    <p className="mt-1 text-sm text-muted-foreground truncate">
                                        Topic: <span className="text-foreground/90">{b.topic || "General Session"}</span>
                                    </p>

                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                                        <p className="text-muted-foreground">
                                            Start: <span className="text-foreground">{formatDT(b.startAt)}</span>
                                        </p>
                                        <p className="text-muted-foreground">
                                            End: <span className="text-foreground">{formatDT(b.endAt)}</span>
                                        </p>
                                        <p className="text-muted-foreground">
                                            Duration: <span className="text-foreground">{b.durationMinutes} min</span>
                                        </p>
                                        <p className="text-muted-foreground">
                                            Total: <span className="text-foreground">{b.currency} {b.totalPrice}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-xs text-muted-foreground">Timezone</p>
                                    <p className="text-sm font-medium text-foreground">{b.timezone || "-"}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Sentinel */}
                    <div ref={sentinelRef} className="h-10" />

                    {/* Loading / Error / End */}
                    <div className="py-2">
                        {loading && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading more...
                            </div>
                        )}
                        {error && (
                            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        {!loading && !pagination.hasNext && items.length > 0 && (
                            <div className="text-center text-sm text-muted-foreground">
                                You reached the end.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Details Sheet */}
            <BookingDetailsSheet booking={active} onClose={() => setActive(null)} />
        </div>
    );
}
