"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { toast } from "@/components/ui/use-toast";

import {
    becomeTutorSchema,
    type BecomeTutorValues,
} from "../lib/schema";
import type { Category } from "../lib/types";
import { fetchCategories, submitTutorApplication } from "../lib/api";

import { Section, FieldError } from "./Section";
import LanguagesInput from "./LanguagesInput";
import SubjectsPicker from "./SubjectsPicker";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";

function prettyMode(mode: "online" | "in_person" | "hybrid") {
    if (mode === "in_person") return "In person";
    if (mode === "online") return "Online";
    if (mode === "hybrid") return "Hybrid";
    return mode;
}

function prettyPlatform(p: "zoom" | "google_meet" | "others") {
    if (p === "google_meet") return "Google Meet";
    if (p === "zoom") return "Zoom";
    if (p === "others") return "Other";
    return p;
}

export default function BecomeTutorForm() {
    const router = useRouter();
    const { user, isPending } = useAuth();

    const [catsLoading, setCatsLoading] = React.useState(true);
    const [categories, setCategories] = React.useState<Category[]>([]);

    const form = useForm<BecomeTutorValues>({
        resolver: zodResolver(becomeTutorSchema),
        mode: "onChange",
        defaultValues: {
            headline: "",
            about: "",
            hourlyRate: "",
            currency: "BDT",
            yearsOfExperience: undefined,
            languages: ["English"],
            education: "",
            certification: "",
            sessionMode: "online",
            meetingPlatform: "zoom",
            timezone:
                typeof Intl !== "undefined"
                    ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dhaka"
                    : "Asia/Dhaka",
            availability: "available",
            categoryIds: [],
        },
    });

    const saving = form.formState.isSubmitting;

    // Categories (public)
    React.useEffect(() => {
        let cancelled = false;

        async function run() {
            try {
                const cats = await fetchCategories();
                if (cancelled) return;
                setCategories(cats);
            } catch {
                if (!cancelled) setCategories([]);
            } finally {
                if (!cancelled) setCatsLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, []);

    async function onSubmit(values: BecomeTutorValues) {
        if (!user?.id) {
            toast({
                variant: "destructive",
                title: "Not signed in",
                description: "Please sign in again.",
            });
            return;
        }

        try {
            const { res, json } = await submitTutorApplication({ id: user.id, values });

            if (!res.ok || !json?.success) {
                toast({
                    variant: "destructive",
                    title: "Failed to submit",
                    description: json?.message || "Please try again.",
                });
                return;
            }

            toast({
                title: "Application submitted",
                description: "Tutor profile created — waiting for admin approval.",
            });

            router.push("/tutors");
        } catch {
            toast({
                variant: "destructive",
                title: "Network error",
                description: "Please try again.",
            });
        }
    }

    // ✅ Use AuthProvider loading instead of fetchMe()
    if (isPending) {
        return (
            <Card className="rounded-3xl border bg-background/40 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking your account…
                </div>
            </Card>
        );
    }

    // ✅ If no session user, show login gate
    if (!user) {
        return (
            <Card className="rounded-3xl border bg-background/40 p-4">
                <h2 className="text-sm font-semibold text-foreground">Sign in required</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Please sign in as a student to apply as a tutor.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild className="rounded-2xl">
                        <Link href="/login">Go to login</Link>
                    </Button>
                    <Button asChild variant="secondary" className="rounded-2xl">
                        <Link href="/tutors">Browse tutors</Link>
                    </Button>
                </div>
            </Card>
        );
    }

    // ✅ Role gate
    if (user.role !== "student") {
        return (
            <Card className="rounded-3xl border bg-background/40 p-4">
                <h2 className="text-sm font-semibold text-foreground">Not eligible</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Only student accounts can submit a tutor application.
                </p>
                <Button asChild className="mt-3 rounded-2xl" variant="secondary">
                    <Link href="/tutors">Back to tutors</Link>
                </Button>
            </Card>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Basics */}
            <Section title="Basics" hint="A clean headline + teaching style helps students pick you faster.">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Label className="text-xs text-muted-foreground">Headline</Label>
                        <Input
                            className="mt-2 rounded-2xl"
                            placeholder="e.g., Exam-focused tutor with smart strategies"
                            {...form.register("headline")}
                        />
                        <FieldError msg={form.formState.errors.headline?.message} />
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground">Timezone</Label>
                        <Input className="mt-2 rounded-2xl" placeholder="e.g., Asia/Dhaka" {...form.register("timezone")} />
                        <FieldError msg={form.formState.errors.timezone?.message} />
                    </div>
                </div>

                <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">About</Label>
                    <Textarea
                        className="mt-2 rounded-2xl min-h-[120px]"
                        placeholder="Your teaching structure, how you run sessions, what students should expect..."
                        {...form.register("about")}
                    />
                    <FieldError msg={form.formState.errors.about?.message} />
                </div>
            </Section>

            {/* Pricing */}
            <Section title="Pricing" hint="Set your hourly rate. Keep it realistic — you can update later.">
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">Hourly rate</Label>
                        <Input
                            className="mt-2 rounded-2xl"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="e.g., 50"
                            {...form.register("hourlyRate")}
                        />
                        <FieldError msg={form.formState.errors.hourlyRate?.message} />
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground">Currency</Label>
                        <Input className="mt-2 rounded-2xl" placeholder="e.g., BDT" {...form.register("currency")} />
                        <FieldError msg={form.formState.errors.currency?.message} />
                    </div>
                </div>
            </Section>

            {/* Experience */}
            <Section title="Experience" hint="Optional, but improves trust and conversions.">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <Label className="text-xs text-muted-foreground">Years of experience</Label>
                        <Input
                            className="mt-2 rounded-2xl"
                            type="number"
                            min="0"
                            max="60"
                            placeholder="e.g., 3"
                            {...form.register("yearsOfExperience", {
                                setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
                            })}
                        />
                        <FieldError msg={form.formState.errors.yearsOfExperience?.message as string} />
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground">Education</Label>
                        <Input className="mt-2 rounded-2xl" placeholder="e.g., BSc in Mathematics" {...form.register("education")} />
                        <FieldError msg={form.formState.errors.education?.message} />
                    </div>
                </div>

                <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">Certification</Label>
                    <Input className="mt-2 rounded-2xl" placeholder="e.g., Certified Tutor" {...form.register("certification")} />
                    <FieldError msg={form.formState.errors.certification?.message} />
                </div>

                <div className="mt-3">
                    <Controller
                        control={form.control}
                        name="languages"
                        render={({ field, fieldState }) => (
                            <LanguagesInput value={field.value ?? []} onChange={field.onChange} error={fieldState.error?.message} />
                        )}
                    />
                </div>
            </Section>

            {/* Session Preferences */}
            <Section title="Session preferences" hint="How do you prefer to teach?">
                <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                        <Label className="text-xs text-muted-foreground">Session mode</Label>
                        <Controller
                            control={form.control}
                            name="sessionMode"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2 rounded-2xl">
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">{prettyMode("online")}</SelectItem>
                                        <SelectItem value="in_person">{prettyMode("in_person")}</SelectItem>
                                        <SelectItem value="hybrid">{prettyMode("hybrid")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldError msg={form.formState.errors.sessionMode?.message} />
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground">Meeting platform</Label>
                        <Controller
                            control={form.control}
                            name="meetingPlatform"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2 rounded-2xl">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="zoom">{prettyPlatform("zoom")}</SelectItem>
                                        <SelectItem value="google_meet">{prettyPlatform("google_meet")}</SelectItem>
                                        <SelectItem value="others">{prettyPlatform("others")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldError msg={form.formState.errors.meetingPlatform?.message} />
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground">Availability</Label>
                        <Controller
                            control={form.control}
                            name="availability"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="mt-2 rounded-2xl">
                                        <SelectValue placeholder="Select availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="not_available">Not available</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldError msg={form.formState.errors.availability?.message} />
                    </div>
                </div>
            </Section>

            {/* Subjects */}
            <Section title="Subjects" hint="Pick what you want to teach.">
                {catsLoading ? (
                    <Card className="rounded-3xl border bg-background/40 p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading subjects…
                        </div>
                    </Card>
                ) : (
                    <Controller
                        control={form.control}
                        name="categoryIds"
                        render={({ field, fieldState }) => (
                            <SubjectsPicker
                                categories={categories}
                                value={field.value ?? []}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                )}
            </Section>

            {/* Submit */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                    By submitting, you agree your profile can be reviewed by admins.
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="secondary" className="rounded-2xl" onClick={() => form.reset()} disabled={saving}>
                        Reset
                    </Button>

                    <Button type="submit" className="rounded-2xl" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting…
                            </>
                        ) : (
                            "Submit application"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}