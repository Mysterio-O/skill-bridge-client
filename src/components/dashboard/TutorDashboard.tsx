import { CalendarClock, BadgeCheck, Star, Wallet } from "lucide-react";
import type { TutorStats } from "@/types/dashboard";
import StatCard from "./StatCard";
import SectionCard from "./SectionCard";
import RecentBookingsTable from "./RecentBookingsTable";
import { formatCurrency } from "./dashboard-utils";

export default function TutorDashboard({ data }: { data: TutorStats }) {
    const { profile, bookings, reviews, recentBookings } = data;

    if (!profile.exists) {
        return (
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-800/70 dark:bg-white/5">
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    No tutor profile found
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Complete your tutor profile to start receiving bookings.
                </p>
            </div>
        );
    }

    const rows = recentBookings.map((b) => ({
        id: b.id,
        status: b.status,
        startAt: b.startAt,
        endAt: b.endAt,
        currency: b.currency,
        totalPrice: b.totalPrice,
        title: b.student?.name || "Student",
        subtitle: b.student?.email || "",
    }));

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<BadgeCheck className="h-5 w-5" />} label="Profile Status" value={(profile.status || "unknown").replaceAll("_", " ")} hint={profile.isProfileComplete ? "Complete" : "Incomplete"} />
                <StatCard icon={<CalendarClock className="h-5 w-5" />} label="Upcoming Sessions" value={bookings.upcomingCount} hint={`Total: ${bookings.total}`} />
                <StatCard icon={<Star className="h-5 w-5" />} label="Avg Rating" value={reviews.avgRating.toFixed(1)} hint={`${reviews.visible} visible • ${reviews.hidden} hidden`} />
                <StatCard icon={<Wallet className="h-5 w-5" />} label="Hourly Rate" value={formatCurrency(profile.hourlyRate, profile.currency || "USD")} hint={profile.isActive ? "Active" : "Inactive"} />
            </div>

            <SectionCard title="Recent Bookings">
                <RecentBookingsTable rows={rows} />
            </SectionCard>
        </div>
    );
}
