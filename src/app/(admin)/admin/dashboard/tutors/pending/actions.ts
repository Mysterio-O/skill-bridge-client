"use server";

import { revalidatePath } from "next/cache";
import type { PendingAppsResponse } from "./types";
import { cookies } from "next/headers";

async function getCookieHeader() {
    const cookieStore = await cookies();
    return cookieStore.toString();
}

export async function fetchPendingApplications(params: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<PendingAppsResponse> {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");

    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const search = params.search?.trim() ?? "";

    const url = new URL("/api/tutor/applications/pending", backend);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (search) url.searchParams.set("search", search);

    // console.log(await getCookieHeader());

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    const json = (await res.json()) as PendingAppsResponse;
    if (!res.ok || !json.success) {
        throw new Error(json?.message || "Failed to fetch pending applications");
    }
    return json;
}

export async function adminUpdateTutorApplicationStatus(input: {
    applicationId: string;
    status: "active" | "cancelled";
}) {

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");

    // console.log(input.applicationId)

    const url = new URL(`/api/tutor/${input.applicationId}/update`, backend);

    // console.log(url.toString());

    const res = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            Cookie: await getCookieHeader(),
        },
        body: JSON.stringify({ status: input.status })
    });

    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json?.message || "Failed to update application");

    revalidatePath("/admin/dashboard/tutors/pending");
    return json;
}

export async function adminDeleteTutorApplication(input: { applicationId: string }) {

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");

    const url = new URL(`/api/admin/users/tutor-applications/${input.applicationId}`, backend);

    const res = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            Cookie: await getCookieHeader(),
        }
    });

    const json = await res.json();

    console.log(res,json)

    if (!res.ok || !json.success) throw new Error(json?.message || "Failed to delete application");

    revalidatePath("/admin/dashboard/tutors/pending");
    return json;
}
