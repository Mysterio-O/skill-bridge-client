import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
    ArrowRight,
    BadgeCheck,
    MapPin,
    Star,
    Clock,
} from "lucide-react";
import TutorCard from "@/app/(public)/tutors/components/TutorCard";
import { TutorProfile } from "@/app/actions/tutorActions/getTutors";

export type Tutor = {
    id: string | number;
    name: string;
    title: string;
    subjects: string[];
    rating: number; // 0-5
    reviewsCount: number;
    hourlyRate?: number;
    location?: string;
    verified?: boolean;
};

type TutorsSectionProps = {
    className?: string;
    title?: string;
    subtitle?: string;
    tutors: TutorProfile[];
    categories?: string[];
    onCategoryClick?: (category: string) => void;
};

export default function TutorsSection({
    className,
    title = "Featured Tutors",
    subtitle = "Hand-picked profiles to help you get results faster.",
    tutors,
    categories = ["Programming", "Design", "English", "Math", "IELTS", "Science"],
    onCategoryClick,
}: TutorsSectionProps) {


    return (
        <section className={cn("relative", className)}>
            <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                    </div>

                    <Button asChild variant="outline" className="w-fit rounded-xl">
                        <Link href="/tutors">
                            View all
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Category pills (optional) */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onCategoryClick?.(c)}
                            className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-foreground shadow-sm backdrop-blur hover:bg-background/80"
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <Separator className="my-6 opacity-60" />

                {/* Tutor grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tutors.slice(0, 6).map((t) => (
                        <TutorCard key={String(t.id)} tutor={t} from="home"/>
                    ))}
                </div>
            </div>
        </section>
    );
}
