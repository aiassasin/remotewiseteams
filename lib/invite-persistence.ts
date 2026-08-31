import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_COMPANY,
  getFreelancer,
  getInviteById,
  listStoredFreelancers,
  markInviteAccepted,
  saveFreelancer,
  saveInvite,
  type StoredFreelancer,
  type StoredInvite,
} from "@/lib/store";
import { hashToken } from "@/lib/token-hash";
import type { Currency, Freelancer } from "@/lib/types";

type CompanyRow = { id: string; name: string };

type InviteRow = {
  id: string;
  company_id: string;
  email: string;
  full_name: string;
  role: string | null;
  hourly_rate: number | string | null;
  currency: string | null;
  note: string | null;
  token_hash: string;
  status: StoredInvite["status"];
  expires_at: string;
  created_at: string;
  companies?: { name: string } | { name: string }[] | null;
};

type FreelancerRow = {
  id: string;
  company_id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: string | null;
  hourly_rate: number | string | null;
  currency: string | null;
  country: string | null;
  timezone: string | null;
  bio: string | null;
  linkedin_url: string | null;
  website: string | null;
  avatar_url: string | null;
  stripe_account_id: string | null;
  stripe_onboarded: boolean | null;
  status: StoredFreelancer["status"];
  created_at: string;
};

function companyNameFromJoin(value: InviteRow["companies"]) {
  if (!value) return DEFAULT_COMPANY.name;
  if (Array.isArray(value)) return value[0]?.name || DEFAULT_COMPANY.name;
  return value.name || DEFAULT_COMPANY.name;
}

function mapInvite(row: InviteRow): StoredInvite {
  return {
    id: row.id,
    token: "",
    tokenHash: row.token_hash,
    name: row.full_name,
    email: row.email,
    role: row.role,
    rate: row.hourly_rate == null ? null : Number(row.hourly_rate),
    currency: (row.currency as Currency) || "USD",
    note: row.note,
    companyId: row.company_id,
    companyName: companyNameFromJoin(row.companies),
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

function mapFreelancer(row: FreelancerRow): StoredFreelancer {
  return {
    id: row.id,
    companyId: row.company_id,
    userId: row.user_id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    hourlyRate: row.hourly_rate == null ? null : Number(row.hourly_rate),
    currency: (row.currency as Currency) || "USD",
    country: row.country,
    timezone: row.timezone,
    bio: row.bio,
    linkedin: row.linkedin_url,
    website: row.website,
    avatarUrl: row.avatar_url,
    stripeAccountId: row.stripe_account_id,
    stripeOnboarded: Boolean(row.stripe_onboarded),
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function resolveWorkspace(): Promise<CompanyRow | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const { data, error } = await admin
    .from("companies")
    .select("id, name")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("Failed to load workspace", error.message);
    return null;
  }
  return data;
}

export async function persistInvite(invite: StoredInvite, workspace?: CompanyRow | null) {
  const admin = createAdminClient();
  const resolved = workspace ?? (await resolveWorkspace());
  if (resolved) {
    invite.companyId = resolved.id;
    invite.companyName = resolved.name;
  }
  saveInvite(invite);

  if (!admin || !resolved) {
    saveFreelancer({
      id: invite.id,
    companyId: invite.companyId,
      userId: null,
      email: invite.email,
      fullName: invite.name,
      role: invite.role,
      hourlyRate: invite.rate,
      currency: invite.currency,
      country: null,
      timezone: null,
      bio: null,
      linkedin: null,
      website: null,
      avatarUrl: null,
      stripeAccountId: null,
      stripeOnboarded: false,
      status: "invited",
      createdAt: invite.createdAt,
    });
    return { persisted: false as const, workspace: resolved };
  }

  const { error: inviteError } = await admin.from("freelancer_invites").insert({
    id: invite.id,
    company_id: resolved.id,
    email: invite.email,
    full_name: invite.name,
    role: invite.role,
    hourly_rate: invite.rate,
    currency: invite.currency,
    note: invite.note,
    token_hash: invite.tokenHash,
    status: "pending",
    expires_at: invite.expiresAt,
    created_at: invite.createdAt,
  });

  if (inviteError) {
    if (inviteError.code === "23505") {
      const error = new Error("An invite is already pending for this email") as Error & {
        field?: "email";
        status?: number;
      };
      error.field = "email";
      error.status = 409;
      throw error;
    }
    throw new Error(inviteError.message);
  }

  const { error: freelancerError } = await admin.from("freelancers").insert({
    id: invite.id,
    company_id: resolved.id,
    email: invite.email,
    full_name: invite.name,
    role: invite.role,
    hourly_rate: invite.rate,
    currency: invite.currency,
    status: "invited",
    created_at: invite.createdAt,
  });

  if (freelancerError && freelancerError.code !== "23505") {
    throw new Error(freelancerError.message);
  }

  saveFreelancer({
    id: invite.id,
    companyId: resolved.id,
    userId: null,
    email: invite.email,
    fullName: invite.name,
    role: invite.role,
    hourlyRate: invite.rate,
    currency: invite.currency,
    country: null,
    timezone: null,
    bio: null,
    linkedin: null,
    website: null,
    avatarUrl: null,
    stripeAccountId: null,
    stripeOnboarded: false,
    status: "invited",
    createdAt: invite.createdAt,
  });

  return { persisted: true as const, workspace: resolved };
}

export async function loadFreelancer(id: string) {
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin.from("freelancers").select("*").eq("id", id).maybeSingle();
    if (data) return mapFreelancer(data as FreelancerRow);
  }
  return getFreelancer(id);
}

export async function loadInvite(id: string, token?: string) {
  const admin = createAdminClient();
  if (admin) {
    const { data, error } = await admin
      .from("freelancer_invites")
      .select("*, companies(name)")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("Failed to load invite", error.message);
    } else if (data) {
      const invite = mapInvite(data as InviteRow);
      if (token && invite.tokenHash !== hashToken(token)) {
        return null;
      }
      return invite;
    }
  }
  const memory = getInviteById(id);
  if (!memory) return null;
  if (token && memory.tokenHash && memory.tokenHash !== hashToken(token)) {
    return null;
  }
  return memory;
}

export async function acceptInviteRecord(input: {
  invite: StoredInvite;
  userId: string;
  name: string;
  country: string;
  timezone: string;
}) {
  markInviteAccepted(input.invite.id);
  const freelancer: StoredFreelancer = {
    id: input.invite.id,
    companyId: input.invite.companyId,
    userId: input.userId,
    email: input.invite.email,
    fullName: input.name,
    role: input.invite.role,
    hourlyRate: input.invite.rate,
    currency: input.invite.currency,
    country: input.country,
    timezone: input.timezone,
    bio: null,
    linkedin: null,
    website: null,
    avatarUrl: null,
    stripeAccountId: null,
    stripeOnboarded: false,
    status: "active",
    createdAt: input.invite.createdAt,
  };
  saveFreelancer(freelancer);

  const admin = createAdminClient();
  if (!admin) return freelancer;

  const now = new Date().toISOString();
  await admin
    .from("freelancer_invites")
    .update({ status: "accepted", accepted_at: now })
    .eq("id", input.invite.id)
    .eq("status", "pending");

  await admin
    .from("freelancers")
    .update({
      user_id: input.userId,
      full_name: input.name,
      country: input.country,
      timezone: input.timezone,
      status: "active",
    })
    .eq("id", input.invite.id);

  return freelancer;
}

export async function listRosterFreelancers(companyId?: string): Promise<Freelancer[]> {
  const admin = createAdminClient();
  const workspaceId = companyId ?? (await resolveWorkspace())?.id;
  if (admin && workspaceId) {
    const { data, error } = await admin
      .from("freelancers")
      .select("*")
      .eq("company_id", workspaceId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to list freelancers", error.message);
    } else if (data) {
      return (data as FreelancerRow[]).map((row) => {
        const mapped = mapFreelancer(row);
        return {
          id: mapped.id,
          fullName: mapped.fullName,
          email: mapped.email,
          role: mapped.role,
          hourlyRate: mapped.hourlyRate,
          currency: mapped.currency,
          status: mapped.status,
          country: mapped.country,
          avatarUrl: mapped.avatarUrl,
          stripeOnboarded: mapped.stripeOnboarded,
          contractCount: 0,
          invoiceCount: 0,
          createdAt: mapped.createdAt,
        };
      });
    }
  }

  return listStoredFreelancers(workspaceId).map((row) => ({
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    role: row.role,
    hourlyRate: row.hourlyRate,
    currency: row.currency,
    status: row.status,
    country: row.country,
    avatarUrl: row.avatarUrl,
    stripeOnboarded: row.stripeOnboarded,
    contractCount: 0,
    invoiceCount: 0,
    createdAt: row.createdAt,
  }));
}
