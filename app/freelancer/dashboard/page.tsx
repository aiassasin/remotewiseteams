import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "Freelancer dashboard" };

export default function FreelancerDashboardPage() {
  return (
    <div className="min-h-screen bg-page px-6 py-10 lg:px-10">
      <PageTransition>
        <h1 className="rw-page-title">Your workspace</h1>
        <p className="mt-2 font-sans text-body text-ink-secondary">
          Contracts and invoices from your clients appear here.
        </p>
        <div className="mt-8">
          <EmptyState
            icon="contracts"
            title="No contracts yet."
            description="You'll get an email when a contract is ready to sign."
          />
        </div>
      </PageTransition>
    </div>
  );
}
