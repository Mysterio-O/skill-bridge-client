"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";

export default function RedirectPage() {
  const router = useRouter();

  const { role, loading } = useRole() as {
    role: "admin" | "tutor" | "student" | null | undefined;
    loading: boolean;
  };

  React.useEffect(() => {
    if (loading) return;
    if (!role) return;

    if (role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }

    if (role === "tutor") {
      router.replace("/tutor/dashboard");
      return;
    }

    router.replace("/student/dashboard");
  }, [role, loading, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-sm text-muted-foreground">Redirecting...</div>
    </div>
  );
}
