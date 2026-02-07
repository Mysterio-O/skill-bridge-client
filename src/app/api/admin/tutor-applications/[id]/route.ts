import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function forwardCookieHeader() {
    const cookieStore = await cookies();
    return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backend) {
            return NextResponse.json(
                { success: false, message: "NEXT_PUBLIC_BACKEND_URL missing" },
                { status: 500 }
            );
        }

        const { id } = await ctx.params;
        const body = await req.json();

        const url = new URL(`/api/tutor/applications/${id}`, backend);
        const res = await fetch(url.toString(), {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                Cookie: await forwardCookieHeader(),
            },
            body: JSON.stringify(body),
        });

        const text = await res.text();
        const json = text ? JSON.parse(text) : null;

        return NextResponse.json(json, { status: res.status });
    } catch (e) {
        return NextResponse.json(
            { success: false, message: (e instanceof Error) ? e?.message : "Proxy PATCH failed" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backend) {
            return NextResponse.json(
                { success: false, message: "NEXT_PUBLIC_BACKEND_URL missing" },
                { status: 500 }
            );
        }

        const { id } = await ctx.params;

        const url = new URL(`/api/tutor/applications/${id}`, backend);
        const res = await fetch(url.toString(), {
            method: "DELETE",
            cache: "no-store",
            headers: {
                Cookie: await forwardCookieHeader(),
            },
        });

        const text = await res.text();
        const json = text ? JSON.parse(text) : null;

        return NextResponse.json(json, { status: res.status });
    } catch (e) {
        return NextResponse.json(
            { success: false, message: (e instanceof Error) ? e?.message : "Proxy DELETE failed" },
            { status: 500 }
        );
    }
}
