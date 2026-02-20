"use server";

import { cookies } from "next/headers";

async function getCookieHeader() {
    const cookieStore = await cookies();
    return cookieStore.toString();
}

export async function fetchAdminBookings(params: {
    page?: number;
    page_size?: number;
    search?: string;
}) {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");

    const { page = 1, page_size = 10 } = params;
    const search = params.search?.trim() ?? "";

    const url = new URL("/api/bookings", backend);

    url.searchParams.set("page", String(page));
    url.searchParams.set("page_size", String(page_size));
    if (search) url.searchParams.set("search", search);

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: { Cookie: await getCookieHeader() },
    });

    const json = await res.json();
    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch bookings");
    }

    return json;
}

export async function updateBookingStatus(payload: {
    status: string;
    cancelReason?: string;
    bookingId: string;
}) {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
    if (!payload.bookingId) throw new Error("bookingId missing");

    const url = new URL(`/api/bookings/${payload.bookingId}`, backend);

    const res = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
            Cookie: await getCookieHeader(),
            "content-type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to update booking");
    }

    return json;
}
