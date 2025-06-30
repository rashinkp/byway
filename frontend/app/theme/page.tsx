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
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
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
  const [themeVersion, setThemeVersion] = React.useState(0);
  const [computedVars, setComputedVars] = React.useState<Record<string, string>>({});
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setThemeVersion((v) => v + 1);
    // Update computedVars for the selected theme
    const vars: Record<string, string> = {};
    themeVars.forEach((v) => {
      vars[v] = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue(`--${v}`).trim() : '';
    });
    setComputedVars(vars);
  }, [currentTheme, resolvedTheme]);

  React.useEffect(() => {
    if (mounted) {
      // Debug print: log current theme and <body> data-theme attribute
      const bodyTheme = typeof window !== 'undefined' ? document.body.getAttribute('data-theme') : null;
      // eslint-disable-next-line no-console
      console.log('Current theme:', currentTheme, '| Resolved theme:', resolvedTheme, '| <body> data-theme:', bodyTheme);
    }
  }, [currentTheme, resolvedTheme, mounted]);

  // List of important theme variables to preview
  const themeVars = [
    'primary', 'primary-foreground', 'primary-hover',
    'secondary', 'secondary-foreground', 'secondary-hover',
    'tertiary', 'tertiary-foreground', 'tertiary-hover',
    'background', 'foreground', 'warning', 'danger',
    ...[50,100,200,300,400,500,600,700,800,900,950].map(s => `primary-${s}`)
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {themes.map((t) => (
          <div key={t} data-theme={t} className="w-full">
            <button
              type="button"
              onClick={() => setTheme(t)}
              className={`theme-preview flex flex-col items-center ${
                currentTheme === t || resolvedTheme === t ? "selected" : ""
              }`}
              aria-label={`Select ${t} theme`}
            >
              <div className="flex flex-wrap gap-1 mb-2 justify-center">
                {themeVars.map((v) => (
                  <span
                    key={v}
                    className="theme-swatch w-5 h-5 rounded border border-[var(--primary-200)]"
                    title={v}
                    style={{ backgroundColor: `var(--${v})` }}
                  />
                ))}
              </div>
              <span className="theme-label font-semibold">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
              {(currentTheme === t || resolvedTheme === t) && (
                <div className="mt-2 text-xs text-center w-full">
                  {themeVars.map((v) => (
                    <div key={v} className="flex items-center gap-2 justify-center">
                      <span className="w-32 text-right text-muted-foreground">{v}</span>
                      <span className="w-5 h-5 rounded border border-[var(--primary-200)]" style={{ backgroundColor: computedVars[v] }} />
                      <span className="text-xs text-muted-foreground">{computedVars[v]}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
      <ThemeDebug key={themeVersion} />
    </div>
  );
}
