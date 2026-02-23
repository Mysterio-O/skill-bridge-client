import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    const origin = url.origin;

    const redirectTo = token ? `${origin}/verify-email?token=${encodeURIComponent(token)}` : `${origin}/verify-email`;

    return NextResponse.redirect(redirectTo);
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
