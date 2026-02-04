"use client";

import { useAuth } from "@/providers/AuthProvider";

export type AppRole = "admin" | "tutor" | "student";

export default function useRole() {
    const { user, isPending } = useAuth()

    return {
        role: (user?.role as AppRole | undefined) ?? undefined,
        user,
        loading: isPending,
        isAuthed: !!user,
    };
}
