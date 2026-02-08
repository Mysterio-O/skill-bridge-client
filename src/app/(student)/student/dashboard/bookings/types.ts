export type BTutorProfile = {
    about: string;
    availability: 'available' | 'not_available';
    avgRating: string | number | null;
    cancelReason: string | null;
    cancelledById: string | null;
    certification: string;
    createdAt: string;
    currency: string;
    education: string;
    headline: string;
    hourlyRate: string;
    id: string;
    isActive: boolean;
    isProfileComplete: boolean;
    languages: string[];
    meetingPlatform: 'zoom' | 'google_meet' | 'others';
    reviewCount: number;
    sessionMode: 'online' | 'in_person' | 'hybrid';
    status: 'pending' | 'active' | 'cancelled';
    subjects: string[] | [];
    timezone: string;
    updatedAt: string;
    userId: string;
    yearsOfExperience: number;
    user: {
        email: string;
        name: string;
        phone: string | number | null;
    }
}

export type Booking = {
    cancelReason: string | null;
    cancelled_by: string | null;
    completedAt: string | null;
    createdAt: string;
    currency: string;
    durationMinutes: number;
    endAt: string;
    hourlyRateSnapshot: string;
    id: string;
    meetingLink: string | null;
    review: string | null;
    startAt: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    student: {
        email: string;
        name: string;
        phone: string | number | null;
    };
    studentId: string;
    timezone: string;
    topic: string | null;
    totalPrice: string;
    tutorProfile: BTutorProfile;
    tutorProfileId: string;
    updatedAt: string;
};


export type BPagination = {
    page: number;
    page_size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};


export interface BookingsResponse {
    success: boolean;
    bookings: Booking[];
    pagination: BPagination;
    message: string
}