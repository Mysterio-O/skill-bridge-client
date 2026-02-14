import { Users, GraduationCap, UserCheck, Layers, CalendarCheck, Star } from "lucide-react";
import type { AdminStats } from "@/types/dashboard";
import StatCard from "./StatCard";
import SectionCard from "./SectionCard";
import RecentBookingsTable from "./RecentBookingsTable";

export default function AdminDashboard({ data }: { data: AdminStats }) {
    const { totals, bookings, recent } = data;

    const recentRows = recent.recentBookings.map((b) => ({
        id: b.id,
        status: b.status,
        startAt: b.startAt,
        endAt: b.endAt,
        currency: b.currency,
        totalPrice: b.totalPrice,
        title: b.student?.name || "Student",
        subtitle: `Tutor: ${b.tutorProfile?.user?.name || "Tutor"}`,
    }));

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<Users className="h-5 w-5" />} label="Total Users" value={totals.users} />
                <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Students" value={totals.students} />
                <StatCard icon={<UserCheck className="h-5 w-5" />} label="Tutors" value={totals.tutors} hint={`${totals.tutorApplicationsActive} active`} />
                <StatCard icon={<Layers className="h-5 w-5" />} label="Categories" value={totals.categories} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard icon={<CalendarCheck className="h-5 w-5" />} label="Bookings Total" value={totals.bookingsTotal} hint={`Pending ${bookings.pending} • Confirmed ${bookings.confirmed}`} />
                <StatCard icon={<Star className="h-5 w-5" />} label="Reviews Total" value={totals.reviewsTotal} />
                <StatCard icon={<UserCheck className="h-5 w-5" />} label="Tutor Applications Pending" value={totals.tutorApplicationsPending} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <SectionCard title="Recent Bookings">
                    <RecentBookingsTable rows={recentRows} />
                </SectionCard>

                <SectionCard title="Pending Tutor Applications">
                    <div className="space-y-3">
                        {recent.pendingTutorApplications.length ? (
                            recent.pendingTutorApplications.map((a) => (
                                <div
                                    key={a.id}
                                    className="rounded-xl border border-slate-200/70 bg-white/60 p-3 dark:border-slate-800/70 dark:bg-white/5"
                                >
                                    <div className="font-medium text-slate-900 dark:text-slate-100">
                                        {a.user.name || "Unnamed"}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {a.user.email}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-sm text-slate-600 dark:text-slate-400">
                                No pending applications.
                            </div>
                        )}
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}
