import { fetchPendingApplications } from "./actions";
import PendingApplicationsTable from "./components/PendingApplicationsTable";

export default async function PendingTutorApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
    const sp = await searchParams;

    const page = Number(sp.page ?? 1) || 1;
    const limit = Number(sp.limit ?? 10) || 10;
    const search = (sp.search ?? "").toString();

    const data = await fetchPendingApplications({ page, limit, search });

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-xl font-semibold text-foreground">
                    Pending Applications
                </h1>
                <p className="text-sm text-muted-foreground">
                    Review tutor applications. Approve or cancel from the details panel.
                </p>
            </div>

            <PendingApplicationsTable initial={data} />
        </div>
    );
}
