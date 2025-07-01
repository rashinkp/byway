"use client";

import * as React from "react";
import { useTheme } from "next-themes";

const themes = [
  "nature",
];

// Helper to format variable names for display
function formatVarName(varName: string) {
  return varName
    .replace('color-', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
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
    'color-primary-dark', 'color-primary-light',
    'color-background', 'color-surface',
    'color-accent', 'color-warning', 'color-danger',
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
                    className="theme-swatch w-5 h-5 rounded border border-[var(--color-primary-light)]"
                    title={formatVarName(v)}
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
                      <span className="w-32 text-right text-muted-foreground">{formatVarName(v)}</span>
                      <span className="w-5 h-5 rounded border border-[var(--color-primary-light)]" style={{ backgroundColor: computedVars[v] }} />
                      <span className="text-xs text-muted-foreground">{computedVars[v]}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
