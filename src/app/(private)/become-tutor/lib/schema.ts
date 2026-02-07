import { z } from "zod";

export const TutorSessionModeEnum = z.enum(["online", "in_person", "hybrid"]);
export const MeetingPlatformEnum = z.enum(["zoom", "google_meet", "others"]);
export const TutorAvailabilityEnum = z.enum(["available", "not_available"]);

export const becomeTutorSchema = z.object({
  headline: z.string().trim().max(120, "Headline max 120 chars").optional().or(z.literal("")),
  about: z.string().trim().max(2000, "About max 2000 chars").optional().or(z.literal("")),

  hourlyRate: z
    .string()
    .trim()
    .min(1, "Hourly rate is required")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Enter a valid amount"),

  currency: z.string().trim().min(3, "Currency is required").max(10, "Currency too long"),

  yearsOfExperience: z.number().int().min(0).max(60).optional(),

  languages: z
    .array(z.string().trim().min(2, "Language too short").max(30))
    .min(1, "Add at least 1 language")
    .max(10, "Max 10 languages"),

  education: z.string().trim().max(160).optional().or(z.literal("")),
  certification: z.string().trim().max(160).optional().or(z.literal("")),

  sessionMode: TutorSessionModeEnum,
  meetingPlatform: MeetingPlatformEnum,

  timezone: z.string().trim().max(64).optional().or(z.literal("")),

  availability: TutorAvailabilityEnum,

  categoryIds: z.array(z.string()).min(1, "Pick at least 1 subject"),
});

export type BecomeTutorValues = z.infer<typeof becomeTutorSchema>;
