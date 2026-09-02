"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { RwLogo } from "@/components/brand/rw-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { SiteFooter } from "@/components/legal/site-footer";
import { PageBackNav } from "@/components/layout/page-back-nav";
import { useT } from "@/components/i18n/language-provider";

export function FreelancerShell({ children }: { children: ReactNode }) {
  const t = useT();
  const links = [
    { href: "/freelancer/dashboard", label: t("nav.home") },
    { href: "/freelancer/invoices", label: t("nav.invoices") },
    { href: "/freelancer/help", label: t("nav.help") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-10">
        <RwLogo href="/freelancer/dashboard" />
        <nav className="flex gap-3" aria-label={t("common.mainNav")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[13px] font-medium text-ink-secondary hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <PageBackNav />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="w-full flex-1 px-6 py-6 lg:px-10">
        {children}
      </main>
      <SiteFooter compact />
    </div>
  );
}
