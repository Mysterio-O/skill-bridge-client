import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { getDashboardStats } from "@/app/actions/dashboard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function StudentDashboardPage() {
    const data = await getDashboardStats();

    return (
        <DashboardShell
            title="Student Dashboard"
            description="Track your sessions, upcoming bookings, and reviews you left."
        >
            {data.role === "student" ? (
                <StudentDashboard data={data} />
            ) : (
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 dark:border-slate-800/70 dark:bg-white/5">
                    <div className="text-slate-900 dark:text-slate-100 font-semibold">
                        Access mismatch
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        Your account is not a student.
                    </p>
                </div>
            )}
        </DashboardShell>
    );
}
