export type TutorAvailability = "available" | "not_available";

export type TutorSessionMode = "online" | "in_person" | "hybrid";
export type MeetingPlatform = "zoom" | "google_meet" | "others";


export type TutorProfileDTO = {
    headline?: string | null;
    about?: string | null;

    hourlyRate: string; // keep as string for form
    currency: string;

    avgRating?: string | null;
    reviewCount?: number;

    yearsOfExperience?: number | null;
    languages: string[];
    education?: string | null;
    certification?: string | null;

    sessionMode: TutorSessionMode;
    meetingPlatform: MeetingPlatform;
    timezone?: string | null;

    isProfileComplete?: boolean;
    isActive: boolean;

    availability: TutorAvailability;

    status?: "pending" | "active" | "cancelled";
    cancelReason?: string | null;

    user?: {
        name?: string | null;
        email?: string | null;
        phone?: string | null;
    };
};
