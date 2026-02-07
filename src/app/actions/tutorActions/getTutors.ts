import { Review } from "@/app/(public)/tutors/[id]/page";

export type TutorUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: "student" | 'tutor' | 'admin';
  phone: string | number;
  status: string;
  bio: string;
  lastLoginAt: string;
  bannedAt: string | null;
  banReason: string | null;
  tutorReviews: Review[];
};

export type TutorSubject = {
  id: string;
  tutorId: string;
  categoryId: string;
  category: {
    createdAt: string;
    description: string;
    icon: string;
    isActive: boolean;
    name: string;
    updatedAt: string;
  }
  name?: string;
  title?: string;
  slug?: string;
};

export type TutorProfile = {
  id: string;
  userId: string;

  headline: string;
  about: string;

  hourlyRate: string;
  currency: string;

  languages: string[];
  subjects: TutorSubject[];

  education?: string | null;
  certification?: string | null;

  yearsOfExperience?: number | null;
  timezone?: string | null;

  meetingPlatform?: string | null;
  sessionMode?: string | null;

  availability?: string | null;
  status?: string | null;

  avgRating?: number | null;
  reviewCount?: number | null;

  isActive?: boolean;
  isProfileComplete?: boolean;

  createdAt?: string;
  updatedAt?: string;

  user: TutorUser;
};

export type TutorsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev?: boolean;
};

export type GetTutorsResponse = {
  success: boolean;
  message?: string;
  data: {
    meta: TutorsMeta;
    tutors: TutorProfile[];
  };
};

type Params = {
  page?: number;
  limit?: number;
  search?: string;
  origin?: string;
};

export async function getTutors(params: Params = {}): Promise<GetTutorsResponse> {

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const url = params.origin
    ? new URL("/api/tutors", params.origin)
    : new URL("http://localhost/api/tutors");

  if (!params.origin) {
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("limit", String(limit));
    if (params.search) qs.set("search", params.search);
    const res = await fetch(`/api/tutors?${qs.toString()}`, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Failed to fetch tutors (${res.status}): ${text}`);
    }
    return (await res.json()) as GetTutorsResponse;
  }

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (params.search) url.searchParams.set("search", params.search);

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch tutors (${res.status}): ${text}`);
  }

  return (await res.json()) as GetTutorsResponse;
}
