import { fetchTutorBookings } from "./actions";
import TutorBookingsClient from "./components/TutorBookingClient";

export default async function TutorBookingsPage() {
    const initial = await fetchTutorBookings({ page: 1, page_size: 10 });

    return (
        <div className="px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground">My Bookings</h1>
                <p className="text-sm text-muted-foreground">
                    View your sessions, students, and meeting links.
                </p>
            </div>

            <TutorBookingsClient
                initialBookings={initial.data.bookings}
                initialPagination={initial.data.pagination}
            />
        </div>
    );
}
