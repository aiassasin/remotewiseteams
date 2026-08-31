import { NextResponse } from "next/server";
import { getCurrentFreelancer, getSessionUser } from "@/lib/auth/session";
import { cancelInvoice } from "@/lib/invoices-server";
import { sendInvoiceCancelledEmail } from "@/lib/email";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const freelancer = await getCurrentFreelancer();
  if (!freelancer) return NextResponse.json({ message: "Freelancer only" }, { status: 403 });

  let body: { reason?: string };
  try {
    body = (await request.json()) as { reason?: string };
  } catch {
    body = {};
  }
  const reason = body.reason?.trim() || "Cancelled by freelancer";

  try {
    const invoice = await cancelInvoice({
      id: params.id,
      freelancerId: freelancer.id,
      userId: user.id,
      reason,
    });
    const supabase = createServerSupabaseClient();
    const { data: company } = await supabase
      .from("companies")
      .select("name, owner_id")
      .eq("id", invoice.companyId)
      .maybeSingle();
    if (company?.owner_id) {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      if (admin) {
        const { data } = await admin.auth.admin.getUserById(company.owner_id);
        if (data.user?.email) {
          await sendInvoiceCancelledEmail({
            to: data.user.email,
            companyName: company.name,
            invoiceNumber: invoice.invoiceNumber,
            reason,
          }).catch(() => undefined);
        }
      }
    }
    return NextResponse.json({ invoice });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not cancel" },
      { status: 400 },
    );
  }
}
