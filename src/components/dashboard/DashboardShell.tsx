import React from "react";
import type { Role } from "@/lib/rbac";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { SessionUser } from "@/types/auth.types";


export default function DashboardShell({
    role,
    user,
    children,
}: {
    role: Role;
    user: SessionUser;
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <div className="flex min-h-screen">
                <DashboardSidebar role={role} />
                <div className="flex-1">
                    <DashboardTopbar role={role} user={user} />
                    <main className="px-6 py-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
