// Server-side auth helpers (Next.js server actions)
import { cookies } from "next/headers";

export async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const cookieStore = await cookies();
    // Try to read HttpOnly server cookie first (set by proxy)
    const httpOnlyToken = cookieStore.get("sb_token")?.value;
    // Fallback to client cookie if available
    const clientToken = cookieStore.get("sb_token_client")?.value;
    const token = httpOnlyToken || clientToken;

    if (!token) {
      console.log('[SERVER AUTH] No token found in cookies');
      return {};
    }
    console.log(`[SERVER AUTH] Token found (length: ${token.length}), returning Authorization header`);
    return { Authorization: `Bearer ${token}` };
  } catch (e) {
    console.log('[SERVER AUTH] Error getting auth header:', e);
    return {};
  }
}

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore.toString();
  console.log(`[SERVER AUTH] Cookie header length: ${cookieStr.length}`);
  return cookieStr;
}

