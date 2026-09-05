"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import { StoredContractBody } from "@/components/contracts/stored-contract-body";
import { parseStoredDocument } from "@/lib/contracts/document";
import type { StoredContract } from "@/lib/store";
import { useFormat, useT } from "@/components/i18n/language-provider";

export function ContractReview({ contractId }: { contractId: string }) {
  const t = useT();
  const format = useFormat();
  const router = useRouter();
  const [contract, setContract] = useState<StoredContract | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [signingUrl, setSigningUrl] = useState("");

  useEffect(() => {
    fetch(`/api/contracts/${contractId}`)
      .then((res) => res.json())
      .then((data: { contract: StoredContract }) => setContract(data.contract));
  }, [contractId]);

  async function send() {
    const response = await fetch(`/api/contracts/${contractId}/send`, { method: "POST" });
    const data = (await response.json()) as { sent?: boolean; signingUrl?: string };
    if (data.sent) {
      setSigningUrl(data.signingUrl ?? "");
      setSent(true);
      setTimeout(() => router.push(`/dashboard/contracts/${contractId}`), 1600);
    }
  }

  if (!contract) return null;
  const model = parseStoredDocument(contract.bodyHtml);
  const companyLabel = model?.companyName || contract.companyName;

  return (
    <PageTransition>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="text" onClick={() => router.back()}>
          {t("contracts.editDetails")}
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary">{t("contracts.downloadPreview")}</Button>
          <Button onClick={() => setConfirmOpen(true)}>{t("contracts.sendForSignature")}</Button>
        </div>
      </div>
      <article className="rounded-card border border-border bg-card p-6">
        <StoredContractBody body={contract.bodyHtml} title={contract.title} />
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border-s-[3px] border-success bg-success-light p-4">
            <p className="font-sans text-small uppercase tracking-[0.05em] text-ink-muted">{t("contracts.company")}</p>
            <p className="mt-2 font-[cursive] text-[22px] text-ink">{companyLabel}</p>
            <p className="font-sans text-small text-ink-secondary">
              {t("contracts.signedByLabel", { name: contract.createdBy })}
            </p>
          </div>
          <div className="border border-border p-4">
            <p className="font-sans text-small uppercase tracking-[0.05em] text-ink-muted">
              {t("contracts.freelancerParty")}
            </p>
            <p className="mt-6 font-sans text-body text-ink-muted">{t("contracts.awaitingSignature")}</p>
          </div>
        </div>
      </article>

      {confirmOpen && !sent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-modal rounded-card border border-border bg-card p-8">
            <h2 className="font-display text-section text-ink">{t("contracts.sendModalTitle")}</h2>
            <p className="mt-3 font-sans text-body text-ink-secondary">{t("contracts.sendModalBody")}</p>
            <dl className="mt-4 space-y-1 font-sans text-[14px] text-ink">
              <div>{t("contracts.contractType", { type: contract.type })}</div>
              <div>{t("sign.expires", { date: format.date(contract.expiresAt) })}</div>
            </dl>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="text" onClick={() => setConfirmOpen(false)}>
                {t("contracts.goBack")}
              </Button>
              <Button onClick={send}>{t("contracts.sendContract")}</Button>
            </div>
          </div>
        </div>
      ) : null}

      {sent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95">
          <div className="text-center">
            <motion.div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-success"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.4 }}
            >
              <Check className="h-8 w-8" />
            </motion.div>
            <p className="mt-4 font-display text-section text-ink">{t("contracts.sentToast")}</p>
            {signingUrl ? (
              <p className="mt-2 font-mono text-mono text-ink-muted">{signingUrl}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </PageTransition>
  );
}
