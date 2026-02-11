"use client";

import * as React from "react";
import { Booking, BPagination } from "../types";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import BookingListItem from "./BookingListItem";
import TutorBookingDetailsSheet from "./TutorBookingDetailsSheet";

export default function TutorBookingsClient({
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
    const [debounced, setDebounced] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const pageRef = React.useRef(pagination.page);
    const hasNextRef = React.useRef(pagination.hasNext);

    React.useEffect(() => {
        const t = setTimeout(() => setDebounced(search.trim()), 400);
        return () => clearTimeout(t);
    }, [search]);

    React.useEffect(() => {
        pageRef.current = pagination.page;
        hasNextRef.current = pagination.hasNext;
    }, [pagination]);

    const patchBooking = React.useCallback((patch: Partial<Booking> & { id: string }) => {
        setItems((prev) => prev.map((b) => (b.id === patch.id ? ({ ...b, ...patch } as Booking) : b)));
        setActive((prev) => (prev && prev.id === patch.id ? ({ ...prev, ...patch } as Booking) : prev));
    }, []);

    // refetch first page when search changes
    React.useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError(null);

            try {
                const url = new URL("/api/bookings", window.location.origin);
                url.searchParams.set("page", "1");
                url.searchParams.set("page_size", String(initialPagination.page_size));
                if (debounced) url.searchParams.set("search", debounced);

                const res = await fetch(url.toString(), { cache: "no-store" });
                const json = await res.json();

                if (!res.ok || !json?.success) throw new Error(json?.message || "Failed to fetch bookings");
                if (cancelled) return;

                setItems(json.data.bookings ?? []);
                setPagination(json.data.pagination);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
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
            if (debounced) url.searchParams.set("search", debounced);

            const res = await fetch(url.toString(), { cache: "no-store" });
            const json = await res.json();

            if (!res.ok || !json?.success) throw new Error(json?.message || "Failed to fetch bookings");

            const nextBookings: Booking[] = json.data.bookings ?? [];
            const nextPagination: BPagination = json.data.pagination;

            setItems((prev) => {
                const map = new Map(prev.map((b) => [b.id, b]));
                for (const b of nextBookings) map.set(b.id, b);
                return Array.from(map.values());
            });

            setPagination(nextPagination);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore();
            },
            { root: null, rootMargin: "700px", threshold: 0.01 }
        );

        obs.observe(el);
        return () => obs.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced, pagination.page_size]);

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search student name, email, phone..."
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
                    <p className="text-sm text-muted-foreground">Try a different search term.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((b) => (
                        <BookingListItem key={b.id} booking={b} onClick={() => setActive(b)} />
                    ))}

                    <div ref={sentinelRef} className="h-10" />

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
                            <div className="text-center text-sm text-muted-foreground">You reached the end.</div>
                        )}
                    </div>
                </div>
            )}

            <TutorBookingDetailsSheet
                booking={active}
                onClose={() => setActive(null)}
                onBookingUpdated={patchBooking}
            />
        </div>
    );
}
