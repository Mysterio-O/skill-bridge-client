import type { Category, MeResponse } from "./types";
import type { BecomeTutorValues } from "./schema";

function getBase() {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!base) throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
    return base;
}

export async function fetchMe(): Promise<MeResponse | null> {
    const base = getBase();

    const res = await fetch(`${base}/api/authentication/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) return json ?? null;
    return json ?? null;
}

export async function fetchCategories(): Promise<Category[]> {
    const base = getBase();

    const endpoints = [
        `${base}/api/categories`,
        `${base}/api/category`,
        `${base}/api/tutor/categories`,
    ];

    for (const url of endpoints) {
        const res = await fetch(url, { cache: "no-store", credentials: "include" });
        const json = await res.json().catch(() => null);

        if (!res.ok) continue;

        // allow plain array or {data: []} or {categories: []}
        const arr: Category[] | null =
            Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.categories) ? json.categories : null;

        if (arr) return arr.filter((c) => c?.isActive !== false);
    }

    return [];
}

export async function submitTutorApplication({ id, values }: { id: string, values: BecomeTutorValues }) {
    const base = getBase();

    const payload = {
        id,
        data: {
            headline: values.headline?.trim() || null,
            about: values.about?.trim() || null,

            // keep as string for Decimal safety
            hourlyRate: Number(values.hourlyRate),
            currency: values.currency.trim().toUpperCase(),

            yearsOfExperience: values.yearsOfExperience ?? null,
            languages: values.languages,

            education: values.education?.trim() || null,
            certification: values.certification?.trim() || null,

            sessionMode: values.sessionMode,
            meetingPlatform: values.meetingPlatform,

            timezone: values.timezone?.trim() || null,
            availability: values.availability,

            // backend can create TutorSubjects from these
            subjects: values.categoryIds,
        },
    };

    const res = await fetch(`${base}/api/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    return { res, json };
}
