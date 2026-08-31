import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Freelancer dashboard" };

export default function FreelancerDashboardPage() {
  return (
    <PageTransition>
      <h1 className="rw-page-title">Your workspace</h1>
      <p className="mt-2 font-sans text-body text-ink-secondary">
        Contracts and invoices from your clients appear here.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/freelancer/invoices/new">Create an invoice</Link>
        </Button>
      </div>
      <div className="mt-8">
        <EmptyState
          icon="contracts"
          title="No contracts yet."
          description="You'll get an email when a contract is ready to sign."
        />
      </div>
    </PageTransition>
  );
}
