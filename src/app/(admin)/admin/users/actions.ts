"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { GetUsersParams, GetUsersResult, UpdateUserStatusPayload, AdminUserDTO } from "./types";

async function getCookieHeader() {
    const cookieStore = await cookies();
    return cookieStore.toString();
}

function getBackendUrl() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
    return backend;
}

const ADMIN_USERS_PATH = "/api/admin/users";

export async function getAdminUsersAction(params: GetUsersParams): Promise<GetUsersResult> {
    const backend = getBackendUrl();

    const url = new URL(ADMIN_USERS_PATH, backend);
    if (params.search) url.searchParams.set("search", params.search);
    if (params.page) url.searchParams.set("page", String(params.page));
    if (params.limit) url.searchParams.set("limit", String(params.limit));

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: await getCookieHeader(),
        },
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch users");
    }

    const meta = json?.data?.meta;
    const users = json?.data?.users;

    if (!meta || !Array.isArray(users)) {
        throw new Error("Malformed response from server (meta/users missing).");
    }

    return { meta, users };
}

export async function updateAdminUserStatusAction(
    payload: UpdateUserStatusPayload
): Promise<AdminUserDTO> {
    const backend = getBackendUrl();

    const url = new URL(`${ADMIN_USERS_PATH}/${payload.userId}`, backend);

    const body: Record<string, string> = { status: payload.status };
    if (payload.status === "banned" && payload.banReason?.trim()) {
        body.banReason = payload.banReason.trim();
    }

    const res = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: await getCookieHeader(),
        },
        body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to update user");
    }

    const user = json?.user ?? json?.data;

    if (!user) {
        throw new Error("Malformed response from server (updated user missing).");
    }

    revalidatePath("/admin/users");
    return user as AdminUserDTO;
}
