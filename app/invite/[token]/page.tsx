import type { Metadata } from "next";
import { AcceptInviteClient } from "@/components/invite/accept-invite-client";

export const metadata: Metadata = {
  title: "Accept invitation",
};

export default function InvitePage({ params }: { params: { token: string } }) {
  return <AcceptInviteClient token={params.token} />;
}
