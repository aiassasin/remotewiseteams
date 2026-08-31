import { NextResponse } from "next/server";
import { loadInvite } from "@/lib/invite-persistence";
import { verifyInviteToken } from "@/lib/jwt";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } },
) {
  try {
    const payload = await verifyInviteToken(params.token);
    const invite = await loadInvite(payload.inviteId, params.token);
    if (!invite) {
      return NextResponse.json({
        valid: false,
        expired: false,
        freelancerName: payload.name,
        email: payload.email,
        companyName: payload.companyName,
      });
    }
    if (invite.status === "accepted") {
      return NextResponse.json({
        valid: false,
        expired: false,
        used: true,
        freelancerName: invite.name,
        email: invite.email,
        companyName: invite.companyName,
      });
    }
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({
        valid: false,
        expired: true,
        freelancerName: invite.name,
        email: invite.email,
        companyName: invite.companyName,
      });
    }
    return NextResponse.json({
      valid: true,
      expired: false,
      freelancerName: invite.name,
      email: invite.email,
      companyName: invite.companyName,
      role: invite.role,
    });
  } catch {
    return NextResponse.json({
      valid: false,
      expired: true,
      freelancerName: "",
      email: "",
      companyName: "",
    });
  }
}
