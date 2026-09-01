import type { ReactNode } from "react";
import { SiteFooter } from "@/components/legal/site-footer";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-page [background-image:radial-gradient(rgb(var(--rw-border)_/_0.8)_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="flex justify-end px-4 pt-4">
        <ThemeToggle />
      </div>
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-modal">{children}</div>
      </main>
      <SiteFooter compact />
    </div>
  );
}
