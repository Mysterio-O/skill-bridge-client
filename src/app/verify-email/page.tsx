"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth-client";

export default function VerifyEmailPage() {
    const router = useRouter();
    const params = useSearchParams();

    const token = params.get("token");
    const [loading, setLoading] = React.useState(true);
    const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = React.useState<string>("");

    React.useEffect(() => {
        let cancelled = false;

        async function run() {
            if (!token) {
                setStatus("error");
                setMessage("Missing verification token.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // ✅ Call your backend verify endpoint (Better Auth)
                // Most Better Auth setups expose: POST /api/auth/verify-email
                const res = await authClient.verifyEmail({
                    query: {
                        token
                    }
                })

                if (cancelled) return;

                setStatus("success");
                setMessage("Email verified successfully!");

                toast({
                    title: "Email verified",
                    description: "Redirecting you to your dashboard...",
                });

                router.replace("/redirect");
            } catch (err) {
                if (cancelled) return;
                setStatus("error");
                setMessage((err instanceof Error) ? err?.message : "Verification failed.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [token, router]);

    return (
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : null}

            <h1 className="text-xl font-semibold">Verify Email</h1>

            {status === "success" ? (
                <p className="text-sm text-muted-foreground">{message}</p>
            ) : status === "error" ? (
                <>
                    <p className="text-sm text-destructive">{message}</p>
                    <button
                        className="text-sm text-primary underline"
                        onClick={() => router.replace("/login")}
                    >
                        Go to login
                    </button>
                </>
            ) : (
                <p className="text-sm text-muted-foreground">Verifying your email...</p>
            )}
        </div>
    );
}
