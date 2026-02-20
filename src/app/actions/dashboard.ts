"use server";

import { cookies } from "next/headers";
import type { DashboardApiResponse, DashboardStats } from "@/types/dashboard";

async function getCookieHeader() {
    const cookieStore = await cookies();
    return cookieStore.toString();
}

function getBackendUrl() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
    return backend;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const backend = getBackendUrl();
    const url = new URL("/api/dashboard", backend);

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    const json = (await res.json()) as DashboardApiResponse;

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch dashboard stats");
    }

    return json.data;
}
