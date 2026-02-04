"use client";

import React from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Separator } from "../ui/separator";

const schema = z.object({
  email: z.string().email("Enter a valid email.").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const loading = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    const callbackURL = new URL("/redirect", window.location.origin).toString();

    const res = await signInWithEmail({
      email: values.email,
      password: values.password,
      callbackURL,
    });

    if (!res?.ok) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: res?.message || "Please try again.",
      });
      return;
    }

    toast({ title: "Welcome back!", description: "You are signed in." });

  }

  async function handleGoogle() {
    try {
      const callbackURL = new URL("/redirect", window.location.origin).toString();
      const errorCallbackURL = new URL("/login", window.location.origin).toString();

      await signInWithGoogle({
        callbackURL,
        errorCallbackURL,
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
  );
}
