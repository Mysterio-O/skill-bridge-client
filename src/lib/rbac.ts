export const ROLES = ["admin", "tutor", "student"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_HOME: Record<Role, string> = {
    admin: "/admin/dashboard",
    tutor: "/tutor/dashboard",
    student: "/student/dashboard",
};

export type NavIcon =
    | "dashboard"
    | "users"
    | "bookings"
    | "settings"
    | "students"
    | "payments"
    | "review"

export type NavItem = {
    title: string;
    href: string;
    icon: NavIcon;
};

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
    admin: [
        { title: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
        { title: "Applications", href: "/admin/dashboard/tutors/pending", icon: "users" },
        { title: "Users", href: "/admin/users", icon: "users" },
        { title: "Bookings", href: "/admin/bookings", icon: "bookings" },
        { title: "Settings", href: "/admin/settings", icon: "settings" },
    ],
    tutor: [
        { title: "Dashboard", href: "/tutor/dashboard", icon: "dashboard" },
        { title: "Bookings", href: "/tutor/bookings", icon: "bookings" },
        { title: "Settings", href: "/tutor/settings", icon: "settings" },
        { title: "Reviews", href: "/tutor/reviews", icon: "review" },
    ],
    student: [
        { title: "Dashboard", href: "/student/dashboard", icon: "dashboard" },
        { title: "Bookings", href: "/student/bookings", icon: "bookings" },
        // { title: "Payments", href: "/student/payments", icon: "payments" },
        { title: "Settings", href: "/student/settings", icon: "settings" },
    ],
};
