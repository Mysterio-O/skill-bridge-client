import React from "react";
import { getReviews } from "./action";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, StarHalf, Clock, CalendarCheck2, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  bookingId: string;
  studentId: string;
  tutorId: string;
  rating: number; // 1..5
  comment: string | null;
  isHidden: boolean;
  hiddenReason: string | null;
  createdAt: string;
  updatedAt: string;
  student?: { name?: string | null; email?: string | null } | null;
  booking?: {
    id: string;
    completedAt: string | null;
    durationMinutes: number | null;
  } | null;
};

function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  // Compact + consistent
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initials(name?: string | null, email?: string | null) {
  const base = (name ?? "").trim();
  if (base) {
    const parts = base.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("");
  }
  const e = (email ?? "").trim();
  if (e) return e[0]?.toUpperCase() ?? "U";
  return "U";
}

function clampRating(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, n));
}

function RatingStars({ rating }: { rating: number }) {
  const r = clampRating(rating);
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className="h-4 w-4 fill-current text-amber-500" />
      ))}
      {half === 1 && (
        <StarHalf className="h-4 w-4 fill-current text-amber-500" />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star
          key={`e-${i}`}
          className="h-4 w-4 text-muted-foreground/40"
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground tabular-nums">
        {r.toFixed(1)}
      </span>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/55">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </div>
          {hint ? (
            <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function TutorReviewsPage() {
  const reviews = (await getReviews()) as Review[];

  const total = reviews.length;

  const avg =
    total === 0
      ? 0
      : reviews.reduce((acc, r) => acc + clampRating(r.rating ?? 0), 0) / total;

  const fiveStar = reviews.filter((r) => clampRating(r.rating) === 5).length;
  const hiddenCount = reviews.filter((r) => !!r.isHidden).length;

  return (
    <div
      className={cn(
        // page background like your screenshots
        "min-h-[calc(100vh-4rem)] w-full",
        "bg-gradient-to-b from-slate-50 to-slate-100/60",
        "dark:from-[#060A12] dark:to-[#050713]"
      )}
    >
      <div className="mx-auto w-full px-4 py-8 md:px-6 md:py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <CalendarCheck2 className="h-4 w-4" />
            Tutor dashboard • Reviews
          </div>

          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tutor Reviews
          </h1>

          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            See what students said about your sessions, including ratings,
            feedback, and booking details.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Reviews"
            value={total.toLocaleString()}
            hint="All time"
            icon={<CalendarCheck2 className="h-5 w-5 text-muted-foreground" />}
          />
          <StatCard
            title="Average Rating"
            value={avg.toFixed(2)}
            hint="Out of 5.00"
            icon={<Star className="h-5 w-5 text-muted-foreground" />}
          />
          <StatCard
            title="5★ Reviews"
            value={fiveStar.toLocaleString()}
            hint="Perfect scores"
            icon={<Star className="h-5 w-5 text-amber-500" />}
          />
          <StatCard
            title="Hidden Reviews"
            value={hiddenCount.toLocaleString()}
            hint="Moderated/hidden"
            icon={<EyeOff className="h-5 w-5 text-muted-foreground" />}
          />
        </div>

        {/* List */}
        <Card className="rounded-2xl border-border/60 bg-card/70 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/55">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Latest feedback</CardTitle>
            <CardDescription>
              Reviews are shown newest first (based on creation time).
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {total === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
                  <Star className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-base font-semibold">No reviews yet</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Once students complete sessions and leave feedback, you’ll see
                  them here.
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {reviews
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((r) => {
                    const studentName = r.student?.name ?? "Student";
                    const studentEmail = r.student?.email ?? "";
                    const duration = r.booking?.durationMinutes ?? null;
                    const completedAt = r.booking?.completedAt ?? null;

                    return (
                      <div
                        key={r.id}
                        className="px-5 py-5 transition-colors hover:bg-muted/20"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          {/* Left */}
                          <div className="flex min-w-0 gap-3">
                            <Avatar className="h-10 w-10 border border-border/60">
                              <AvatarFallback className="bg-muted/40 text-sm font-semibold">
                                {initials(studentName, studentEmail)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="truncate font-semibold">
                                  {studentName}
                                </div>

                                {r.isHidden ? (
                                  <Badge
                                    variant="secondary"
                                    className="rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10"
                                  >
                                    Hidden
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="rounded-full"
                                  >
                                    Visible
                                  </Badge>
                                )}

                                <Badge variant="outline" className="rounded-full">
                                  Booking: {r.bookingId}
                                </Badge>
                              </div>

                              {studentEmail ? (
                                <div className="truncate text-sm text-muted-foreground">
                                  {studentEmail}
                                </div>
                              ) : null}

                              <div className="mt-2">
                                <RatingStars rating={r.rating ?? 0} />
                              </div>
                            </div>
                          </div>

                          {/* Right meta */}
                          <div className="flex flex-wrap items-center gap-2 md:justify-end">
                            <Badge
                              variant="outline"
                              className="rounded-full gap-1.5"
                            >
                              <CalendarCheck2 className="h-3.5 w-3.5" />
                              Created: {formatDateTime(r.createdAt)}
                            </Badge>

                            <Badge
                              variant="outline"
                              className="rounded-full gap-1.5"
                            >
                              <Clock className="h-3.5 w-3.5" />
                              Duration: {duration ? `${duration} min` : "—"}
                            </Badge>

                            <Badge
                              variant="outline"
                              className="rounded-full gap-1.5"
                            >
                              <CalendarCheck2 className="h-3.5 w-3.5" />
                              Completed: {formatDateTime(completedAt)}
                            </Badge>
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mt-4">
                          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                            <div className="text-sm font-medium text-muted-foreground">
                              Comment
                            </div>
                            <Separator className="my-2" />
                            <p className="text-sm leading-relaxed">
                              {r.comment?.trim()
                                ? r.comment
                                : "No comment provided."}
                            </p>

                            {r.isHidden && r.hiddenReason ? (
                              <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
                                <div className="text-xs font-semibold text-destructive">
                                  Hidden reason
                                </div>
                                <div className="mt-1 text-sm text-destructive/90">
                                  {r.hiddenReason}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
