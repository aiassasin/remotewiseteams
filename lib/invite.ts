import type {
  InviteFreelancerInput,
  InviteFreelancerResponse,
} from "@/lib/types";

export async function sendFreelancerInvite(
  payload: InviteFreelancerInput,
): Promise<InviteFreelancerResponse> {
  const response = await fetch("/api/freelancers/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    inviteId?: string;
    message?: string;
    field?: "name" | "email" | "rate";
  };

  if (!response.ok) {
    const error = new Error(data.message ?? "Could not send invite") as Error & {
      field?: "name" | "email" | "rate";
    };
    error.field = data.field;
    throw error;
  }

  return {
    inviteId: data.inviteId ?? "",
    message: data.message ?? "Invite sent",
  };
}
