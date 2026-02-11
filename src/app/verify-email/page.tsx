import * as React from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
    return (
        <React.Suspense
            fallback={
                <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
                    <h1 className="text-xl font-semibold">Verify Email</h1>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            }
        >
            <VerifyEmailClient />
        </React.Suspense>
    );
}
