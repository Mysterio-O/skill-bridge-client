'use server'

import { getAuthHeader, getCookieHeader } from "@/lib/auth/server-auth";



async function getBackendUrl() {
    return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
}


export async function getReviews() {
    const backend = await getBackendUrl();

    const url = new URL("/api/review", backend);

    const authHeaders = await getAuthHeader();
    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            ...authHeaders,
        },
    });

    const json = await res.json();

    // console.log(res, json)

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch tutor profile");
    }

    return json.data

}