import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";

type FooterLink = { label: string; href: string };

type FooterProps = {
    className?: string;
    brandName?: string;
    description?: string;
    links?: {
        product: FooterLink[];
        company: FooterLink[];
        resources: FooterLink[];
        legal: FooterLink[];
    };
};

export default function Footer({
    className,
    brandName = "SkillBridge",
    description = "Connect with expert tutors and learn with a structured, progress-driven approach.",
    links = {
        product: [
            { label: "Browse tutors", href: "/tutors" },
            { label: "Categories", href: "/categories" },
            { label: "How it works", href: "/how-it-works" },
        ],
        company: [
            { label: "About", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
        resources: [
            { label: "Help center", href: "/help" },
            { label: "Community", href: "/community" },
            { label: "Safety", href: "/safety" },
        ],
        legal: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Cookies", href: "/cookies" },
        ],
    },
}: FooterProps) {
    return (
        <footer className={cn("relative", className)}>
            <div className="mx-auto max-w-6xl px-4 pb-10">
                <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm backdrop-blur md:p-8">
                    <div className="grid gap-8 md:grid-cols-5">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="text-base font-semibold text-foreground">
                                {brandName}
                            </div>
                            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>

                            <div className="mt-4 flex items-center gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl bg-background/50"
                                >
                                    <Link href="mailto:skrabbi.019@gmail.com" aria-label="Email">
                                        <Mail className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl bg-background/50"
                                >
                                    <Link
                                        href="https://x.com/Sheikh_Rabbi69"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="X (Twitter)"
                                    >
                                        <Twitter className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl bg-background/50"
                                >
                                    <Link
                                        href="https://www.linkedin.com/in/sk-maruf-hossain/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl bg-background/50"
                                >
                                    <Link
                                        href="https://github.com/Mysterio-O"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                    >
                                        <Github className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <FooterCol title="Product" links={links.product} />
                        <FooterCol title="Company" links={links.company} />
                        <FooterCol title="Resources" links={links.resources} />
                        <FooterCol title="Legal" links={links.legal} />
                    </div>

                    <Separator className="my-6 opacity-60" />

                    <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            © {new Date().getFullYear()} {brandName}. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="hover:text-foreground">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-foreground">
                                Terms
                            </Link>
                            <Link href="/contact" className="hover:text-foreground">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
    return (
        <div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <ul className="mt-3 space-y-2">
                {links.map((l) => (
                    <li key={l.href + l.label}>
                        <Link
                            href={l.href}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
