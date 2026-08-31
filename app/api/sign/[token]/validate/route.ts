import { NextResponse } from "next/server";
import { verifySignToken } from "@/lib/jwt";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/store";
import { loadContractBySigningToken, patchContract } from "@/lib/contracts-persistence";
import { loadFreelancer } from "@/lib/invite-persistence";

export async function GET(
  request: Request,
  { params }: { params: { token: string } },
) {
  const limited = rateLimit(`sign:${clientIp(request)}`);
  if (!limited.ok) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  try {
    const payload = await verifySignToken(params.token);
    const contract = await loadContractBySigningToken(params.token, payload.contractId);
    if (!contract) {
      return NextResponse.json({ valid: false });
    }
    if (contract.status === "cancelled") {
      return NextResponse.json({ valid: false, voided: true });
    }
    const freelancer = await loadFreelancer(contract.freelancerId);
    if (!contract.viewedAt) {
      await patchContract(contract.id, { viewedAt: new Date().toISOString() });
    }
    return NextResponse.json({
      valid: true,
      contractHtml: contract.bodyHtml,
      companyName: contract.companyName,
      freelancerName: freelancer?.fullName,
      freelancerEmail: freelancer?.email,
      title: contract.title,
      type: contract.type,
      expiresAt: contract.expiresAt,
      sentAt: contract.sentAt,
      status: contract.status,
    });
  } catch {
    return NextResponse.json({ valid: false, expired: true });
  }
}
