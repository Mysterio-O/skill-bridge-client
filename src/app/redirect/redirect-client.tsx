"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import type { Role } from "@/lib/rbac";
import { ROLE_HOME } from "@/lib/rbac";

function normalizeRole(role?: string | null): Role | undefined {
  const r = (role ?? "").trim().toLowerCase();
  if (r === "student" || r === "tutor" || r === "admin") return r as Role;
  return undefined;
}

function safeInternalPath(next?: string) {
  if (!next) return null;
  const n = next.trim();
  if (!n.startsWith("/")) return null;
  if (n.startsWith("//")) return null;
  return n;
}

export default function RedirectClient({ next }: { next?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isPending, refetch } = useAuth();

  const lastDestRef = React.useRef<string | null>(null);
  const triedRefetchRef = React.useRef(false);

  // 🔎 render-level debug
  React.useEffect(() => {
    console.log(
      "[RedirectClient render]",
      new Date().toISOString(),
      { pathname, next, isPending, user }
    );
  }, [pathname, next, isPending, user]);

  React.useEffect(() => {
    if (isPending) {
      console.log("[RedirectClient effect] still pending, waiting...");
      return;
    }

    // ✅ If user is missing, try ONE refetch before sending to /login
    if (!user?.id && !triedRefetchRef.current) {
      triedRefetchRef.current = true;

      console.group("[RedirectClient] user missing -> trying refetch()");
      console.log("before refetch:", { user, isPending });
      console.groupEnd();

      // refetch then let the effect run again
      Promise.resolve(refetch())
        .then(() => {
          console.log("[RedirectClient] refetch done");
        })
        .catch((e) => {
          console.warn("[RedirectClient] refetch failed", e);
        });

      return;
    }

    const safeNext = safeInternalPath(next);

    let dest = "/login";
    let reason = "no-user";

    if (user?.id) {
      const role = normalizeRole((user as any).role);
      if (role) {
        dest = safeNext ?? (ROLE_HOME[role] ?? "/");
        reason = "has-user-and-role";
      } else {
        dest = "/login";
        reason = "missing-or-invalid-role";
      }
    } else {
      dest = safeNext ? `/login?next=${encodeURIComponent(safeNext)}` : "/login";
      reason = "no-user-after-refetch";
    }

    // avoid redirecting to itself
    if (dest === pathname) {
      console.warn("[RedirectClient] dest equals pathname, switching to '/'");
      dest = "/";
      reason = reason + " + dest==pathname";
    }

    // avoid repeating same replace (strict mode / rerenders)
    if (lastDestRef.current === dest) {
      console.log("[RedirectClient] skipping duplicate redirect:", dest);
      return;
    }
    lastDestRef.current = dest;

    console.group("[RedirectClient redirect]");
    console.log("reason:", reason);
    console.log("pathname:", pathname);
    console.log("dest:", dest);
    console.log("user.id:", user?.id);
    console.log("user.role:", (user as any)?.role);
    console.log("ROLE_HOME:", ROLE_HOME);
    console.groupEnd();

    router.replace(dest);
  }, [isPending, user?.id, (user as any)?.role, next, pathname, router, refetch]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-sm text-muted-foreground">
        {isPending ? "Checking your session..." : "Redirecting..."}
      </div>
    </div>
  );
}