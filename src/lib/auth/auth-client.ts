
import React from "react";
import { fetcher, APIError } from "@/lib/fetcher";
import { buildAuthHeader } from "@/lib/auth/token";

type SessionResponse = { user: any } | null;

function useSessionHook() {
    const [data, setData] = React.useState<SessionResponse | null>(null);
    const [isPending, setPending] = React.useState(true);
    const [error, setError] = React.useState<any>(null);

    const fetchSession = React.useCallback(async () => {
        setPending(true);
        setError(null);
        try {
            const res = await fetcher("/api/auth/me", { method: "GET" });
            setData(res || null);
        } catch (err) {
            setError(err);
            setData(null);
        } finally {
            setPending(false);
        }
    }, []);

    React.useEffect(() => {
        fetchSession();
    }, [fetchSession]);

    return { data, isPending, error, refetch: fetchSession };
}

async function postJson(path: string, body: any) {
    try {
        const headers = { "content-type": "application/json", ...buildAuthHeader() };
        const res = await fetcher(path, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        return { data: res, error: null };
    } catch (err: any) {
        if (err instanceof APIError) return { data: null, error: err };
        return { data: null, error: new APIError(err?.message || "Request failed") };
    }
}

export const authClient = {
    useSession: useSessionHook,
    signIn: {
        email: async (payload: { email: string; password: string; rememberMe?: boolean; callbackURL?: string }) => {
            return await postJson("/api/auth/login", payload);
        },
        social: async () => {
            throw new Error("Social sign-in not implemented");
        },
    },
    signUp: {
        email: async (payload: { name?: string; email: string; password: string; image?: string; callbackURL?: string }) => {
            return await postJson("/api/auth/register", payload);
        },
    },
    signOut: async () => {
        // clear cookie client-side by calling a logout API that clears cookie
        try {
            await fetcher("/api/auth/logout", { method: "POST" });
        } catch (e) {
            // ignore
        }
    },
    verifyEmail: async ({ query }: { query: { token?: string } }) => {
        const token = query?.token;
        if (!token) return { data: null, error: new Error('token missing') };
        try {
            const res = await fetcher(`/api/auth/verify?token=${encodeURIComponent(token)}`, { method: 'GET' });
            return { data: res, error: null };
        } catch (err: any) {
            return { data: null, error: err };
        }
    },
};

export default authClient;