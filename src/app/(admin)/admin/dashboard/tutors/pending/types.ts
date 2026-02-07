
export type Category = {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
};

export type TutorSubject = {
    id: string;
    tutorId: string;
    categoryId: string;
    category: Category;
};

export type UserLite = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    bio?: string | null;
    createdAt: string;
};

export type TutorApplication = {
    id: string;
    userId: string;
    headline: string | null;
    about: string | null;
    hourlyRate: string;
    currency: string;
    yearsOfExperience: number | null;
    languages: string[];
    education: string | null;
    certification: string | null;
    sessionMode: string;
    meetingPlatform: string;
    timezone: string | null;
    availability: string;
    status: "pending" | "active" | "cancelled";
    createdAt: string;
    updatedAt: string;

    user: UserLite;
    subjects: TutorSubject[];
};

export type Meta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type PendingAppsResponse = {
    success: boolean;
    message: string;
    meta: Meta;
    data: TutorApplication[];
};
