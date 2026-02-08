import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backend) {
            return NextResponse.json(
                { success: false, message: "NEXT_PUBLIC_BACKEND_URL missing" },
                { status: 500 }
            );
        }

        const body = await req.json();

        // forward cookies (Better Auth session cookie lives here)
        const cookieStore = await cookies();
        const cookieHeader = cookieStore
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");

        const url = new URL("/api/bookings", backend);

        const res = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            cache: "no-store",
            body: JSON.stringify(body),
        });

        const text = await res.text();
        const json = text ? JSON.parse(text) : null;

        return NextResponse.json(json, { status: res.status });
    } catch (e) {
        return NextResponse.json(
            { success: false, message: (e instanceof Error) ? e?.message : "Booking proxy failed" },
            { status: 500 }
        );
    }
}


export async function GET(req: Request) {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
        return NextResponse.json(
            { success: false, message: "NEXT_PUBLIC_BACKEND_URL missing" },
            { status: 500 }
        );
    }

    const url = new URL(req.url);
    const page = url.searchParams.get("page") ?? "1";
    const page_size = url.searchParams.get("page_size") ?? "10";
    const search = url.searchParams.get("search") ?? "";

    const target = new URL("/api/bookings", backend);
    target.searchParams.set("page", page);
    target.searchParams.set("page_size", page_size);
    if (search.trim().length > 0) target.searchParams.set("search", search.trim());

    const cookie = req.headers.get("cookie") ?? "";

    const res = await fetch(target.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: cookie,
        },
    });

    const json = await res.json().catch(() => null);

    return NextResponse.json(json ?? { success: false, message: "Invalid JSON" }, {
        status: res.status,
    });
}