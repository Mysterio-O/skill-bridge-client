"use client";

import React from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/providers/AuthProvider";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();

    return (
        <RequireRole allow={["tutor"]}>
            <DashboardShell role="tutor" user={session?.user ?? {}}>
                {children}
            </DashboardShell>
        </RequireRole>
    );
}
