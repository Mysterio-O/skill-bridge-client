"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search as SearchIcon, X } from "lucide-react";
import BackgroundGlow from "@/components/shared/BackgroundGlow";
import type { GetTutorsResponse, TutorProfile } from "@/app/actions/tutorActions/getTutors";
import TutorCard from "./TutorCard";
import TutorDetailsSheet from "./TutorDetailsSheet";

const LIMIT = 10;

async function fetchTutors(page: number, search?: string): Promise<GetTutorsResponse> {
    const url = new URL("/api/tutors", window.location.origin);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(LIMIT));
    if (search) url.searchParams.set("search", search);

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Fetch failed (${res.status}): ${text}`);
    }
    return (await res.json()) as GetTutorsResponse;
}

export default function TutorsClient({
    initial,
    initialSearch,
}: {
    initial: GetTutorsResponse | null;
    initialSearch: string;
}) {
    const router = useRouter();
    const sp = useSearchParams();

    const urlSearch = sp.get("search") ?? initialSearch ?? "";

    const [input, setInput] = React.useState(urlSearch);
    const [search, setSearch] = React.useState(urlSearch);

    const [items, setItems] = React.useState<TutorProfile[]>(initial?.data?.tutors ?? []);
    const [meta, setMeta] = React.useState(initial?.data?.meta ?? { page: 1, limit: LIMIT, total: 0, totalPages: 1, hasNext: false });

    const [loadingFirst, setLoadingFirst] = React.useState(!initial);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [err, setErr] = React.useState<string>("");

    const [openTutor, setOpenTutor] = React.useState<TutorProfile | null>(null);

    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    // sync URL -> state (back/forward)
    React.useEffect(() => {
        const next = sp.get("search") ?? "";
        setInput(next);
        setSearch(next);
    }, [sp]);

    // debounce URL update from input
    React.useEffect(() => {
        const t = setTimeout(() => {
            const q = input.trim();
            const params = new URLSearchParams(Array.from(sp.entries()));

            if (q) params.set("search", q);
            else params.delete("search");

            router.replace(`?${params.toString()}`);
        }, 400);

        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

    // fetch first page on search change
    React.useEffect(() => {
        let cancelled = false;

        async function run() {
            setErr("");
            setLoadingFirst(true);

            try {
                const res = await fetchTutors(1, search || undefined);
                if (cancelled) return;

                setItems(res.data.tutors ?? []);
                setMeta(res.data.meta);
                setOpenTutor(null);
            } catch (e) {
                if (!cancelled) setErr((e instanceof Error) ? e?.message : "Failed to load tutors");
            } finally {
                if (!cancelled) setLoadingFirst(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [search]);

    const loadMore = React.useCallback(async () => {
        if (loadingMore) return;
        if (!meta?.hasNext) return;

        setLoadingMore(true);
        setErr("");

        try {
            const nextPage = (meta.page ?? 1) + 1;
            const res = await fetchTutors(nextPage, search || undefined);

            setItems((prev) => {
                const map = new Map(prev.map((t) => [t.id, t]));
                for (const t of res.data.tutors ?? []) map.set(t.id, t);
                return Array.from(map.values());
            });

            setMeta(res.data.meta);
        } catch (e) {
            setErr(e instanceof Error ? e?.message : "Failed to load more tutors");
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, meta, search]);

    // intersection observer
    React.useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const ob = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore();
            },
            { root: null, rootMargin: "1200px", threshold: 0 }
        );

        ob.observe(el);
        return () => ob.disconnect();
    }, [loadMore]);

    return (
        <div className="relative min-h-[calc(100vh-64px)] bg-background">
            <BackgroundGlow />

            <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
                {/* header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Browse Tutors
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Search and open a profile to schedule a session.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-[520px] sm:flex-row sm:items-center sm:justify-end">
                        <div className="relative w-full">
                            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Search tutors, subjects, skills..."
                                className="h-11 rounded-2xl pl-9 pr-10 bg-card/60 backdrop-blur border-border"
                            />
                            {input.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setInput("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <Button className="h-11 rounded-2xl" onClick={() => setInput((v) => v.trim())}>
                            Search
                        </Button>
                    </div>
                </div>

                {/* status */}
                <div className="mt-6 flex items-center justify-between rounded-3xl border bg-card/50 backdrop-blur px-5 py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-medium text-foreground">{items.length}</span>{" "}
                        tutors
                        {meta?.total ? (
                            <>
                                {" "}
                                out of{" "}
                                <span className="font-medium text-foreground">{meta.total}</span>
                            </>
                        ) : null}
                        {search ? (
                            <>
                                {" "}
                                for <span className="font-medium text-foreground">“{search}”</span>
                            </>
                        ) : null}
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Page <span className="text-foreground font-medium">{meta.page}</span> /{" "}
                        {meta.totalPages}
                    </div>
                </div>

                {/* error */}
                {err ? (
                    <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground">
                        {err}
                    </div>
                ) : null}

                {/* grid */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loadingFirst
                        ? Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[220px] rounded-3xl border bg-card/40 backdrop-blur animate-pulse"
                            />
                        ))
                        : items.map((t) => (
                            <TutorCard key={t.id} tutor={t} onOpen={() => setOpenTutor(t)} />
                        ))}
                </div>

                {/* sentinel */}
                <div ref={sentinelRef} className="h-10" />

                {/* load more fallback */}
                <div className="mt-4 flex items-center justify-center">
                    {meta?.hasNext ? (
                        <Button
                            variant="secondary"
                            className="rounded-2xl"
                            onClick={loadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading…
                                </>
                            ) : (
                                "Load more"
                            )}
                        </Button>
                    ) : (
                        <div className="text-xs text-muted-foreground">You’re all caught up</div>
                    )}
                </div>
            </div>

            <TutorDetailsSheet
                tutor={openTutor}
                open={!!openTutor}
                onOpenChange={(v) => !v && setOpenTutor(null)}
            />
        </div>
    );
}
