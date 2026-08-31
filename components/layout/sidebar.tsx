"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/freelancers", label: "Freelancers", icon: Users },
  { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/payouts", label: "Payouts", icon: Wallet },
  { href: "/dashboard/standups", label: "Standups", icon: Video },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({
  onNavigate,
  userName,
  companyName,
  plan,
}: {
  onNavigate?: () => void;
  userName?: string;
  companyName?: string;
  plan?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const displayName = userName || "You";
  const workspaceName = companyName || "Workspace";

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col bg-sidebar text-white">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-control bg-primary">
          <span className="font-display text-[13px] font-semibold tracking-tight">
            RW
          </span>
        </div>
        <span className="font-display text-[16px] font-semibold tracking-tight">
          RemoteWise
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label="Main">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-control px-3 py-2.5 font-sans text-[14px] font-medium transition-colors duration-100",
                active
                  ? "border-l-[3px] border-primary bg-sidebar-active pl-[9px] text-white"
                  : "border-l-[3px] border-transparent text-ink-muted hover:bg-sidebar-hover hover:text-white",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-small font-medium text-primary-text">
            {initials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-sans text-[13px] font-medium text-white">
              {displayName}
            </p>
            <p className="truncate font-sans text-small text-ink-muted">
              {workspaceName}
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-pill bg-primary-light px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-primary-text">
            {plan || "Free"}
          </span>
        </div>
        <button
          type="button"
          className="mt-3 w-full text-left font-sans text-small text-ink-muted hover:text-white"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
