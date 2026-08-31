import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ContractPdf } from "@/lib/pdf/contract-pdf";
import { verifySignToken } from "@/lib/jwt";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/store";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadContractBySigningToken, patchContract } from "@/lib/contracts-persistence";
import { loadFreelancer } from "@/lib/invite-persistence";

export async function POST(
  request: Request,
  { params }: { params: { token: string } },
) {
  const ip = clientIp(request);
  const limited = rateLimit(`sign-complete:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const body = (await request.json()) as {
    signerName?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  if (!body.signerName?.trim()) {
    return NextResponse.json({ message: "Signature name is required" }, { status: 400 });
  }

  try {
    const payload = await verifySignToken(params.token);
    const contract = await loadContractBySigningToken(params.token, payload.contractId);
    if (!contract || contract.status === "cancelled") {
      return NextResponse.json({ message: "Contract unavailable" }, { status: 410 });
    }
    if (contract.status === "signed") {
      return NextResponse.json({ success: true, downloadUrl: contract.pdfUrl });
    }

    const freelancer = await loadFreelancer(contract.freelancerId);
    const signedAt = new Date().toISOString();
    const signerIp = body.ipAddress || ip;
    const pdf = await renderToBuffer(
      ContractPdf({
        contract,
        freelancerName: freelancer?.fullName ?? body.signerName,
        signerName: body.signerName.trim(),
        signerIp,
        signedAt,
      }),
    );

    let downloadUrl = `data:application/pdf;base64,${Buffer.from(pdf).toString("base64")}`;
    const admin = createAdminClient();
    if (admin) {
      const path = `${contract.companyId}/${contract.id}/signed.pdf`;
      const { error } = await admin.storage.from("contracts").upload(path, pdf, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (!error) {
        const { data } = await admin.storage.from("contracts").createSignedUrl(path, 3600);
        if (data?.signedUrl) downloadUrl = data.signedUrl;
      }
    }

    await patchContract(contract.id, {
      status: "signed",
      signedAt,
      signerName: body.signerName.trim(),
      signerIp,
      pdfUrl: downloadUrl,
    });

    return NextResponse.json({ success: true, downloadUrl });
  } catch {
    return NextResponse.json({ message: "Invalid signing token" }, { status: 410 });
  }
}
