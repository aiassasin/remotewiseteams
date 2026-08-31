"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IsoIcon, type IsoIconName } from "@/components/icons/iso-icon";
import { RwLogo } from "@/components/brand/rw-logo";
import { cn, initials } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

const NAV: { href: string; label: string; icon: IsoIconName }[] = [
  { href: "/dashboard/overview", label: "Overview", icon: "overview" },
  { href: "/dashboard/freelancers", label: "Freelancers", icon: "freelancers" },
  { href: "/dashboard/contracts", label: "Contracts", icon: "contracts" },
  { href: "/dashboard/invoices", label: "Invoices", icon: "invoices" },
  { href: "/dashboard/payouts", label: "Payouts", icon: "payouts" },
  { href: "/dashboard/standups", label: "Standups", icon: "standups" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

export function Sidebar({
  onNavigate,
  userName,
  companyName,
  plan,
  userId,
}: {
  onNavigate?: () => void;
  userName?: string;
  companyName?: string;
  plan?: string;
  userId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUserId } = useTheme();
  const displayName = userName || "You";
  const workspaceName = companyName || "Workspace";

  useEffect(() => {
    if (userId) setUserId(userId);
  }, [userId, setUserId]);

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col bg-sidebar text-white">
      <div className="flex h-16 items-center px-4">
        <RwLogo href="/dashboard/overview" inverted />
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label="Main">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <LinkItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={active}
              onNavigate={onNavigate}
            />
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-small font-medium text-white">
            {initials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-sans text-[13px] font-medium text-white">
              {displayName}
            </p>
            <p className="truncate font-sans text-small text-white/50">
              {workspaceName}
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-pill bg-white/10 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-white/80">
            {plan || "Free"}
          </span>
        </div>
        <button
          type="button"
          className="mt-3 w-full text-left font-sans text-small text-white/50 hover:text-white"
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

function LinkItem({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: IsoIconName;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-control px-2.5 py-2 font-sans text-[14px] font-medium transition-colors duration-100",
        active
          ? "border-l-[3px] border-cyan bg-sidebar-active pl-[7px] text-white"
          : "border-l-[3px] border-transparent text-white/55 hover:bg-sidebar-hover hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      <IsoIcon name={icon} size={26} title={label} />
      {label}
    </Link>
  );
}
