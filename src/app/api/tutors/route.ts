import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backend) {
      return NextResponse.json(
        { success: false, message: "NEXT_PUBLIC_BACKEND_URL missing" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";
    const search = searchParams.get("search");

    const url = new URL("/api/tutor", backend);
    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);
    if (search) url.searchParams.set("search", search);

    const res = await fetch(url.toString(), { cache: "no-store" });

    const text = await res.text();
    // backend returns json; keep safe
    const json = text ? JSON.parse(text) : null;

    return NextResponse.json(json, { status: res.status });
  } catch (e) {
    console.log('error in /api/tutors:', e);
    return NextResponse.json(
      { success: false, message:(e instanceof Error)? e?.message : "Proxy failed" },
      { status: 500 }
    );
  }
}
