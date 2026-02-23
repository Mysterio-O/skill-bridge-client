export class APIError extends Error {
  status?: number;
  data?: any;
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "APIError";
  }
}

import { buildAuthHeader } from "@/lib/auth/token";

export async function fetcher(input: RequestInfo, init?: RequestInit) {
  try {
    const authHeaders = buildAuthHeader();
    const headers = { ...(init && (init.headers as Record<string, string>)) || {}, ...authHeaders };
    const opts: RequestInit = { ...(init || {}), credentials: (init && init.credentials) || "include", headers };
    const res = await fetch(input, opts);
    const contentType = res.headers.get("content-type") || "";
    let body: any = null;

    if (contentType.includes("application/json")) {
      body = await res.json().catch(() => null);
    } else {
      body = await res.text().catch(() => null);
    }

    if (!res.ok) {
      const message = (body && (body.message || body.error)) || res.statusText || "Request failed";
      throw new APIError(message, res.status, body);
    }

    return body;
  } catch (err: any) {
    if (err instanceof APIError) throw err;
    throw new APIError(err?.message || "Network error");
  }
}
