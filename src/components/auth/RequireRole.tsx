"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Session, useAuth } from "@/providers/AuthProvider";
import type { Role } from "@/lib/rbac";
import { ROLE_HOME } from "@/lib/rbac";

function getRoleFromSession(session: Session): Role | null {
    const role = session?.user?.role;
    if (role === "admin" || role === "tutor" || role === "student") return role;
    return null;
}

export default function RequireRole({
    allow,
    children,
    loadingUI,
}: {
    allow: Role[];
    children: React.ReactNode;
    loadingUI?: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { session, isPending } = useAuth();

    React.useEffect(() => {
        if (isPending) return;

        // Not logged in
        if (!session) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
            return;
        }

        // Logged in but role missing or not allowed
        const role = getRoleFromSession(session);

        if (!role) {
            // if role isn't in session, send user to your existing /redirect resolver
            router.replace("/redirect");
            return;
        }

        if (!allow.includes(role)) {
            router.replace(ROLE_HOME[role] ?? "/redirect");
            return;
        }
    }, [session, isPending, router, pathname, allow]);

    // While checking
    if (isPending) {
        return (
            loadingUI ?? (
                <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
                    Checking access...
                </div>
            )
        );
    }

    // If session missing, we already redirect
    if (!session) return null;

    // If role invalid/not allowed, we already redirect
    const role = getRoleFromSession(session);
    if (!role || !allow.includes(role)) return null;

    return <>{children}</>;
}
