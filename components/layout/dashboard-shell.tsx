"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { PageBackNav } from "@/components/layout/page-back-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function DashboardShell({
  children,
  userName,
  companyName,
  plan,
  userId,
}: {
  children: ReactNode;
  userName?: string;
  companyName?: string;
  plan?: string;
  userId?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-page">
      <div className="hidden lg:flex">
        <Sidebar
          userName={userName}
          companyName={companyName}
          plan={plan}
          userId={userId}
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full w-[248px]">
            <Sidebar
              onNavigate={() => setMobileOpen(false)}
              userName={userName}
              companyName={companyName}
              plan={plan}
              userId={userId}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-10">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="min-w-0 flex-1">
            <PageBackNav />
          </div>
          <ThemeToggle />
        </header>
        <main className="w-full flex-1 px-6 py-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
