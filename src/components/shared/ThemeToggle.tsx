'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Moon, Sun } from 'lucide-react';



/**
 * Minimal theme toggle using `.dark` class on <html>.
 * Works with your globals.css `.dark { ... }` vars.
 */
function useThemeClass() {
    const [mounted, setMounted] = React.useState(false);
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);

        const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
        const prefersDark =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        const shouldUseDark = stored ? stored === "dark" : prefersDark;
        document.documentElement.classList.toggle("dark", shouldUseDark);
        setIsDark(shouldUseDark);
    }, []);

    function toggle() {
        const next = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
        setIsDark(next);
    }

    return { mounted, isDark, toggle };
}



export default function ThemeToggle() {

    const { mounted, isDark, toggle } = useThemeClass();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-xl"
        >
            {/* avoid hydration mismatch icon swap */}
            {mounted ? (
                isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
                <span className="h-4 w-4" />
            )}
        </Button>
    )
}
