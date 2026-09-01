import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentFreelancer, getSessionUser } from "@/lib/auth/session";
import { RwLogo } from "@/components/brand/rw-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SiteFooter } from "@/components/legal/site-footer";
import { PageBackNav } from "@/components/layout/page-back-nav";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/freelancer/dashboard", label: "Home" },
  { href: "/freelancer/invoices", label: "Invoices" },
  { href: "/freelancer/help", label: "Help" },
];

export default async function FreelancerLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) redirect("/signup");

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-10">
        <RwLogo href="/freelancer/dashboard" />
        <nav className="flex gap-3">
          {LINKS.map((link) => (
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
          <ThemeToggle />
        </div>
      </header>
      <main className="w-full flex-1 px-6 py-6 lg:px-10">{children}</main>
      <SiteFooter compact />
    </div>
  );
}
