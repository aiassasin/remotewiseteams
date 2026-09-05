import { createAdminClient } from "@/lib/supabase/admin";
import {
  getContract,
  getContractByToken,
  listContracts,
  saveContract,
  updateContract,
  type StoredContract,
} from "@/lib/store";
import { hashToken } from "@/lib/token-hash";

type ContractRow = {
  id: string;
  company_id: string;
  freelancer_id: string;
  type: string;
  title: string;
  body_html: string;
  pdf_url: string | null;
  status: StoredContract["status"];
  signed_at: string | null;
  signer_ip: string | null;
  signer_name: string | null;
  expires_at: string | null;
  created_at: string;
  document_hash: string | null;
  viewed_at: string | null;
  body_sent: string | null;
  signing_token_hash: string | null;
  sent_at: string | null;
  companies?: { name: string } | { name: string }[] | null;
};

function companyName(value: ContractRow["companies"]) {
  if (!value) return "";
  if (Array.isArray(value)) return value[0]?.name || "";
  return value.name || "";
}

function mapContract(row: ContractRow, token = ""): StoredContract {
  return {
    id: row.id,
    companyId: row.company_id,
    companyName: companyName(row.companies),
    freelancerId: row.freelancer_id,
    templateId: "",
    type: row.type,
    title: row.title,
    bodyHtml: row.body_sent || row.body_html,
    variables: {},
    clauses: [],
    status: row.status,
    token,
    tokenHash: row.signing_token_hash || "",
    pdfUrl: row.pdf_url,
    signedAt: row.signed_at,
    signerIp: row.signer_ip,
    signerName: row.signer_name,
    viewedAt: row.viewed_at,
    sentAt: row.sent_at,
    expiresAt: row.expires_at || new Date().toISOString(),
    createdAt: row.created_at,
    createdBy: companyName(row.companies) || "Workspace owner",
    documentHash: row.document_hash,
  };
}

export async function persistContract(contract: StoredContract) {
  saveContract(contract);
  const admin = createAdminClient();
  if (!admin) return { persisted: false as const };

  const { error } = await admin.from("contracts").insert({
    id: contract.id,
    company_id: contract.companyId,
    freelancer_id: contract.freelancerId,
    type: contract.type,
    title: contract.title,
    body_html: contract.bodyHtml,
    status: contract.status,
    expires_at: contract.expiresAt,
    created_at: contract.createdAt,
    document_hash: contract.documentHash,
    signing_token_hash: contract.tokenHash,
    pdf_url: contract.pdfUrl,
  });
  if (error) throw new Error(error.message);
  return { persisted: true as const };
}

export async function loadContract(id: string) {
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin
      .from("contracts")
      .select("*, companies(name)")
      .eq("id", id)
      .maybeSingle();
    if (data) {
      const mapped = mapContract(data as ContractRow);
      const memory = getContract(id);
      if (memory?.token) mapped.token = memory.token;
      return mapped;
    }
  }
  return getContract(id);
}

export async function loadContractBySigningToken(token: string, contractId: string) {
  const contract = await loadContract(contractId);
  if (!contract) return null;
  const incoming = hashToken(token);
  if (contract.tokenHash && contract.tokenHash !== incoming) return null;
  if (!contract.tokenHash && contract.token && contract.token !== token) return null;
  return { ...contract, token };
}

export async function patchContract(id: string, patch: Partial<StoredContract>) {
  const next = updateContract(id, patch);
  const admin = createAdminClient();
  if (!admin) return next;

  const dbPatch: Record<string, unknown> = {};
  if (patch.status) dbPatch.status = patch.status;
  if (patch.sentAt !== undefined) dbPatch.sent_at = patch.sentAt;
  if (patch.viewedAt !== undefined) dbPatch.viewed_at = patch.viewedAt;
  if (patch.signedAt !== undefined) dbPatch.signed_at = patch.signedAt;
  if (patch.signerIp !== undefined) dbPatch.signer_ip = patch.signerIp;
  if (patch.signerName !== undefined) dbPatch.signer_name = patch.signerName;
  if (patch.pdfUrl !== undefined) dbPatch.pdf_url = patch.pdfUrl;
  if (patch.bodyHtml !== undefined) dbPatch.body_sent = patch.bodyHtml;
  if (patch.documentHash !== undefined) dbPatch.document_hash = patch.documentHash;
  if (Object.keys(dbPatch).length) {
    await admin.from("contracts").update(dbPatch).eq("id", id);
  }
  return next ?? (await loadContract(id));
}

export async function listWorkspaceContracts(companyId: string) {
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin
      .from("contracts")
      .select("*, companies(name)")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    if (data) return (data as ContractRow[]).map((row) => mapContract(row));
  }
  return listContracts(companyId);
}

export async function listFreelancerContracts(companyId: string, freelancerId: string) {
  const rows = await listWorkspaceContracts(companyId);
  return rows.filter((row) => row.freelancerId === freelancerId);
}

export { getContractByToken };
