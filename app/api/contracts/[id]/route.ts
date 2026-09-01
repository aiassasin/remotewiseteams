import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { loadContract, listWorkspaceContracts } from "@/lib/contracts-persistence";
import { loadFreelancer } from "@/lib/invite-persistence";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  }
  if (params.id === "list") {
    return NextResponse.json({
      contracts: await listWorkspaceContracts(current.workspace.id),
    });
  }
  const contract = await loadContract(params.id);
  if (!contract || contract.companyId !== current.workspace.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const freelancer = await loadFreelancer(contract.freelancerId);
  return NextResponse.json({ contract, freelancer });
}
