import { headers } from "next/headers";


async function getCookieHeader() {
    const h = await headers();
    return h.get("cookie") ?? "";
}

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

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: await getCookieHeader()
        }
    });

    const json = await res.json();

    // console.log(res,"\n",json);

    if (!res.ok || !json.success) {
        throw new Error(json?.message || "Failed to fetch bookings")
    };

    return json;

}