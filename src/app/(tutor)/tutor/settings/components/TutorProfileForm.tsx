"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TutorProfileDTO } from "../types";
import { updateTutorProfileAction } from "../actions";


const sessionModeEnum = z.enum(["online", "in_person", "hybrid"]);
const meetingPlatformEnum = z.enum(["zoom", "google_meet", "others"]);


export type Values = {
  headline: string;
  about: string;
  hourlyRate: string;
  currency: string;
  yearsOfExperience: string;
  languagesText: string;
  education: string;
  certification: string;
  sessionMode: "online" | "in_person" | "hybrid";
  meetingPlatform: "zoom" | "google_meet" | "others";
  timezone: string;
  isActive: boolean;
};


const schema = z
  .object({
    headline: z.string().trim().max(120),
    about: z.string().trim().max(1500),

    hourlyRate: z
      .string()
      .trim()
      .min(1, "Hourly rate is required")
      .refine((v) => !Number.isNaN(Number(v)), "Hourly rate must be a number")
      .refine((v) => Number(v) >= 0, "Hourly rate cannot be negative")
      .refine((v) => Number(v) <= 100000, "Hourly rate seems too high"),

    currency: z.string().trim().min(1, "Currency is required").max(10),

    yearsOfExperience: z
      .string()
      .trim()
      .refine(
        (v) =>
          v === "" ||
          (!Number.isNaN(Number(v)) && Number.isInteger(Number(v))),
        "Years of experience must be a whole number"
      )
      .refine((v) => v === "" || Number(v) >= 0, "Cannot be negative")
      .refine((v) => v === "" || Number(v) <= 80, "Too high"),

    languagesText: z
      .string()
      .trim()
      .refine((v) => v.length <= 300, "Languages text is too long"),

    education: z.string().trim().max(200),
    certification: z.string().trim().max(200),

    sessionMode: sessionModeEnum,
    meetingPlatform: meetingPlatformEnum,

    timezone: z.string().trim().max(80),

    isActive: z.boolean(),
  })
  .strict()

function asNullableString(v: string) {
  const t = v.trim();
  return t ? t : null;
}

function normalizeLanguages(text: string) {
  const raw = text
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  return Array.from(new Set(raw)).slice(0, 20);
}

export default function TutorProfileForm({
  profile,
  onSaved,
}: {
  profile: TutorProfileDTO;
  onSaved: (next: TutorProfileDTO) => void;
}) {
  const [saving, setSaving] = React.useState(false);

  const defaultValues: Values = {
    headline: profile.headline ?? "",
    about: profile.about ?? "",
    hourlyRate: profile.hourlyRate ?? "0",
    currency: profile.currency ?? "USD",
    yearsOfExperience:
      profile.yearsOfExperience === null || profile.yearsOfExperience === undefined
        ? ""
        : String(profile.yearsOfExperience),
    languagesText: (profile.languages ?? []).join(", "),
    education: profile.education ?? "",
    certification: profile.certification ?? "",
    sessionMode: (profile.sessionMode as Values["sessionMode"]) ?? "online",
    meetingPlatform: (profile.meetingPlatform as Values["meetingPlatform"]) ?? "zoom",
    timezone: profile.timezone ?? "",
    isActive: profile.isActive ?? true,
  };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  React.useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onSubmit = async (values: Values) => {
    try {
      setSaving(true);

      const years = values.yearsOfExperience.trim()
        ? Number(values.yearsOfExperience.trim())
        : null;

      const payload: Partial<TutorProfileDTO> = {
        headline: asNullableString(values.headline),
        about: asNullableString(values.about),
        hourlyRate: values.hourlyRate,
        currency: values.currency.trim(),
        yearsOfExperience: years,
        languages: normalizeLanguages(values.languagesText),
        education: asNullableString(values.education),
        certification: asNullableString(values.certification),
        sessionMode: values.sessionMode,
        meetingPlatform: values.meetingPlatform,
        timezone: asNullableString(values.timezone),
        isActive: values.isActive,
      };

      const next = await updateTutorProfileAction(payload);

      toast({
        title: "Profile updated",
        description: "Your tutor profile has been saved successfully.",
      });

      onSaved(next);
      form.reset(values);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update profile";
      toast({ variant: "destructive", title: "Error", description: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="rounded-2xl border-slate-200/70 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/40">
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Profile
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Update your public tutor details.
            </p>
          </div>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={saving || !form.formState.isDirty}
            className="rounded-xl"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>

        <Separator className="my-5 bg-slate-200/60 dark:bg-slate-800/60" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Headline + Rate */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Headline
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. English tutor for IELTS & speaking"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">
                        Hourly rate
                      </FormLabel>
                      <FormControl>
                        <Input
                          inputMode="decimal"
                          placeholder="25"
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">
                        Currency
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="USD" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* About */}
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    About
                  </FormLabel>
                  <FormControl>
                    <Textarea className="min-h-30 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience + Languages */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Years of experience
                    </FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="e.g. 3"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languagesText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Languages (comma separated)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="English, Bengali"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Example: English, Bengali, Hindi
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Education + Certification */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Education
                    </FormLabel>
                    <FormControl>
                      <Input className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Certification
                    </FormLabel>
                    <FormControl>
                      <Input className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Session mode + Platform */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sessionMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Session mode
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in_person">In person</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingPlatform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Meeting platform
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="google_meet">Google Meet</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Timezone + Active */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300">
                      Timezone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Asia/Dhaka" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-slate-800/70 dark:bg-slate-950/30">
                    <div className="space-y-0.5">
                      <FormLabel className="text-slate-900 dark:text-slate-100">
                        Profile Active
                      </FormLabel>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        If off, students may not see you in listings.
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="md:hidden">
              <Button
                type="submit"
                disabled={saving || !form.formState.isDirty}
                className="w-full rounded-xl"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}
