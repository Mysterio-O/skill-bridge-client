import { Review } from "@/app/(public)/tutors/[id]/page";

export type BPagination = {
  page: number;
  page_size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type BookingUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type TutorProfile = {
  id: string;
  headline?: string | null;
  education?: string | null;
  certification?: string | null;
  languages?: string[] | null;
  sessionMode?: string | null;
  meetingPlatform?: string | null;
  availability?: string | null;
  status?: string | null;
  avgRating?: number | null;
  reviewCount?: number | null;
  yearsOfExperience?: number | null;
  timezone?: string | null;
  about?: string | null;
  user?: BookingUser | null;
};

export type Booking = {
  id: string;
  status: string;

  topic?: string | null;
  timezone?: string | null;

  startAt: string;
  endAt: string;
  durationMinutes: number;

  currency: string;
  hourlyRateSnapshot?: number | null;
  totalPrice: number;

  meetingLink?: string | null;

  createdAt: string;
  updatedAt?: string | null;
  completedAt?: string | null;

  cancelReason?: string | null;
  cancelled_by?: string | null;

  studentId?: string | null;
  student?: BookingUser | null;

  tutorProfile?: TutorProfile | null;

  review?: Review[]
};
