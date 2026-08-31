import { NextResponse } from "next/server";
import { getCurrentWorkspace } from "@/lib/auth/session";
import { listRosterFreelancers } from "@/lib/invite-persistence";

export async function GET() {
  const current = await getCurrentWorkspace();
  if (!current) {
    return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  }
  const freelancers = await listRosterFreelancers(current.workspace.id);
  return NextResponse.json({ freelancers });
}
