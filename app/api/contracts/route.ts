import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { persistContract, listWorkspaceContracts } from "@/lib/contracts-persistence";
import { loadFreelancer } from "@/lib/invite-persistence";
import { signContractToken } from "@/lib/jwt";
import type { StoredContract } from "@/lib/store";
import { hashToken } from "@/lib/token-hash";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  }
  const contracts = await listWorkspaceContracts(current.workspace.id);
  return NextResponse.json({ contracts });
}

export async function POST(request: Request) {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  }

  const body = (await request.json()) as {
    freelancerId?: string;
    templateId?: string;
    title?: string;
    type?: string;
    variables?: Record<string, string>;
    clauses?: string[];
    expiresAt?: string;
    body?: string;
    companyName?: string;
    language?: string;
  };

  if (!body.freelancerId || !body.title || !body.body) {
    return NextResponse.json({ message: "Missing contract fields" }, { status: 400 });
  }

  const freelancer = await loadFreelancer(body.freelancerId);
  if (!freelancer || freelancer.companyId !== current.workspace.id) {
    return NextResponse.json({ message: "Freelancer not found" }, { status: 404 });
  }

  const id = crypto.randomUUID();
  const token = await signContractToken({ contractId: id });
  const contract: StoredContract = {
    id,
    companyId: current.workspace.id,
    companyName: body.companyName?.trim() || current.workspace.name,
    freelancerId: freelancer.id,
    templateId: body.templateId ?? "custom",
    type: body.type ?? "Custom",
    title: body.title,
    bodyHtml: body.body,
    variables: {
      ...(body.variables ?? {}),
      ...(body.language ? { CONTRACT_LANGUAGE: body.language } : {}),
    },
    clauses: body.clauses ?? [],
    status: "draft",
    token,
    tokenHash: hashToken(token),
    pdfUrl: null,
    signedAt: null,
    signerIp: null,
    signerName: null,
    viewedAt: null,
    sentAt: null,
    expiresAt: body.expiresAt
      ? new Date(body.expiresAt).toISOString()
      : new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    createdBy: current.user.fullName,
    documentHash: createHash("sha256").update(body.body).digest("hex"),
  };

  try {
    await persistContract(contract);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not save contract" },
      { status: 500 },
    );
  }

  return NextResponse.json({ contractId: id });
}
