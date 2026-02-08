import { fetchBookings } from "./actions";
import StudentBookingsClient from "./components/StudentBookingsClient";

export default async function StudentBookingsPage() {
  const initial = await fetchBookings({ page: 1, page_size: 10 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          View your sessions, details, and meeting links.
        </p>
      </div>

      <StudentBookingsClient
        initialBookings={initial.data.bookings}
        initialPagination={initial.data.pagination}
      />
    </div>
  );
}
