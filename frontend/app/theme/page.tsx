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
            className={`theme-preview flex flex-col items-center ${
              currentTheme === t || resolvedTheme === t ? "selected" : ""
            }`}
            aria-label={`Select ${t} theme`}
            data-theme={t}
          >
            <div className="flex space-x-1 mb-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(
                (shade) => (
                  <span
                    key={shade}
                    className="theme-swatch"
                    style={{ backgroundColor: `var(--primary-${shade})` }}
                  />
                )
              )}
            </div>
            <span className="theme-label">
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </span>
          </button>
        ))}
      </div>
      <ThemeDebug key={themeVersion} />
    </div>
  );
}
