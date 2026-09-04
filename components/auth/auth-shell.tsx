import type { ReactNode } from "react";
import { SiteFooter } from "@/components/legal/site-footer";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="rw-auth-shell flex min-h-screen flex-col">
      <div className="rw-auth-chrome flex justify-end gap-2 px-4 pt-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="rw-auth-sky w-full max-w-modal">{children}</div>
      </main>
      <SiteFooter compact />
    </div>
  );
}
