
import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

function getCookieHeader(req: Request) {
	return req.headers.get("cookie") || "";
}

function parseCookies(cookieHeader: string) {
	const out: Record<string, string> = {};
	cookieHeader.split(";").forEach((c) => {
		const [k, ...v] = c.split("=");
		if (!k) return;
		out[k.trim()] = decodeURIComponent((v || []).join("=").trim());
	});
	return out;
}

async function proxyToBackend(path: string, init: RequestInit = {}) {
	const url = `${BACKEND}${path}`;
	const res = await fetch(url, init);
	const contentType = res.headers.get("content-type") || "";
	const body = contentType.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);
	return { res, body };
}

export async function POST(req: Request) {
	try {
		const url = new URL(req.url);
		const target = url.pathname.replace(/\/api\/auth/, "/api/authentication");

		const text = await req.text();

		// forward most headers (content-type, cookie, user-agent etc.) to backend
		const forwardedHeaders: Record<string, string> = {};
		req.headers.forEach((value, key) => {
			if (key.toLowerCase() === "host") return;
			forwardedHeaders[key] = value;
		});

		// if cookie contains token, add Authorization header for backend
		try {
			const cookieHeader = getCookieHeader(req);
			const cookies = parseCookies(cookieHeader);
			const tokenFromCookie = cookies["sb_token"] || cookies["sb_token_client"];
			console.log(`[PROXY POST] ${target} - Cookie header: ${cookieHeader ? 'present' : 'MISSING'}, Token from cookie: ${tokenFromCookie ? 'found' : 'NOT found'}`);
			if (tokenFromCookie && !forwardedHeaders["authorization"] && !forwardedHeaders["Authorization"]) {
				forwardedHeaders["authorization"] = `Bearer ${tokenFromCookie}`;
				console.log(`[PROXY POST] Added Authorization header with token (length: ${tokenFromCookie.length})`);
			}
		} catch (e) {
			console.log('[PROXY POST] Error processing cookies:', e);
			// ignore
		}

		const { res, body } = await proxyToBackend(target, { method: "POST", headers: forwardedHeaders, body: text });

		// If this is a login request, set httpOnly cookie with token
		if (target.endsWith("/login") && res.ok && body && (body.data?.token || body.token)) {
			// Token can be at body.token or body.data.token depending on backend response format
			const token = (body.data?.token || body.token) as string;
			const maxAge = 7 * 24 * 60 * 60; // 7 days
			const secure = process.env.NODE_ENV === "production";

			// HttpOnly cookie for server verification
			const serverCookie = `sb_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
			// Non-HttpOnly client cookie so frontend can read token if needed (convenience only)
			const clientCookie = `sb_token_client=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;

			console.log(`[PROXY POST] Login successful - Setting cookies (token length: ${token.length})`);

			const nextRes = NextResponse.json(body, { status: res.status });
			// append both Set-Cookie headers
			nextRes.headers.append("Set-Cookie", serverCookie);
			nextRes.headers.append("Set-Cookie", clientCookie);
			return nextRes;
		}

		// If this is a logout request, clear the cookie locally
		if (target.endsWith("/logout") || url.pathname.endsWith("/logout")) {
			const secure = process.env.NODE_ENV === "production";
			const serverClear = `sb_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
			const clientClear = `sb_token_client=; Path=/; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
			const nextRes = NextResponse.json({ success: true }, { status: 200 });
			nextRes.headers.append("Set-Cookie", serverClear);
			nextRes.headers.append("Set-Cookie", clientClear);
			return nextRes;
		}

		return NextResponse.json(body, { status: res.status });
	} catch (err: any) {
		console.log('[PROXY POST] Error:', err);
		return NextResponse.json({ error: err?.message || "Proxy error" }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const target = url.pathname.replace(/\/api\/auth/, "/api/authentication");

		// Handle /api/auth/me specially by reading sb_token cookie
		if (target.endsWith("/me")) {
			// forward incoming cookies to backend so backend can verify session
			const forwardedHeaders: Record<string, string> = {};
			req.headers.forEach((value, key) => {
				if (key.toLowerCase() === "host") return;
				forwardedHeaders[key] = value;
			});

			// if cookie contains token, add Authorization header for backend
			try {
				const cookieHeader = getCookieHeader(req);
				const cookies = parseCookies(cookieHeader);
				const tokenFromCookie = cookies["sb_token"] || cookies["sb_token_client"];
				console.log(`[PROXY GET] ${target} - Cookie header: ${cookieHeader ? 'present' : 'MISSING'}, Token from cookie: ${tokenFromCookie ? 'found' : 'NOT found'}`);
				if (tokenFromCookie && !forwardedHeaders["authorization"] && !forwardedHeaders["Authorization"]) {
					forwardedHeaders["authorization"] = `Bearer ${tokenFromCookie}`;
					console.log(`[PROXY GET /me] Added Authorization header with token (length: ${tokenFromCookie.length})`);
				}
			} catch (e) {
				console.log('[PROXY GET /me] Error processing cookies:', e);
				// ignore
			}

			const { res, body } = await proxyToBackend(target, { method: "GET", headers: forwardedHeaders });
			return NextResponse.json(body, { status: res.status });
		}

		// Generic GET proxy: forward headers as well
		const forwardedHeaders: Record<string, string> = {};
		req.headers.forEach((value, key) => {
			if (key.toLowerCase() === "host") return;
			forwardedHeaders[key] = value;
		});
		try {
			const cookieHeader = getCookieHeader(req);
			const cookies = parseCookies(cookieHeader);
			const tokenFromCookie = cookies["sb_token"] || cookies["sb_token_client"];
			console.log(`[PROXY GET] ${target} - Cookie header: ${cookieHeader ? 'present' : 'MISSING'}, Token from cookie: ${tokenFromCookie ? 'found' : 'NOT found'}`);
			if (tokenFromCookie && !forwardedHeaders["authorization"] && !forwardedHeaders["Authorization"]) {
				forwardedHeaders["authorization"] = `Bearer ${tokenFromCookie}`;
				console.log(`[PROXY GET] Added Authorization header with token (length: ${tokenFromCookie.length})`);
			}
		} catch (e) {
			console.log('[PROXY GET] Error processing cookies:', e);
			// ignore
		}

		const { res, body } = await proxyToBackend(target, { method: "GET", headers: forwardedHeaders });
		return NextResponse.json(body, { status: res.status });
	} catch (err: any) {
		console.log('[PROXY GET] Error:', err);
		return NextResponse.json({ error: err?.message || "Proxy error" }, { status: 500 });
	}
}
