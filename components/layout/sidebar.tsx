"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { IsoIcon, type IsoIconName } from "@/components/icons/iso-icon";
import { RwLogo } from "@/components/brand/rw-logo";
import { useAppLanguage, useT } from "@/components/i18n/language-provider";
import { chromeNav } from "@/lib/app-chrome";
import { cn, initials } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

type NavItem = { href: string; key: "overview" | "freelancers" | "contracts" | "invoices" | "payouts" | "standups" | "help" | "settings"; icon: IsoIconName };

const NAV: NavItem[] = [
  { href: "/dashboard/overview", key: "overview", icon: "overview" },
  { href: "/dashboard/freelancers", key: "freelancers", icon: "freelancers" },
  { href: "/dashboard/contracts", key: "contracts", icon: "contracts" },
  { href: "/dashboard/invoices", key: "invoices", icon: "invoices" },
  { href: "/dashboard/payouts", key: "payouts", icon: "payouts" },
  { href: "/dashboard/standups", key: "standups", icon: "standups" },
  { href: "/dashboard/help", key: "help", icon: "help" },
  { href: "/dashboard/settings", key: "settings", icon: "settings" },
];

export function Sidebar({
  onNavigate,
  userName,
  companyName,
  plan,
  userId,
  avatarUrl,
}: {
  onNavigate?: () => void;
  userName?: string;
  companyName?: string;
  plan?: string;
  userId?: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUserId } = useTheme();
  const { language } = useAppLanguage();
  const nav = chromeNav(language);
  const t = useT();
  const displayName = userName || t("common.you");
  const workspaceName = companyName || t("common.workspace");

  useEffect(() => {
    if (userId) setUserId(userId);
  }, [userId, setUserId]);

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col bg-sidebar text-white">
      <div className="flex h-16 items-center px-4">
        <RwLogo href="/dashboard/overview" inverted />
      </div>

      <LayoutGroup id={onNavigate ? "sidebar-nav-mobile" : "sidebar-nav-desktop"}>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label={t("common.mainNav")}>
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <LinkItem
                key={item.href}
                href={item.href}
                label={nav[item.key]}
                icon={item.icon}
                active={active}
                onNavigate={onNavigate}
              />
            );
          })}
        </nav>
      </LayoutGroup>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-small font-medium text-white">
              {initials(displayName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-sans text-[13px] font-medium text-white">
              {displayName}
            </p>
            <p className="truncate font-sans text-small text-white/50">
              {workspaceName}
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-pill bg-white/10 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-white/80">
            {plan || t("common.free")}
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
          {nav.signOut}
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
        "relative flex items-center gap-3 rounded-control px-2.5 py-2 font-sans text-[14px] font-medium transition-colors duration-100",
        active
          ? "bg-sidebar-active text-white"
          : "text-white/60 hover:bg-sidebar-hover hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      {active ? (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-0 h-full w-1 rounded-r bg-royal-yellow"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      ) : null}
      <span className="relative z-10 flex items-center gap-3">
        <IsoIcon name={icon} size={26} title={label} />
        {label}
      </span>
    </Link>
  );
}
