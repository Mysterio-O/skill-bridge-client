"use client";

import React from "react";
import { authClient } from "@/lib/auth/auth-client";

export type Session = Awaited<ReturnType<typeof authClient.getSession>>["data"];

type AuthEvent = "SIGNED_IN" | "SIGNED_OUT" | "SESSION_UPDATED";

type AuthListener = (event: AuthEvent, session: Session) => void;

type AuthContextValue = {
  session: Session;
  user: Session extends null ? null : NonNullable<Session>["user"] | null;
  isPending: boolean;
  error: unknown;
  refetch: () => Promise<void>;

  signInWithEmail: (payload: {
    email: string;
    password: string;
    rememberMe?: boolean;
    callbackURL?: string;
  }) => Promise<{ ok: boolean; message?: string }>;

  signUpWithEmail: (payload: {
    name: string;
    email: string;
    password: string;
    image?: string;
    callbackURL?: string;
  }) => Promise<{ ok: boolean; message?: string }>;

  signInWithGoogle: (payload?: {
    callbackURL?: string;
    errorCallbackURL?: string;
    newUserCallbackURL?: string;
  }) => Promise<void>;

  signOut: () => Promise<void>;

  onAuthStateChange: (listener: AuthListener) => () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  // console.log(session)

  const listenersRef = React.useRef(new Set<AuthListener>());
  const prevRef = React.useRef<Session>(null);

  // onAuthStateChange-style behavior
  React.useEffect(() => {
    const prev = prevRef.current;
    const next = session ?? null;

    let event: AuthEvent = "SESSION_UPDATED";
    if (!prev && next) event = "SIGNED_IN";
    else if (prev && !next) event = "SIGNED_OUT";

    if (prev !== next) {
      listenersRef.current.forEach((fn) => fn(event, next));
      prevRef.current = next;
    }
  }, [session]);

  const onAuthStateChange = React.useCallback((listener: AuthListener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const signInWithEmail: AuthContextValue["signInWithEmail"] = async (payload) => {
    const { data,error } = await authClient.signIn.email(payload);
    if (error) return { ok: false, message: error.message || "Login failed." };
    console.log(data);
    await refetch();
    return { ok: true };
  };

  const signUpWithEmail: AuthContextValue["signUpWithEmail"] = async (payload) => {
    const { error } = await authClient.signUp.email(payload);
    if (error) return { ok: false, message: error.message || "Registration failed." };
    return { ok: true };
  };

  const signInWithGoogle: AuthContextValue["signInWithGoogle"] = async (payload) => {
    // Redirect-based by default
    await authClient.signIn.social({
      provider: "google",
      ...payload,
    });
  };

  const signOut: AuthContextValue["signOut"] = async () => {
    await authClient.signOut();
    await refetch();
  };

  const value: AuthContextValue = {
    session: session ?? null,
    user: (session)?.user ?? null,
    isPending,
    error,
    refetch: async () => {
      await refetch();
    },
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    onAuthStateChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
