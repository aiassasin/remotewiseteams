import Link from "next/link";
import { RwLogo } from "@/components/brand/rw-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function PricingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-10">
        <RwLogo href="/pricing" />
        <nav className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-2 py-2 font-sans text-[14px] font-medium text-ink-secondary hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rw-cta inline-flex items-center rounded-control px-4 py-2 font-sans text-[14px] font-bold hover:-translate-y-px"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
