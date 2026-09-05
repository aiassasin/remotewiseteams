import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { listFreelancerContracts } from "@/lib/contracts-persistence";
import { loadFreelancer } from "@/lib/invite-persistence";
import { saveFreelancer } from "@/lib/store";

export const dynamic = "force-dynamic";

function profileResponse(
  freelancer: NonNullable<Awaited<ReturnType<typeof loadFreelancer>>>,
  contracts: Awaited<ReturnType<typeof listFreelancerContracts>>,
) {
  return {
    freelancer,
    contracts: contracts.map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      status: row.status,
      sentAt: row.sentAt,
      signedAt: row.signedAt,
    })),
    invoices: [],
    stats: {
      totalPaid: 0,
      activeContracts: contracts.filter((row) => row.status !== "cancelled").length,
      avgPaymentTime: "—",
    },
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  }
  const freelancer = await loadFreelancer(params.id);
  if (!freelancer || freelancer.companyId !== current.workspace.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const contracts = await listFreelancerContracts(current.workspace.id, freelancer.id);
  return NextResponse.json(profileResponse(freelancer, contracts));
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  }
  const freelancer = await loadFreelancer(params.id);
  if (!freelancer || freelancer.companyId !== current.workspace.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  Object.assign(freelancer, body);
  saveFreelancer(freelancer);
  return NextResponse.json({ freelancer });
}
