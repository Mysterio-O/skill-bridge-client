"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/providers/AuthProvider";
import { toast } from "@/components/ui/use-toast";

type UserLike = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
};

function initials(name?: string | null, email?: string | null) {
    const src = name?.trim() || "";
    if (src) {
        const parts = src.split(/\s+/).filter(Boolean);
        const a = parts[0]?.[0] ?? "";
        const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
        const out = (a + b).toUpperCase();
        return out || "U";
    }
    return (email?.[0] ?? "U").toUpperCase();
}

export default function UserMenu({ user }: { user: UserLike }) {
    const router = useRouter();
    const { signOut } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const name = user?.name ?? "";
    const email = user?.email ?? "";

    async function handleLogout() {
        try {
            setLoading(true);
            await signOut();
            toast({ title: "Signed out", description: "See you again!" });
            router.replace("/login");
        } catch {
            toast({
                variant: "destructive",
                title: "Logout failed",
                description: "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-9 px-2 rounded-full"
                    disabled={loading}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image ?? ""} alt={name || email || "User"} />
                        <AvatarFallback>{initials(name, email)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2 hidden text-left sm:block">
                        <div className="text-xs font-medium leading-none">
                            {name || "Account"}
                        </div>
                        <div className="text-[11px] text-muted-foreground leading-none mt-1">
                            {email || ""}
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="space-y-1">
                    <div className="text-sm font-medium">{name || "Account"}</div>
                    <div className="text-xs text-muted-foreground">{email}</div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Optional: add more items later */}
                {/* <DropdownMenuItem onClick={() => router.push("/settings")}>
          Settings
        </DropdownMenuItem> */}

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    {loading ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
