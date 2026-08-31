import { notFound, redirect } from "next/navigation";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { loadContract } from "@/lib/contracts-persistence";
import { ContractReview } from "@/components/contracts/contract-review";

export default async function ContractReviewPage({ params }: { params: { id: string } }) {
  const current = await getCurrentWorkspace();
  if (!current) redirect("/login");

  const contract = await loadContract(params.id);
  if (!contract || contract.companyId !== current.workspace.id) notFound();

  return <ContractReview contractId={params.id} />;
}
