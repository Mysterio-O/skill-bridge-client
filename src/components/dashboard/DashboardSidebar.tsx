"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_BY_ROLE, type Role } from "@/lib/rbac";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Settings,
    GraduationCap,
    CreditCard,
} from "lucide-react";
import ThemeToggle from "../shared/ThemeToggle";

const ICONS = {
    dashboard: LayoutDashboard,
    users: Users,
    bookings: CalendarCheck,
    settings: Settings,
    students: GraduationCap,
    payments: CreditCard,
} as const;

export default function DashboardSidebar({ role }: { role: Role }) {
    const pathname = usePathname();
    const items = NAV_BY_ROLE[role];

    return (
        <aside className="w-[260px] border-r bg-card">
            <div className="px-4 py-4 border-b relative">
                <div className="text-sm font-semibold">SkillBridge</div>
                <div className="text-xs text-muted-foreground capitalize">{role} panel</div>
                <div className="absolute top-4 right-1">
                    <ThemeToggle/>
                </div>
            </div>

            <nav className="p-2 space-y-1">
                {items.map((item) => {
                    const Icon = ICONS[item.icon];
                    const active =
                        pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                                active
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
