import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getBackendUrl() {
    // Prefer server-only env (safer). Fallback to NEXT_PUBLIC if you must.
    const backend =
        process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backend) throw new Error("BACKEND_URL (or NEXT_PUBLIC_BACKEND_URL) missing");
    return backend;
}
function getCookieValue(cookieHeader: string, name: string) {
    const parts = cookieHeader.split(";").map((p) => p.trim());
    for (const p of parts) {
        if (p.startsWith(name + "=")) return decodeURIComponent(p.slice(name.length + 1));
    }
    return null;
}

function buildUpstreamHeaders(req: Request) {
    const headers: Record<string, string> = {};

    const auth = req.headers.get("authorization");
    const cookie = req.headers.get("cookie") || "";

    // always forward cookies
    if (cookie) headers["cookie"] = cookie;

    // forward auth if present
    if (auth) {
        headers["authorization"] = auth;
        return headers;
    }

    // ✅ fallback: build Authorization from sb_token_client cookie
    const token = cookie ? getCookieValue(cookie, "sb_token_client") : null;
    if (token) headers["authorization"] = `Bearer ${token}`;

    return headers;
}

export async function POST(req: Request) {
    try {
        const backend = getBackendUrl();

        // ✅ Keep body as raw text (prevents JSON parse issues & preserves exactly)
        const bodyText = await req.text();

        const url = new URL("/api/bookings", backend);

        const res = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...buildUpstreamHeaders(req),
            },
            body: bodyText,
            cache: "no-store",
        });

        const text = await res.text();
        const contentType = res.headers.get("content-type") || "application/json";

        // ✅ Return upstream response as-is
        return new NextResponse(text, {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                message: e instanceof Error ? e.message : "Booking proxy failed",
            },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const backend = getBackendUrl();

        const incomingUrl = new URL(req.url);
        const target = new URL("/api/bookings", backend);

        // ✅ Forward query params
        for (const [k, v] of incomingUrl.searchParams.entries()) {
            target.searchParams.set(k, v);
        }

        const res = await fetch(target.toString(), {
            method: "GET",
            headers: {
                ...buildUpstreamHeaders(req),
            },
            cache: "no-store",
        });

        const text = await res.text();
        const contentType = res.headers.get("content-type") || "application/json";

        return new NextResponse(text, {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                message: e instanceof Error ? e.message : "Booking proxy failed",
            },
            { status: 500 }
        );
    }
}