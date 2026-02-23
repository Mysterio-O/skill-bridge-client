"use server";

import { getAuthHeader, getCookieHeader } from "@/lib/auth/server-auth";
import { revalidatePath } from "next/cache";
import type { StudentProfileDTO, UpdateStudentProfilePayload } from "./types";

function getBackendUrl() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) throw new Error("NEXT_PUBLIC_BACKEND_URL missing");
    return backend;
}

const STUDENT_ME_PATH = "/api/authentication/me";
const STUDENT_UPDATE_PROFILE_PATH = "/api/users/profile";

export async function getStudentProfileAction(): Promise<StudentProfileDTO> {
    const backend = getBackendUrl();
    const url = new URL(STUDENT_ME_PATH, backend);

    const authHeaders = await getAuthHeader();
    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            ...authHeaders,
            Cookie: await getCookieHeader(),
        },
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch student profile");
    }

    return json.user as StudentProfileDTO;
}

export async function updateStudentProfileAction(
    payload: UpdateStudentProfilePayload
): Promise<StudentProfileDTO> {
    const backend = getBackendUrl();
    const url = new URL(STUDENT_UPDATE_PROFILE_PATH, backend);

    const authHeaders = await getAuthHeader();
    const res = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders,
            Cookie: await getCookieHeader(),
        },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to update student profile");
    }

    revalidatePath("/student/settings");

    return json.data as StudentProfileDTO;
}
