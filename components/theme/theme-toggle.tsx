"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { useT } from "@/components/i18n/language-provider";

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme();
  const t = useT();
  const next = resolved === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setPreference(next)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-border bg-card text-ink transition-colors hover:border-border-hover"
      aria-label={resolved === "dark" ? t("theme.light") : t("theme.dark")}
    >
      {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
