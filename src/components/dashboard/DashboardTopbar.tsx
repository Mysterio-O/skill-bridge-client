"use client";

import React from "react";
import { Role } from "@/lib/rbac";
import UserMenu from "./UserMenu";

type UserLike = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

export default function DashboardTopbar({
    role,
    user,
}: {
    role: Role;
    user: UserLike;
}) {
    const roleLabel =
        role === "admin" ? "Admin" : role === "tutor" ? "Tutor" : "Student";

    return (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="flex h-14 items-center justify-between px-6">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">{roleLabel} Dashboard</span>
                        <span className="text-xs text-muted-foreground">
                            Manage your {roleLabel.toLowerCase()} workspace
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <UserMenu user={user} />
                </div>
            </div>
        </header>
    );
}
