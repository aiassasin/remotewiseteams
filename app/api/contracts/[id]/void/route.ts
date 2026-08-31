import { NextResponse } from "next/server";
import { getContract, updateContract } from "@/lib/store";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const contract = getContract(params.id);
  if (!contract) {
    return NextResponse.json({ message: "Contract not found" }, { status: 404 });
  }
  updateContract(params.id, { status: "cancelled" });
  return NextResponse.json({ voided: true });
}
