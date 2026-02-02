import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BackgroundGlow from "@/components/shared/BackgroundGlow";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AuthShell({
    title,
    subtitle,
    children,
    footer,
    className,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className="relative min-h-screen">
            <BackgroundGlow />

            <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
                <div className={cn("w-full max-w-md", className)}>
                    <div className="mb-4">
                        <Button asChild variant="ghost" className="px-2">
                            <Link href="/" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to home
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-2xl border bg-card shadow-[var(--shadow-card)]">
                        <div className="px-7 py-8 sm:px-10 sm:py-10">
                            <div className="mb-6 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {title}
                                </h1>
                                {subtitle ? (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {subtitle}
                                    </p>
                                ) : null}
                            </div>

                            {children}

                            {footer ? <div className="mt-6">{footer}</div> : null}
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        SkillBridge © {new Date().getFullYear()} • Learn with experts
                    </p>
                </div>
            </div>
        </div>
    );
}
