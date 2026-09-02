import { getSessionUser } from "@/lib/auth/session";
import { loadFreelancerBillingProfile } from "@/lib/invoices-server";
import { NewInvoicePageClient } from "@/components/invoices/new-invoice-page-client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "New invoice" };
export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await loadFreelancerBillingProfile(user.id);
  return <NewInvoicePageClient profile={profile} />;
}
