export type AdminStats = {
    role: "admin";
    totals: {
        users: number;
        students: number;
        tutors: number;
        tutorApplicationsPending: number;
        tutorApplicationsActive: number;
        categories: number;
        bookingsTotal: number;
        reviewsTotal: number;
    };
    bookings: {
        pending: number;
        confirmed: number;
        in_progress: number;
        completed: number;
        cancelled: number;
    };
    recent: {
        recentBookings: Array<{
            id: string;
            status: string;
            startAt: string;
            endAt: string;
            currency: string;
            totalPrice: number;
            student: { id: string; name: string; email: string };
            tutorProfile: {
                id: string;
                user: { id: string; name: string; email: string };
            };
        }>;
        pendingTutorApplications: Array<{
            id: string;
            createdAt: string;
            user: { id: string; name: string; email: string; image: string | null };
        }>;
    };
};

export type TutorStats = {
    role: "tutor";
    profile: {
        exists: boolean;
        status?: string;
        availability?: string;
        isActive?: boolean;
        isProfileComplete?: boolean;
        avgRating?: number;
        reviewCount?: number;
        hourlyRate?: number;
        currency?: string;
    };
    bookings: {
        total: number;
        pending: number;
        confirmed: number;
        in_progress: number;
        completed: number;
        cancelled: number;
        upcomingCount: number;
    };
    reviews: {
        total: number;
        visible: number;
        hidden: number;
        avgRating: number;
        latest: Array<{
            id: string;
            rating: number;
            comment: string | null;
            isHidden: boolean;
            createdAt: string;
            student: { id: string; name: string; email: string };
            booking: { id: string; completedAt: string | null; durationMinutes: number };
        }>;
    };
    recentBookings: Array<{
        id: string;
        status: string;
        startAt: string;
        endAt: string;
        durationMinutes: number;
        currency: string;
        totalPrice: number;
        student: { id: string; name: string; email: string; image: string | null };
    }>;
};

export type StudentStats = {
    role: "student";
    bookings: {
        total: number;
        pending: number;
        confirmed: number;
        in_progress: number;
        completed: number;
        cancelled: number;
        upcomingCount: number;
    };
    reviews: {
        total: number;
        avgRatingGiven: number;
        latest: Array<{
            id: string;
            rating: number;
            comment: string | null;
            createdAt: string;
            tutor: { id: string; name: string; email: string };
            booking: { id: string; completedAt: string | null; durationMinutes: number };
        }>;
    };
    recentBookings: Array<{
        id: string;
        status: string;
        startAt: string;
        endAt: string;
        durationMinutes: number;
        currency: string;
        totalPrice: number;
        tutorProfile: {
            id: string;
            user: { id: string; name: string; email: string; image: string | null };
        };
    }>;
};

export type DashboardStats = AdminStats | TutorStats | StudentStats;

export type DashboardApiResponse = {
    success: boolean;
    message: string;
    data: DashboardStats;
};
