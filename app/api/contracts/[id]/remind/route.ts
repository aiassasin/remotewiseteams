import { NextResponse } from "next/server";
import { getContract, getFreelancer } from "@/lib/store";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const contract = getContract(params.id);
  if (!contract) {
    return NextResponse.json({ message: "Contract not found" }, { status: 404 });
  }
  const freelancer = getFreelancer(contract.freelancerId);
  return NextResponse.json({
    sent: true,
    to: freelancer?.email,
  });
}
