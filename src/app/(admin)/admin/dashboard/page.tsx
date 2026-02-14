import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { getDashboardStats } from "@/app/actions/dashboard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function AdminDashboardPage() {
  const data = await getDashboardStats();

  return (
    <DashboardShell
      title="Admin Dashboard"
      description="Platform-wide stats, bookings and tutor applications."
    >
      {data.role === "admin" ? (
        <AdminDashboard data={data} />
      ) : (
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 dark:border-slate-800/70 dark:bg-white/5">
          <div className="text-slate-900 dark:text-slate-100 font-semibold">
            Access mismatch
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Your account is not an admin.
          </p>
        </div>
      )}
    </DashboardShell>
  );
}
