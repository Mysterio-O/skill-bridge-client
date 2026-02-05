"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GraduationCap, BadgeCheck, Globe, Calendar } from "lucide-react";
import type { TutorProfile, TutorSubject } from "@/app/actions/tutorActions/getTutors";
import { useAuth } from "@/providers/AuthProvider";

function initials(name?: string) {
  if (!name) return "T";
  const parts = name.trim().split(" ");
  return (parts[0]?.[0] ?? "T") + (parts[1]?.[0] ?? "");
}
function subjectLabel(s: TutorSubject) {
  return s?.name || s?.title || s?.slug || "Subject";
}

export default function TutorDetailsSheet({
  tutor,
  open,
  onOpenChange,
}: {
  tutor: TutorProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {

  const { user } = useAuth();

  const name = tutor?.user?.name ?? "Tutor";
  const rating =
    tutor?.avgRating != null ? Number(tutor.avgRating).toFixed(1) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[520px] border-border bg-background">
        {!tutor ? null : (
          <div className="flex h-full flex-col">
            <SheetHeader>
              <SheetTitle className="text-foreground">Tutor details</SheetTitle>
            </SheetHeader>

            <div className="mt-5 rounded-3xl border bg-card/50 backdrop-blur p-5">
              <div className="flex items-start gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={tutor.user?.image ?? ""} alt={name} />
                  <AvatarFallback>{initials(name)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">
                        {name}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {tutor.headline}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-semibold text-foreground">
                        ${tutor.hourlyRate}
                        <span className="text-xs text-muted-foreground">/hr</span>
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        <Star className="h-3.5 w-3.5" />
                        {rating ? (
                          <span className="text-foreground font-medium">{rating}</span>
                        ) : (
                          <span>New</span>
                        )}
                        <span>·</span>
                        <span>{tutor.reviewCount ?? 0} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {tutor.sessionMode ? (
                      <Badge className="rounded-2xl" variant="secondary">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        {tutor.sessionMode}
                      </Badge>
                    ) : null}

                    {(tutor.languages ?? []).map((l) => (
                      <Badge key={l} className="rounded-2xl" variant="outline">
                        <Globe className="mr-1 h-3.5 w-3.5" />
                        {l}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">About</p>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                    {tutor.about}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {tutor.education ? (
                    <div className="rounded-2xl border bg-background/40 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <GraduationCap className="h-4 w-4" />
                        Education
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tutor.education}
                      </p>
                    </div>
                  ) : null}

                  {tutor.certification ? (
                    <div className="rounded-2xl border bg-background/40 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <BadgeCheck className="h-4 w-4" />
                        Certification
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tutor.certification}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">Subjects</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(tutor.subjects ?? []).map((s, idx) => (
                      <Badge
                        key={(s?.id as string) ?? `${tutor.id}-sub-${idx}`}
                        className="rounded-2xl"
                        variant="secondary"
                      >
                        {subjectLabel(s)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {user && <Button className="rounded-2xl" asChild>
                  <Link href={`/bookings/new?tutorId=${encodeURIComponent(tutor.id)}`}>
                    Schedule booking
                  </Link>
                </Button>}

                <Button variant="secondary" className="rounded-2xl" asChild>
                  <Link href={`/tutors/${encodeURIComponent(tutor.id)}`}>
                    Open full profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
