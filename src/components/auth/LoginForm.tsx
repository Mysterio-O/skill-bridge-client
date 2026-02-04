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
import { useAuth } from "@/providers/AuthProvider";
import { Separator } from "../ui/separator";

const schema = z.object({
    email: z.string().email("Enter a valid email.").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
    const router = useRouter();
    const { signInWithEmail, signInWithGoogle } = useAuth();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    const loading = form.formState.isSubmitting;

    async function onSubmit(values: FormValues) {
        const res = await signInWithEmail({
            email: values.email,
            password: values.password,
            // callbackURL: "/",
        });

        if (!res.ok) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: res.message || "Please try again.",
            });
            return;
        }

        toast({ title: "Welcome back!", description: "You are signed in." });
        // router.push("/dashboard");
    }

    async function handleGoogle() {
        try {
            await signInWithGoogle({
                // callbackURL: "/dashboard",
                // errorCallbackURL: "/login",
            });
        } catch {
            toast({
                variant: "destructive",
                title: "Google sign-in failed",
                description: "Please try again.",
            });
        }
    }


    return (
        // <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        //     <div className="grid gap-2">
        //         <Label htmlFor="email">Email</Label>
        //         <Input
        //             id="email"
        //             placeholder="you@example.com"
        //             autoComplete="email"
        //             {...register("email")}
        //         />
        //         {errors.email ? (
        //             <p className="text-sm text-destructive">{errors.email.message}</p>
        //         ) : null}
        //     </div>

        //     <div className="grid gap-2">
        //         <div className="flex items-center justify-between">
        //             <Label htmlFor="password">Password</Label>
        //             <Link
        //                 href="/forgot-password"
        //                 className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        //             >
        //                 Forgot password?
        //             </Link>
        //         </div>

        //         <div className="relative">
        //             <Input
        //                 id="password"
        //                 type={showPw ? "text" : "password"}
        //                 autoComplete="current-password"
        //                 {...register("password")}
        //                 className="pr-10"
        //             />
        //             <button
        //                 type="button"
        //                 onClick={() => setShowPw((v) => !v)}
        //                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
        //                 aria-label={showPw ? "Hide password" : "Show password"}
        //             >
        //                 {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        //             </button>
        //         </div>

        //         {errors.password ? (
        //             <p className="text-sm text-destructive">{errors.password.message}</p>
        //         ) : null}
        //     </div>

        //     <Button type="submit" disabled={isSubmitting} className="mt-1">
        //         {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        //         Sign in
        //     </Button>

        //     <p className="text-center text-sm text-muted-foreground">
        //         Don’t have an account?{" "}
        //         <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
        //             Create one
        //         </Link>
        //     </p>


        // </form>

        <>
            <div className="grid gap-4">
                <Button type="button" variant="outline" onClick={handleGoogle} disabled={loading}>
                    Continue with Google
                </Button>

                <div className="relative">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                        OR
                    </span>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            placeholder="you@example.com"
                            {...form.register("email")}
                            aria-invalid={!!form.formState.errors.email}
                        />
                        {form.formState.errors.email ? (
                            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                        ) : null}
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            {...form.register("password")}
                            aria-invalid={!!form.formState.errors.password}
                        />
                        {form.formState.errors.password ? (
                            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                        ) : null}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Don’t have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                        Create one
                    </Link>
                </p>
            </div>

        </>
    );
}
