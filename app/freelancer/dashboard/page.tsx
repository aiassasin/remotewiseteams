import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { FileText } from "lucide-react";

export const metadata: Metadata = { title: "Freelancer dashboard" };

export default function FreelancerDashboardPage() {
  return (
    <div className="min-h-screen bg-page px-6 py-10">
      <PageTransition>
        <div className="mx-auto max-w-content">
          <h1 className="rw-page-title">Your workspace</h1>
          <p className="mt-2 font-sans text-body text-ink-secondary">
            Contracts and invoices from Northstar Studio will appear here.
          </p>
          <div className="mt-8 rounded-card border border-border bg-card p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-border" />
            <h2 className="mt-4 font-display text-[18px] font-semibold text-ink">
              No contracts yet
            </h2>
            <p className="mt-4 font-sans text-body text-ink-slate">
              You&apos;ll get an email when a contract is ready to sign.
            </p>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
