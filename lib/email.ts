import { Resend } from "resend";
import { FreelancerInviteEmail } from "@/emails/freelancer-invite";
import { InvoiceSentEmail } from "@/emails/invoice-sent";
import { InvoicePaidEmail } from "@/emails/invoice-paid";
import { PayoutReceivedEmail } from "@/emails/payout-received";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL || "RemoteWise <invites@remotewise.dev>";
}

export async function sendInviteEmail(input: {
  to: string;
  companyName: string;
  freelancerName: string;
  inviteUrl: string;
  note?: string | null;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const, id: null };
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [input.to],
    subject: `${input.companyName} invited you to RemoteWise`,
    react: FreelancerInviteEmail(input),
  });
  if (error) throw new Error(error.message);
  return { skipped: false as const, id: data?.id ?? null };
}

export async function sendInvoiceSentEmail(input: {
  to: string;
  freelancerName: string;
  companyName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  invoiceUrl: string;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const, id: null };
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [input.to],
    subject: `${input.invoiceNumber} is ready to pay`,
    react: InvoiceSentEmail(input),
  });
  if (error) throw new Error(error.message);
  return { skipped: false as const, id: data?.id ?? null };
}

export async function sendInvoicePaidEmail(input: {
  to: string;
  freelancerName: string;
  invoiceNumber: string;
  amount: string;
  youKeep: string;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const, id: null };
  const app = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [input.to],
    subject: `${input.invoiceNumber} is paid`,
    react: InvoicePaidEmail({ ...input, payoutUrl: `${app}/dashboard/payouts` }),
  });
  if (error) throw new Error(error.message);
  return { skipped: false as const, id: data?.id ?? null };
}

export async function sendPayoutReceivedEmail(input: {
  to: string;
  freelancerName: string;
  invoiceNumber: string;
  youKeep: string;
  speed: string;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const, id: null };
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [input.to],
    subject: `${input.youKeep} is on the way`,
    react: PayoutReceivedEmail(input),
  });
  if (error) throw new Error(error.message);
  return { skipped: false as const, id: data?.id ?? null };
}

export async function sendInvoiceCancelledEmail(input: {
  to: string;
  companyName: string;
  invoiceNumber: string;
  reason: string;
}) {
  const resend = getResend();
  if (!resend) return { skipped: true as const, id: null };
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [input.to],
    subject: `${input.invoiceNumber} was cancelled`,
    text: `${input.companyName}: invoice ${input.invoiceNumber} was cancelled. ${input.reason}`,
  });
  if (error) throw new Error(error.message);
  return { skipped: false as const, id: data?.id ?? null };
}
