import { Resend } from "resend";
import { FreelancerInviteEmail } from "@/emails/freelancer-invite";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendInviteEmail(input: {
  to: string;
  companyName: string;
  freelancerName: string;
  inviteUrl: string;
  note?: string | null;
}) {
  const resend = getResend();
  if (!resend) {
    return { skipped: true as const, id: null };
  }

  const from =
    process.env.RESEND_FROM_EMAIL || "RemoteWise <invites@remotewise.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to: [input.to],
    subject: `${input.companyName} invited you to RemoteWise`,
    react: FreelancerInviteEmail({
      companyName: input.companyName,
      freelancerName: input.freelancerName,
      inviteUrl: input.inviteUrl,
      note: input.note,
    }),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { skipped: false as const, id: data?.id ?? null };
}

export async function sendInvoiceCancelledEmail(input: {
  to: string;
  companyName: string;
  invoiceNumber: string;
  reason: string;
}) {
  const resend = getResend();
  if (!resend) {
    return { skipped: true as const, id: null };
  }
  const from = process.env.RESEND_FROM_EMAIL || "RemoteWise <invites@remotewise.dev>";
  const { data, error } = await resend.emails.send({
    from,
    to: [input.to],
    subject: `${input.invoiceNumber} was cancelled`,
    text: `${input.companyName}: invoice ${input.invoiceNumber} was cancelled. ${input.reason}`,
  });
  if (error) throw new Error(error.message);
  return { skipped: false as const, id: data?.id ?? null };
}
