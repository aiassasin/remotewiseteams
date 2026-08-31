import type { Currency } from "@/lib/types";

export type StoredInvite = {
  id: string;
  token: string;
  tokenHash: string;
  name: string;
  email: string;
  role: string | null;
  rate: number | null;
  currency: Currency;
  note: string | null;
  companyId: string;
  companyName: string;
  status: "pending" | "accepted" | "expired";
  expiresAt: string;
  createdAt: string;
};

export type StoredFreelancer = {
  id: string;
  companyId: string;
  userId: string | null;
  email: string;
  fullName: string;
  role: string | null;
  hourlyRate: number | null;
  currency: Currency;
  country: string | null;
  timezone: string | null;
  bio: string | null;
  linkedin: string | null;
  website: string | null;
  avatarUrl: string | null;
  stripeAccountId: string | null;
  stripeOnboarded: boolean;
  status: "active" | "invited" | "inactive";
  createdAt: string;
};

export type ContractStatus = "draft" | "sent" | "signed" | "expired" | "cancelled";

export type StoredContract = {
  id: string;
  companyId: string;
  companyName: string;
  freelancerId: string;
  templateId: string;
  type: string;
  title: string;
  bodyHtml: string;
  variables: Record<string, string>;
  clauses: string[];
  status: ContractStatus;
  token: string;
  tokenHash: string;
  pdfUrl: string | null;
  signedAt: string | null;
  signerIp: string | null;
  signerName: string | null;
  viewedAt: string | null;
  sentAt: string | null;
  expiresAt: string;
  createdAt: string;
  createdBy: string;
  documentHash: string | null;
};

const invites = new Map<string, StoredInvite>();
const invitesByToken = new Map<string, string>();
const freelancers = new Map<string, StoredFreelancer>();
const contracts = new Map<string, StoredContract>();

export const DEFAULT_COMPANY = {
  id: "company_northstar",
  name: "Northstar Studio",
};

export function saveInvite(invite: StoredInvite) {
  invites.set(invite.id, invite);
  invitesByToken.set(invite.token, invite.id);
}

export function getInviteById(id: string) {
  return invites.get(id) ?? null;
}

export function getInviteByToken(token: string) {
  const id = invitesByToken.get(token);
  return id ? (invites.get(id) ?? null) : null;
}

export function markInviteAccepted(id: string) {
  const invite = invites.get(id);
  if (!invite) return null;
  const next = { ...invite, status: "accepted" as const };
  invites.set(id, next);
  return next;
}

export function saveFreelancer(freelancer: StoredFreelancer) {
  freelancers.set(freelancer.id, freelancer);
}

export function getFreelancer(id: string) {
  return freelancers.get(id) ?? null;
}

export function listStoredFreelancers(companyId = DEFAULT_COMPANY.id) {
  return Array.from(freelancers.values()).filter((row) => row.companyId === companyId);
}

export function saveContract(contract: StoredContract) {
  contracts.set(contract.id, contract);
}

export function getContract(id: string) {
  return contracts.get(id) ?? null;
}

export function getContractByToken(token: string) {
  return Array.from(contracts.values()).find((row) => row.token === token) ?? null;
}

export function listContracts(companyId = DEFAULT_COMPANY.id) {
  return Array.from(contracts.values()).filter((row) => row.companyId === companyId);
}

export function updateContract(id: string, patch: Partial<StoredContract>) {
  const current = contracts.get(id);
  if (!current) return null;
  const next = { ...current, ...patch };
  contracts.set(id, next);
  return next;
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "0.0.0.0";
  return request.headers.get("x-real-ip") || "0.0.0.0";
}
