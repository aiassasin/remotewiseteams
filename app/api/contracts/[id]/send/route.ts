import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { loadContract, patchContract } from "@/lib/contracts-persistence";
import { loadFreelancer } from "@/lib/invite-persistence";
import { signContractToken } from "@/lib/jwt";
import { hashToken } from "@/lib/token-hash";
import { createAdminClient } from "@/lib/supabase/admin";
import { saveContract } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  }

  const contract = await loadContract(params.id);
  if (!contract || contract.companyId !== current.workspace.id) {
    return NextResponse.json({ message: "Contract not found" }, { status: 404 });
  }
  if (contract.status !== "draft") {
    return NextResponse.json(
      { message: "Contract body is immutable after send" },
      { status: 409 },
    );
  }
  const freelancer = await loadFreelancer(contract.freelancerId);
  let token = contract.token;
  if (!token) {
    token = await signContractToken({ contractId: contract.id });
    contract.token = token;
    contract.tokenHash = hashToken(token);
    saveContract(contract);
    const admin = createAdminClient();
    if (admin) {
      await admin
        .from("contracts")
        .update({ signing_token_hash: contract.tokenHash })
        .eq("id", contract.id);
    }
  }
  await patchContract(params.id, {
    status: "sent",
    sentAt: new Date().toISOString(),
    bodyHtml: contract.bodyHtml,
  });
  const origin = new URL(request.url).origin;
  return NextResponse.json({
    sent: true,
    signingUrl: `${origin}/sign/${token}`,
    freelancerEmail: freelancer?.email,
  });
}
