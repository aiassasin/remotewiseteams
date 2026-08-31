"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";

export function DashboardShell({
  children,
  userName,
  companyName,
  plan,
}: {
  children: ReactNode;
  userName?: string;
  companyName?: string;
  plan?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-page">
      <div className="hidden lg:flex">
        <Sidebar userName={userName} companyName={companyName} plan={plan} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full w-[240px]">
            <Sidebar
              onNavigate={() => setMobileOpen(false)}
              userName={userName}
              companyName={companyName}
              plan={plan}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 items-center border-b border-border bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="ml-2 font-display text-[16px] font-semibold text-ink">
            RemoteWise
          </span>
        </div>
        <main className="mx-auto w-full max-w-content flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
