"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import type { Role } from "@/lib/rbac";
import { ROLE_HOME } from "@/lib/rbac";

export default function RedirectPage() {
  const router = useRouter();
  const { session, isPending } = useAuth();

  React.useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    const role = session?.user?.role as Role | undefined;

    if (!role) {
      router.replace("/login");
      return;
    }

    router.replace(ROLE_HOME[role] ?? "/");
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-sm text-muted-foreground">Redirecting...</div>
    </div>
  );
}
