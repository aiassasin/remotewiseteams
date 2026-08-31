import { NextResponse } from "next/server";
import { getFreelancer, listContracts, updateContract } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const freelancer = getFreelancer(params.id);
  if (!freelancer) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const contracts = listContracts().filter((row) => row.freelancerId === params.id);
  return NextResponse.json({
    freelancer,
    contracts,
    invoices: [],
    stats: {
      totalPaid: 0,
      activeContracts: contracts.filter((row) => row.status !== "cancelled").length,
      avgPaymentTime: "—",
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const freelancer = getFreelancer(params.id);
  if (!freelancer) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  Object.assign(freelancer, body);
  return NextResponse.json({ freelancer });
}
