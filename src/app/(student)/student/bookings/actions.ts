'use server'

import { getAuthHeader, getCookieHeader } from "@/lib/auth/server-auth";

export async function fetchBookings(params: {
    page?: number;
    page_size?: number;
    search?: string
}) {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");

    const { page = 1, page_size = 10 } = params;
    const search = params.search?.trim() ?? "";

    const url = new URL("/api/bookings", backend);

    url.searchParams.set("page", String(page));
    url.searchParams.set("page_size", String(page_size));
    if (search.length > 0) url.searchParams.set("search", search);

    const authHeaders = await getAuthHeader();
    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            ...authHeaders,
            Cookie: await getCookieHeader()
        }
    });

    const json = await res.json();

    // console.log(res,"\n",json);

    if (!res.ok || !json.success) {
        throw new Error(json?.message || "Failed to fetch bookings")
    };

    return json;

};


export async function updateBookingStatus(payload: {
    status: string;
    cancelReason?: string;
    bookingId: string;
}) {
    try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");

        if (!payload.bookingId) throw new Error("booking id missing")

        const url = new URL(`/api/bookings/${payload.bookingId}`, backend);

        const authHeaders = await getAuthHeader();
        const res = await fetch(url.toString(), {
            method: "PATCH",
            headers: {
                ...authHeaders,
                Cookie: await getCookieHeader(),
                "content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const json = await res.json();

        console.log(res, '\n', json);

        if (!res.ok || !json.success) {
            throw new Error(json?.message || 'Failed to update booking status');
        }

        return json;

    }
    catch (e) {
        console.error('error updating booking status', e);
    }
}



export async function postReview(payload: {
    tutorId: string;
    bookingId: string;
    rating: number;
    comment?: string;
}) {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");

    if (!payload.bookingId) throw new Error("bookingId missing");
    if (typeof payload.rating !== "number") throw new Error("rating missing");

    const url = new URL("/api/review", backend);

    const authHeaders = await getAuthHeader();
    const res = await fetch(url.toString(), {
        method: "POST",
        cache: "no-store",
        headers: {
            ...authHeaders,
            Cookie: await getCookieHeader(),
            "content-type": "application/json",
        },
        body: JSON.stringify({
            tutorId: payload.tutorId,
            bookingId: payload.bookingId,
            rating: payload.rating,
            comment: payload.comment?.trim() || undefined,
        }),
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to submit review");
    }

    return json;
}