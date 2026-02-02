"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
    email: z.string().email("Enter a valid email.").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
    const router = useRouter();
    const [showPw, setShowPw] = React.useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
        mode: "onTouched",
    });

    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting } = formState;

    async function onSubmit(values: FormValues) {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                toast({
                    variant: "destructive",
                    title: "Login failed",
                    description: data?.message || "Invalid credentials. Try again.",
                });
                return;
            }

            toast({
                title: "Welcome back!",
                description: "You’re now signed in.",
            });

            // TODO: adjust route based on role later (student/tutor/admin)
            router.push("/dashboard");
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Please try again.",
            });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                />
                {errors.email ? (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : null}
            </div>

            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <div className="relative">
                    <Input
                        id="password"
                        type={showPw ? "text" : "password"}
                        autoComplete="current-password"
                        {...register("password")}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                        aria-label={showPw ? "Hide password" : "Show password"}
                    >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>

                {errors.password ? (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                ) : null}
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-1">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
                    Create one
                </Link>
            </p>
        </form>
    );
}
