import { FreelancerProfileClient } from "@/components/freelancers/freelancer-profile-client";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { listFreelancerContracts } from "@/lib/contracts-persistence";
import { loadFreelancer } from "@/lib/invite-persistence";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Freelancer profile" };
export const dynamic = "force-dynamic";

export default async function FreelancerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const current = await getCurrentWorkspace();
  if (!current) redirect("/login");

  const freelancer = await loadFreelancer(params.id);
  if (!freelancer || freelancer.companyId !== current.workspace.id) {
    return <FreelancerProfileClient />;
  }

  const contracts = await listFreelancerContracts(current.workspace.id, freelancer.id);
  return (
    <FreelancerProfileClient
      initialData={{
        freelancer,
        contracts: contracts.map((row) => ({
          id: row.id,
          title: row.title,
          type: row.type,
          status: row.status,
          sentAt: row.sentAt,
          signedAt: row.signedAt,
        })),
        stats: {
          totalPaid: 0,
          activeContracts: contracts.filter((row) => row.status !== "cancelled").length,
          avgPaymentTime: "—",
        },
      }}
    />
  );
}
