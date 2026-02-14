import { CalendarClock, Star, ClipboardList, BadgeCheck } from "lucide-react";
import type { StudentStats } from "@/types/dashboard";
import StatCard from "./StatCard";
import SectionCard from "./SectionCard";
import RecentBookingsTable from "./RecentBookingsTable";

export default function StudentDashboard({ data }: { data: StudentStats }) {
    const { bookings, reviews, recentBookings } = data;

    const rows = recentBookings.map((b) => ({
        id: b.id,
        status: b.status,
        startAt: b.startAt,
        endAt: b.endAt,
        currency: b.currency,
        totalPrice: b.totalPrice,
        title: b.tutorProfile?.user?.name || "Tutor",
        subtitle: b.tutorProfile?.user?.email || "",
    }));

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Total Bookings" value={bookings.total} />
                <StatCard icon={<CalendarClock className="h-5 w-5" />} label="Upcoming" value={bookings.upcomingCount} hint={`Pending ${bookings.pending} • Confirmed ${bookings.confirmed}`} />
                <StatCard icon={<Star className="h-5 w-5" />} label="Avg Rating Given" value={reviews.avgRatingGiven.toFixed(1)} hint={`${reviews.total} total`} />
                <StatCard icon={<BadgeCheck className="h-5 w-5" />} label="Completed" value={bookings.completed} hint={`Cancelled ${bookings.cancelled}`} />
            </div>

            <SectionCard title="Recent Bookings">
                <RecentBookingsTable rows={rows} />
            </SectionCard>
        </div>
    );
}
