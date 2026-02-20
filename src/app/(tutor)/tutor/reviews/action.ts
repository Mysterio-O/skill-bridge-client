'use server'

import { cookies } from "next/headers";



async function getCookieHeader() {
    const cookieStore = await cookies();
    return cookieStore.toString();
}

function getBackendUrl() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
    return backend;
}


export async function getReviews() {
    const backend = getBackendUrl();

    const url = new URL("/api/review", backend);

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    const json = await res.json();

    // console.log(res, json)

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch tutor profile");
    }

    return json.data

}