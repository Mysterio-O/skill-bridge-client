"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Menu,
    Search,
    Sun,
    Moon,
    GraduationCap,
    LayoutDashboard,
    CalendarClock,
    Shield,
    User as UserIcon,
    Settings,
    LogOut,
    LogIn,
    UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import ThemeToggle from "./ThemeToggle";

/** Adjust roles to match your backend */
export type AppRole = "student" | "tutor" | "admin";

export type NavbarUser = {
    id: string;
    name: string;
    email: string;
    role: AppRole;
    imageUrl?: string | null;
};

function initials(name?: string) {
    if (!name) return "SB";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "SB";
}


function isActivePath(pathname: string, href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
    href,
    children,
    className,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    const pathname = usePathname();
    const active = isActivePath(pathname, href);

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                active && "text-foreground bg-muted/80",
                className
            )}
        >
            {children}
        </Link>
    );
}

function roleBadge(role: AppRole) {
    if (role === "admin") return { label: "Admin", icon: Shield };
    if (role === "tutor") return { label: "Tutor", icon: GraduationCap };
    return { label: "Student", icon: UserIcon };
}

function dashboardHref(role: AppRole) {
    if (role === "admin") return "/admin/dashboard";
    if (role === "tutor") return "/tutor/dashboard";
    return "/student/dashboard";
}

function bookingsHref(role: AppRole) {
    if (role === "tutor") return "/tutor/dashboard/bookings"; // tutors see sessions inside tutor dashboard (adjust if you create /tutor/sessions)
    if (role === "admin") return "/admin/dashboard/bookings";
    return "/student/dashboard/bookings";
}

export default function Navbar({
    className,
}: {
    className?: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { user, signOut } = useAuth()


    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [q, setQ] = React.useState(() => searchParams.get("q") || "");

    React.useEffect(() => {
        // keep input in sync if user navigates
        setQ(searchParams.get("q") || "");
    }, [searchParams]);

    const publicLinks = [
        { href: "/", label: "Home" },
        { href: "/tutors", label: "Tutors" },
        { href: "/categories", label: "Categories" },
    ];

    const authedLinks = React.useMemo(() => {
        if (!user) return [];
        const role = user.role;

        return [
            { href: dashboardHref(role), label: "Dashboard", icon: LayoutDashboard },
            { href: bookingsHref(role), label: role === "tutor" ? "Sessions" : "Bookings", icon: CalendarClock },
        ];
    }, [user]);

    async function onSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = q.trim();

        // always route to tutors list
        const params = new URLSearchParams();
        if (trimmed) params.set("q", trimmed);
        router.push(`/tutors${params.toString() ? `?${params.toString()}` : ""}`);
        setMobileOpen(false);
    }

    async function handleLogout() {
        try {
            // implement this route in your backend later
            await signOut()

            toast({ title: "Signed out", description: "See you again soon." });
            router.push("/login");
            router.refresh();
        } catch {
            toast({
                variant: "destructive",
                title: "Logout failed",
                description: "Please try again.",
            });
        }
    }

    const roleMeta = user ? roleBadge(user.role) : null;
    const RoleIcon = roleMeta?.icon;

    return (
        <header
            className={cn(
                "sticky top-0 z-50 border-b bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                className
            )}
        >
            <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4">
                {/* Left: Brand */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="group flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-2xl border bg-card shadow-sm">
                            <GraduationCap className="h-5 w-5 text-primary" />
                        </span>

                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold leading-tight">
                                <span className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                                    SkillBridge
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground leading-tight">
                                Connect with Expert Tutors
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {publicLinks.map((l) => (
                            <NavLink key={l.href} href={l.href}>
                                {l.label}
                            </NavLink>
                        ))}

                        {user ? (
                            <>
                                <Separator orientation="vertical" className="mx-2 h-6" />
                                {authedLinks.map((l) => (
                                    <NavLink key={l.href} href={l.href}>
                                        {l.icon ? <l.icon className="h-4 w-4" /> : null}
                                        {l.label}
                                    </NavLink>
                                ))}
                            </>
                        ) : null}
                    </nav>
                </div>

                {/* Middle: Search (desktop) */}
                <div className="hidden lg:flex flex-1 justify-center">
                    <form onSubmit={onSearchSubmit} className="w-full max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search tutors, subjects, skills..."
                                className="pl-9"
                            />
                        </div>
                    </form>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <ThemeToggle />

                    {/* Auth buttons / user menu (desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        {!user ? (
                            <>
                                <Button asChild variant="ghost" className="rounded-xl">
                                    <Link href="/login" className="flex items-center gap-2">
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </Link>
                                </Button>

                                <Button asChild className="rounded-xl">
                                    <Link href="/register" className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        Register
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="hidden xl:flex items-center gap-2 rounded-xl border bg-card px-3 py-2">
                                    {RoleIcon ? <RoleIcon className="h-4 w-4 text-primary" /> : null}
                                    <span className="text-sm font-medium">{roleMeta?.label}</span>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="rounded-xl px-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
                                                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                {/* <div className="hidden lg:block text-left">
                                                    <p className="text-sm font-medium leading-tight">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground leading-tight">{user.email}</p>
                                                </div> */}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="grid gap-0.5">
                                                <span className="text-sm font-semibold">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem asChild>
                                            <Link href={dashboardHref(user.role)} className="flex items-center gap-2">
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href={bookingsHref(user.role)} className="flex items-center gap-2">
                                                <CalendarClock className="h-4 w-4" />
                                                {user.role === "tutor" ? "Sessions" : "Bookings"}
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/profile" className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4" />
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="flex items-center gap-2">
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden rounded-xl" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-[340px] p-0">
                            <div className="p-5">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <span className="grid h-9 w-9 place-items-center rounded-2xl border bg-card">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                        </span>
                                        <span>SkillBridge</span>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Search (mobile) */}
                                <form onSubmit={onSearchSubmit} className="mt-5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={q}
                                            onChange={(e) => setQ(e.target.value)}
                                            placeholder="Search tutors..."
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button type="submit" className="mt-3 w-full rounded-xl">
                                        Search
                                    </Button>
                                </form>

                                <Separator className="my-5" />

                                {/* Links */}
                                <div className="grid gap-1">
                                    {publicLinks.map((l) => (
                                        <NavLink key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                                            {l.label}
                                        </NavLink>
                                    ))}
                                </div>

                                {user ? (
                                    <>
                                        <Separator className="my-5" />

                                        <div className="flex items-center gap-3 rounded-2xl border bg-card p-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
                                                <AvatarFallback>{initials(user.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold">{user.name}</p>
                                                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                                <div className="mt-1 inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-1 text-[11px]">
                                                    {RoleIcon ? <RoleIcon className="h-3.5 w-3.5 text-primary" /> : null}
                                                    <span className="font-medium">{roleMeta?.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-1">
                                            {authedLinks.map((l) => (
                                                <NavLink
                                                    key={l.href}
                                                    href={l.href}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {l.icon ? <l.icon className="h-4 w-4" /> : null}
                                                    {l.label}
                                                </NavLink>
                                            ))}

                                            <NavLink href="/dashboard/profile" onClick={() => setMobileOpen(false)}>
                                                <UserIcon className="h-4 w-4" />
                                                Profile
                                            </NavLink>

                                            <NavLink href="/settings" onClick={() => setMobileOpen(false)}>
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </NavLink>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMobileOpen(false);
                                                    handleLogout();
                                                }}
                                                className={cn(
                                                    "mt-2 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                                                    "text-destructive hover:bg-destructive/10"
                                                )}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Separator className="my-5" />

                                        <div className="grid gap-2">
                                            <Button asChild className="rounded-xl" onClick={() => setMobileOpen(false)}>
                                                <Link href="/register" className="flex items-center gap-2">
                                                    <UserPlus className="h-4 w-4" />
                                                    Create account
                                                </Link>
                                            </Button>

                                            <Button
                                                asChild
                                                variant="secondary"
                                                className="rounded-xl"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                <Link href="/login" className="flex items-center gap-2">
                                                    <LogIn className="h-4 w-4" />
                                                    Login
                                                </Link>
                                            </Button>
                                        </div>
                                    </>
                                )}

                                <Separator className="my-5" />

                                <p className="text-xs text-muted-foreground">
                                    {pathname.startsWith("/admin")
                                        ? "Admin area"
                                        : pathname.startsWith("/tutor")
                                            ? "Tutor area"
                                            : "Public area"}
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
