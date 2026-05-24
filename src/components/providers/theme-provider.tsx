"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("light");

  const applyTheme = React.useCallback(
    (newTheme: "dark" | "light") => {
      const root = window.document.documentElement;

      if (disableTransitionOnChange) {
        root.style.setProperty("transition", "none");
        requestAnimationFrame(() => {
          root.style.removeProperty("transition");
        });
      }

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
      } else {
        root.setAttribute(attribute, newTheme);
      }

      setResolvedTheme(newTheme);
    },
    [attribute, disableTransitionOnChange]
  );

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("vidi-theme") as Theme | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  React.useEffect(() => {
    if (theme === "system" && enableSystem) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme === "dark" ? "dark" : "light");
    }
  }, [theme, enableSystem, applyTheme]);

  const setTheme = React.useCallback((newTheme: Theme) => {
    localStorage.setItem("vidi-theme", newTheme);
    setThemeState(newTheme);
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
