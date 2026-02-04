import Link from "next/link";
import BackgroundGlow from "@/components/shared/BackgroundGlow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

type TutorCategory = {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    isActive?: boolean;
};

type TutorSubject = {
    id: string;
    tutorId: string;
    categoryId: string;
    category?: TutorCategory;
};

type Tutor = {
    id: string;
    userId: string;

    headline?: string | null;
    about?: string | null;

    hourlyRate?: string | number | null;
    currency?: string | null;

    avgRating?: string | number | null;
    reviewCount?: number | null;

    yearsOfExperience?: number | null;
    languages?: string[];

    education?: string | null;
    certification?: string | null;

    sessionMode?: "online" | "in_person" | "hybrid" | string | null;
    meetingPlatform?: "zoom" | "google_meet" | "others" | string | null;
    timezone?: string | null;

    availability?: "available" | "not_available" | string | null;
    status?: "pending" | "active" | "cancelled" | string | null;

    createdAt?: string;
    updatedAt?: string;

    subjects?: TutorSubject[];

    // If your API includes user data:
    user?: { name?: string | null; email?: string | null; image?: string | null } | null;
};

async function getTutorById(id: string) {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!base) throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");

    const res = await fetch(`${base}/api/tutor/${id}`, { cache: "no-store" });
    if (!res.ok) return null;

    return res.json() as Promise<{ success: boolean; tutor?: Tutor; message?: string }>;
}

function prettyMode(mode?: string | null) {
    if (!mode) return null;
    if (mode === "in_person") return "In person";
    if (mode === "online") return "Online";
    if (mode === "hybrid") return "Hybrid";
    return mode;
}

function prettyPlatform(p?: string | null) {
    if (!p) return null;
    if (p === "google_meet") return "Google Meet";
    if (p === "zoom") return "Zoom";
    if (p === "others") return "Other";
    return p;
}

function money(amount?: string | number | null, currency?: string | null) {
    if (amount == null) return null;
    const n = typeof amount === "string" ? Number(amount) : amount;
    if (Number.isNaN(n)) return String(amount);
    const cur = currency || "USD";
    try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(n);
    } catch {
        // fallback if currency code is weird
        return `${n} ${cur}`;
    }
}

function ratingLabel(avgRating: Tutor["avgRating"], reviewCount?: number | null) {
    const rc = reviewCount ?? 0;
    if (!avgRating || Number(avgRating) <= 0 || rc <= 0) return "New";
    const n = typeof avgRating === "string" ? Number(avgRating) : avgRating;
    if (Number.isNaN(n)) return "New";
    return `${n.toFixed(1)} ★`;
}

export default async function TutorProfilePage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const data = await getTutorById(id);

    if (!data?.success || !data?.tutor) {
        return (
            <div className="relative min-h-[calc(100vh-64px)] bg-background">
                <BackgroundGlow />
                <div className="relative mx-auto max-w-3xl px-4 py-10">
                    <Card className="rounded-3xl border bg-card/55 backdrop-blur p-6">
                        <h1 className="text-lg font-semibold text-foreground">Tutor not found</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This tutor profile isn’t available.
                        </p>
                        <Button className="mt-4 rounded-2xl" asChild>
                            <Link href="/tutors">Back to tutors</Link>
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    const tutor = data.tutor;

    const displayName =
        tutor?.user?.name?.trim() ||
        (tutor.userId ? `Tutor (${tutor.userId.replace("demo_tutor_", "#")})` : "Tutor");

    const price = money(tutor.hourlyRate, tutor.currency) ?? tutor.hourlyRate ?? "--";

    const subjects = (tutor.subjects ?? [])
        .map((s) => ({
            id: s.id,
            name: s.category?.name ?? "Subject",
            icon: s.category?.icon ?? "",
            description: s.category?.description ?? "",
        }))
        .slice(0, 10);

    const languages = (tutor.languages ?? []).slice(0, 8);

    const availability = tutor.availability ?? "available";
    const availLabel = availability === "available" ? "Available" : "Not available";

    const status = tutor.status ?? "active";
    const statusLabel =
        status === "active" ? "Active" : status === "pending" ? "Pending" : "Cancelled";

    const mode = prettyMode(tutor.sessionMode);
    const platform = prettyPlatform(tutor.meetingPlatform);

    return (
        <div className="relative min-h-[calc(100vh-64px)] bg-background">
            <BackgroundGlow />

            <div className="relative mx-auto max-w-3xl px-4 py-10">
                <Card className="rounded-3xl border bg-card/55 backdrop-blur p-6">
                    {/* Top */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-semibold text-foreground">{displayName}</h1>

                                <Badge variant="outline" className="rounded-2xl">
                                    {ratingLabel(tutor.avgRating, tutor.reviewCount)}{" "}
                                    <span className="ml-1 text-muted-foreground">
                                        ({tutor.reviewCount ?? 0})
                                    </span>
                                </Badge>

                                <Badge
                                    variant="secondary"
                                    className="rounded-2xl"
                                >
                                    {availLabel}
                                </Badge>

                                <Badge variant="outline" className="rounded-2xl">
                                    {statusLabel}
                                </Badge>
                            </div>

                            {tutor.headline ? (
                                <p className="mt-1 text-sm text-muted-foreground">{tutor.headline}</p>
                            ) : null}

                            <div className="mt-3 flex flex-wrap gap-2">
                                {mode ? (
                                    <Badge variant="outline" className="rounded-2xl">
                                        {mode}
                                    </Badge>
                                ) : null}
                                {platform ? (
                                    <Badge variant="outline" className="rounded-2xl">
                                        {platform}
                                    </Badge>
                                ) : null}
                                {tutor.timezone ? (
                                    <Badge variant="outline" className="rounded-2xl">
                                        {tutor.timezone}
                                    </Badge>
                                ) : null}
                                {typeof tutor.yearsOfExperience === "number" ? (
                                    <Badge variant="outline" className="rounded-2xl">
                                        {tutor.yearsOfExperience} yrs exp
                                    </Badge>
                                ) : null}
                            </div>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                            <div className="text-base font-semibold text-foreground">
                                {price}
                                <span className="text-xs text-muted-foreground">
                                    {tutor.currency ? " / hr" : "/hr"}
                                </span>
                            </div>

                            <div className="mt-3 flex gap-2 sm:justify-end">
                                <Button className="rounded-2xl" asChild>
                                    <Link href={`/bookings/new?tutorId=${encodeURIComponent(tutor.id)}`}>
                                        Schedule booking
                                    </Link>
                                </Button>

                                <Button variant="outline" className="rounded-2xl" asChild>
                                    <Link href="/tutors">Back</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-5" />

                    {/* Chips */}
                    <div className="flex flex-wrap gap-2">
                        {languages.length ? (
                            <>
                                {languages.map((l) => (
                                    <Badge key={l} variant="outline" className="rounded-2xl">
                                        {l}
                                    </Badge>
                                ))}
                            </>
                        ) : (
                            <Badge variant="outline" className="rounded-2xl">
                                Languages not specified
                            </Badge>
                        )}
                    </div>

                    {/* Subjects */}
                    {subjects.length ? (
                        <div className="mt-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-medium text-foreground">Subjects</h2>
                                <span className="text-xs text-muted-foreground">
                                    {subjects.length} listed
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {subjects.map((s) => (
                                    <Badge key={s.id} variant="secondary" className="rounded-2xl">
                                        <span className="mr-1">{s.icon}</span>
                                        {s.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Quick facts */}
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border bg-background/40 p-4">
                            <div className="text-xs text-muted-foreground">Education</div>
                            <div className="mt-1 text-sm font-medium text-foreground">
                                {tutor.education ?? "—"}
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-background/40 p-4">
                            <div className="text-xs text-muted-foreground">Certification</div>
                            <div className="mt-1 text-sm font-medium text-foreground">
                                {tutor.certification ?? "—"}
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-background/40 p-4">
                            <div className="text-xs text-muted-foreground">Session mode</div>
                            <div className="mt-1 text-sm font-medium text-foreground">
                                {mode ?? "—"}
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-background/40 p-4">
                            <div className="text-xs text-muted-foreground">Meeting platform</div>
                            <div className="mt-1 text-sm font-medium text-foreground">
                                {platform ?? "—"}
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mt-6">
                        <h2 className="text-sm font-medium text-foreground">About</h2>
                        <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {tutor.about ?? "No description provided yet."}
                        </p>
                    </div>

                    {/* Footer note */}
                    <div className="mt-6 rounded-2xl border bg-background/40 p-4">
                        <div className="text-sm font-medium text-foreground">Tip</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Book a session and add your topic in the booking notes so the tutor can prepare in advance.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
