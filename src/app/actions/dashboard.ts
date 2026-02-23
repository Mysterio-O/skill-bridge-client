"use server";

import { getAuthHeader, getCookieHeader } from "@/lib/auth/server-auth";
import type { DashboardApiResponse, DashboardStats } from "@/types/dashboard";

function getBackendUrl() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
    return backend;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const backend = getBackendUrl();
    const url = new URL("/api/dashboard", backend);

    const authHeaders = await getAuthHeader();
    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            ...authHeaders,
            Cookie: await getCookieHeader(),
        },
    });

    const json = (await res.json()) as DashboardApiResponse;

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch dashboard stats");
    }

    return json.data;
}
