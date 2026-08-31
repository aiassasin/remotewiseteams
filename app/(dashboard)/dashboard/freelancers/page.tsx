import { FreelancersPageClient } from "@/components/freelancers/freelancers-page-client";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { listRosterFreelancers } from "@/lib/invite-persistence";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Freelancers",
};

export const dynamic = "force-dynamic";

export default async function FreelancersPage() {
  const current = await getCurrentWorkspace();
  if (!current) redirect("/login");
  const freelancers = await listRosterFreelancers(current.workspace.id);
  return <FreelancersPageClient initialFreelancers={freelancers} />;
}
