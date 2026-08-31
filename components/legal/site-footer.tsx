import Link from "next/link";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";

const LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/invoicing-terms", label: "Invoicing terms" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="border-t border-border bg-card">
      <div
        className={`mx-auto flex w-full flex-col gap-3 px-6 py-6 lg:px-10 ${
          compact ? "sm:flex-row sm:items-center sm:justify-between" : "sm:flex-row sm:items-start sm:justify-between"
        }`}
      >
        <div>
          <p className="font-sans text-small text-ink-muted">
            {FINLAND_COMPLIANCE.operatorName} · {FINLAND_COMPLIANCE.legalEntityName} · Finland
          </p>
          {!compact ? (
            <p className="mt-1 max-w-xl font-sans text-small text-ink-muted">
              Fees are public. No tax withholding in this phase — you report income in your country.
            </p>
          ) : null}
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Legal">
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
      </div>
    </footer>
  );
}
