import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/legal/site-footer";
import { RwLogo } from "@/components/brand/rw-logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="flex h-14 items-center px-6">
        <RwLogo href="/" />
      </header>
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-lg">
          <EmptyState
            icon="help"
            title="That page is not here."
            description="The link may be old, or the page moved. Start from pricing or sign in — we will get you back to work."
            actionLabel="Go to pricing"
            actionHref="/pricing"
          />
          <p className="mt-4 text-center font-sans text-small text-ink-muted">
            Prefer a human?{" "}
            <Link href="/dashboard/help" className="text-primary underline-offset-2 hover:underline">
              Help &amp; Support
            </Link>
            . We reply within 24h.
          </p>
        </div>
      </main>
      <SiteFooter compact />
    </div>
  );
}
