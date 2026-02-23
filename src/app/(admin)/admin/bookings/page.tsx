import { fetchAdminBookings } from "./actions";
import AdminBookingsClient from "./components/AdminBookingsClient";

export default async function AdminBookingsPage() {
    const initial = await fetchAdminBookings({ page: 1, page_size: 10 });

    return (
        <div className="mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground">All Bookings</h1>
                <p className="text-sm text-muted-foreground">
                    View and manage all bookings across tutors and students.
                </p>
            </div>

            <AdminBookingsClient
                initialBookings={initial.data.bookings}
                initialPagination={initial.data.pagination}
            />
        </div>
    );
}
