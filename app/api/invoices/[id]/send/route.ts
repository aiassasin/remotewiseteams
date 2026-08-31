import { NextResponse } from "next/server";
import { getCurrentFreelancer, getSessionUser } from "@/lib/auth/session";
import { sendInvoice } from "@/lib/invoices-server";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) return NextResponse.json({ message: "Freelancer only" }, { status: 403 });
  try {
    const invoice = await sendInvoice(params.id, freelancer.id);
    return NextResponse.json({ invoice });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not send" },
      { status: 400 },
    );
  }
}
