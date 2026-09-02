"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StoredContractBody } from "@/components/contracts/stored-contract-body";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import type { StoredContract } from "@/lib/store";
import type { StoredFreelancer } from "@/lib/store";
import { useT } from "@/components/i18n/language-provider";

export default function ContractDetailPage() {
  const t = useT();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<{ contract: StoredContract; freelancer: StoredFreelancer | null } | null>(null);

  useEffect(() => {
    fetch(`/api/contracts/${params.id}`)
      .then((res) => res.json())
      .then(setData);
  }, [params.id]);

  if (!data?.contract) return null;
  const { contract, freelancer } = data;
  const shortId = `RW-${contract.id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;

  return (
    <PageTransition>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-card border border-border bg-card p-6">
          <h1 className="font-display text-section text-ink">{contract.title}</h1>
          <div className="mt-3">
            <Badge status={contract.status}>{contract.status}</Badge>
          </div>
          <p className="mt-4 font-sans text-[14px] text-ink">
            {freelancer?.fullName} · {freelancer?.email}
          </p>
          <dl className="mt-4 space-y-2 font-sans text-[13px] text-ink-secondary">
            <div>{t("contracts.created")} {new Date(contract.createdAt).toLocaleString()}</div>
            <div>{t("contracts.sent")} {contract.sentAt ? new Date(contract.sentAt).toLocaleString() : "—"}</div>
            <div>{t("contracts.signed")} {contract.signedAt ? new Date(contract.signedAt).toLocaleString() : "—"}</div>
            <div>{t("contracts.expires")} {new Date(contract.expiresAt).toLocaleDateString()}</div>
          </dl>
          <p className="mt-4 break-all font-mono text-mono text-ink-secondary">{contract.documentHash}</p>
          <div className="mt-6 space-y-2">
            {contract.pdfUrl ? (
              <a href={contract.pdfUrl} download>
                <Button size="full">{t("contracts.downloadPdf")}</Button>
              </a>
            ) : null}
            {contract.status === "sent" ? (
              <form action={`/api/contracts/${contract.id}/remind`} method="post">
                <Button variant="attention" size="full" type="submit">
                  {t("contracts.sendReminder")}
                </Button>
              </form>
            ) : null}
          </div>
          <p className="mt-4 font-mono text-small text-ink-muted">{shortId}</p>
        </aside>
        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="font-display text-card text-ink">{t("contracts.timeline")}</h2>
          <ol className="mt-4 space-y-3 font-sans text-[14px] text-ink-secondary">
            <li>{t("contracts.createdBy", { name: contract.createdBy, date: new Date(contract.createdAt).toLocaleString() })}</li>
            {contract.sentAt ? (
              <li>{t("contracts.sentTo", { name: freelancer?.fullName ?? "", date: new Date(contract.sentAt).toLocaleString() })}</li>
            ) : null}
            {contract.viewedAt ? (
              <li>{t("contracts.viewedBy", { name: freelancer?.fullName ?? "", date: new Date(contract.viewedAt).toLocaleString() })}</li>
            ) : null}
            {contract.signedAt ? (
              <li>
                {t("contracts.signedBy", {
                  name: contract.signerName ?? "",
                  date: new Date(contract.signedAt).toLocaleString(),
                  ip: contract.signerIp ?? "",
                })}
              </li>
            ) : null}
          </ol>
          <StoredContractBody body={contract.bodyHtml} title={contract.title} />
        </section>
      </div>
    </PageTransition>
  );
}
