import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB (your limit)
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function POST(req: Request) {
    try {
        const key = process.env.IMGBB_API_KEY;
        if (!key) {
            return NextResponse.json(
                { message: "IMGBB_API_KEY is missing in env" },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { message: "No file found. Expected form field 'file'." },
                { status: 400 }
            );
        }

        // Validate type & size (same rules as your zod)
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { message: "Only JPG, PNG, WEBP are allowed." },
                { status: 400 }
            );
        }

        if (file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json(
                { message: "Image must be 2MB or less." },
                { status: 400 }
            );
        }

        // Convert file -> base64 (ImgBB supports base64 uploads)
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");

        // Send to ImgBB
        const body = new URLSearchParams();
        body.set("image", base64);
        body.set("name", file.name); // optional

        // Optional expiration (seconds). Example: 1 day:
        // body.set("expiration", String(60 * 60 * 24));

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
        });

        const json = await imgbbRes.json();

        if (!imgbbRes.ok || !json?.success) {
            return NextResponse.json(
                {
                    message: json?.error?.message || "ImgBB upload failed",
                    raw: json,
                },
                { status: 400 }
            );
        }

        // ImgBB returns multiple URLs. We’ll use the direct one.
        const url = json.data?.url as string | undefined;
        const displayUrl = json.data?.display_url as string | undefined;

        return NextResponse.json({
            url, // direct
            displayUrl, // page-friendly
            deleteUrl: json.data?.delete_url, // optional
        });
    } catch (err) {
        return NextResponse.json(
            { message: (err instanceof Error) ? err?.message : "Upload error" },
            { status: 500 }
        );
    }
}
