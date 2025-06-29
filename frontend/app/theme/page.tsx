"use client";

import * as React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import ThemeDebug from "@/components/ThemeDebug";

const themes = [
  "dark",
  "neutral",
  "stone",
  "zinc",
  "slate",
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "shadcn",
  "shadcn-dark",
];

function ModeToggle() {
  const { setTheme, theme: currentTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <Palette className="inline-block mr-2 h-4 w-4" />
          Color Theme
        </DropdownMenuLabel>
        {themes.map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => setTheme(t)}
            className={currentTheme === t ? "font-bold" : ""}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ThemePage() {
  const { setTheme, theme: currentTheme, resolvedTheme } = useTheme();
  // Force re-render on theme change for ThemeDebug
  const [themeVersion, setThemeVersion] = React.useState(0);
  React.useEffect(() => {
    setThemeVersion((v) => v + 1);
  }, [currentTheme, resolvedTheme]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {themes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            className={`flex flex-col items-center p-2 border border-[var(--border)] rounded-lg transition ring-offset-2 focus:outline-none focus:ring-2 focus:ring-[var(--foreground)] ${currentTheme === t || resolvedTheme === t ? "ring-2 ring-[var(--foreground)] border-[var(--foreground)]" : ""}`}
            aria-label={`Select ${t} theme`}
            style={{ background: "var(--background)" }}
          >
            <div className="flex space-x-1 mb-2">
              {t === "dark"
                ? <span style={{width: 176, height: 16, borderRadius: 4, background: '#111'}} className="border border-[var(--border)]" />
                : [50,100,200,300,400,500,600,700,800,900,950].map((shade) => (
                  <span
                    key={shade}
                    style={{
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: `var(--primary-${shade})`,
                    }}
                    className="border border-[var(--border)]"
                    data-theme={t}
                  />
                ))}
            </div>
            <span className="text-xs font-mono text-[var(--foreground)]">{t === "dark" ? "Dark" : t}</span>
          </button>
        ))}
      </div>
      <ThemeDebug key={themeVersion} />
    </div>
  );
}