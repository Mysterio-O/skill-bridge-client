// Helpers for reading/using auth token from client cookie

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const name = "sb_token_client=";
  const decoded = decodeURIComponent(document.cookie || "");
  const parts = decoded.split(";");
  for (const p of parts) {
    const s = p.trim();
    if (s.indexOf(name) === 0) return s.substring(name.length);
  }
  return null;
}

export function buildAuthHeader(): Record<string, string> {
  const token = getTokenFromCookie();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export default { getTokenFromCookie, buildAuthHeader };
