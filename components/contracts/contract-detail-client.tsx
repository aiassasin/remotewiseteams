"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { StoredContractBody } from "@/components/contracts/stored-contract-body";
import { parseStoredDocument } from "@/lib/contracts/document";
import { useFormat, useT, type TranslateFn } from "@/components/i18n/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import type { StoredContract, StoredFreelancer } from "@/lib/store";
import { cn } from "@/lib/utils";

type DetailPayload = {
  contract: StoredContract;
  freelancer: StoredFreelancer | null;
};

type TimelineEvent = {
  id: string;
  title: string;
  detail?: string;
  done: boolean;
};

/**
 * Owner-facing contract detail: summary, signing actions, activity, and the agreement.
 */
export function ContractDetailClient() {
  const t = useT();
  const format = useFormat();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<DetailPayload | null>(null);
  const [busy, setBusy] = useState<"remind" | "void" | null>(null);

  const load = useCallback(() => {
    fetch(`/api/contracts/${params.id}`)
      .then(async (res) => {
        const json = (await res.json()) as DetailPayload & { message?: string };
        if (!res.ok || !json.contract) {
          throw new Error(json.message || t("common.retry"));
        }
        return json;
      })
      .then(setData)
      .catch((error: unknown) => {
        console.error(error);
        toast.error(error instanceof Error ? error.message : t("common.retry"));
      });
  }, [params.id, t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!data?.contract) return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("rw-clause-")) return;
    const frame = window.requestAnimationFrame(() => {
      scrollClauseIntoView(hash);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [data?.contract]);

  const copyText = useCallback(
    async (value: string, successKey: Parameters<TranslateFn>[0]) => {
      try {
        await navigator.clipboard.writeText(value);
        toast.success(t(successKey));
      } catch (error: unknown) {
        console.error(error);
        toast.error(t("common.retry"));
      }
    },
    [t],
  );

  const signingUrl = useMemo(() => {
    if (!data?.contract.token || typeof window === "undefined") return "";
    return `${window.location.origin}/sign/${data.contract.token}`;
  }, [data?.contract.token]);

  if (!data?.contract) {
    return <p className="font-sans text-body text-ink-muted">{t("common.loading")}</p>;
  }

  const { contract, freelancer } = data;
  const shortId = `RW-${contract.id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  const daysLeft = daysUntil(contract.expiresAt);
  const canAct = contract.status === "sent";
  const canVoid = contract.status === "draft" || contract.status === "sent";
  const events = timelineEvents(contract, freelancer?.fullName ?? "", format, t);
  const documentModel = parseStoredDocument(contract.bodyHtml);

  async function remind() {
    setBusy("remind");
    try {
      const res = await fetch(`/api/contracts/${contract.id}/remind`, { method: "POST" });
      const json = (await res.json()) as { sent?: boolean; to?: string; message?: string };
      if (!res.ok || !json.sent) {
        throw new Error(json.message || t("contracts.reminderFailed"));
      }
      toast.success(t("contracts.reminderSent", { email: json.to || freelancer?.email || "" }));
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : t("contracts.reminderFailed"));
    } finally {
      setBusy(null);
    }
  }

  async function voidContract() {
    if (!window.confirm(t("common.areYouSure"))) return;
    setBusy("void");
    try {
      const res = await fetch(`/api/contracts/${contract.id}/void`, { method: "POST" });
      const json = (await res.json()) as { voided?: boolean; message?: string };
      if (!res.ok || !json.voided) {
        throw new Error(json.message || t("contracts.voidFailed"));
      }
      toast.success(t("contracts.voided"));
      load();
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : t("contracts.voidFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <PageTransition>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-card border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-display text-section text-ink">{contract.title}</h1>
                <button
                  type="button"
                  className="mt-1 font-mono text-small text-ink-muted hover:text-ink"
                  onClick={() => copyText(shortId, "contracts.referenceCopied")}
                  aria-label={t("contracts.copyReference")}
                >
                  {shortId}
                </button>
              </div>
              <Badge status={contract.status}>{contract.status}</Badge>
            </div>

            <div className="mt-5 rounded-control border-s-[3px] border-warning bg-page px-3 py-3">
              <p className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-warning">
                {t("contracts.nextStep")}
              </p>
              <p className="mt-1 font-sans text-[15px] font-semibold text-ink">
                {nextStepCopy(contract, freelancer?.fullName, t)}
              </p>
              {contract.status === "sent" ? (
                <p className="mt-1 font-sans text-small text-ink-secondary">
                  {daysLeft <= 0
                    ? t("contracts.expiresToday")
                    : t("contracts.expiresInDays", { days: daysLeft })}
                </p>
              ) : null}
            </div>

            {freelancer ? (
              <div className="mt-5">
                <p className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
                  {t("contracts.freelancerParty")}
                </p>
                <Link
                  href={`/dashboard/freelancers/${freelancer.id}`}
                  className="mt-1 block font-sans text-[15px] font-semibold text-ink hover:text-primary"
                >
                  {freelancer.fullName}
                </Link>
                <p className="mt-0.5 font-sans text-[13px] text-ink-secondary">{freelancer.email}</p>
                <Link
                  href={`/dashboard/freelancers/${freelancer.id}`}
                  className="mt-1 inline-block font-sans text-small text-deep-navy hover:text-ink-secondary"
                >
                  {t("contracts.openFreelancer")}
                </Link>
              </div>
            ) : null}

            <div className="mt-5 border-t border-border pt-5">
              <h2 className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
                {t("contracts.timeline")}
              </h2>
              <ol className="mt-3">
                {events.map((event, index) => (
                  <li key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "mt-1 h-2.5 w-2.5 rounded-full",
                          event.done ? "bg-success" : "bg-border",
                        )}
                        aria-hidden
                      />
                      {index < events.length - 1 ? <span className="w-px flex-1 bg-border" aria-hidden /> : null}
                    </div>
                    <div className={cn("min-w-0 pb-3", index === events.length - 1 && "pb-0")}>
                      <p className="font-sans text-[13px] font-semibold text-ink">{event.title}</p>
                      {event.detail ? (
                        <p className="mt-0.5 font-sans text-small text-ink-muted">{event.detail}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 space-y-2">
              {contract.status === "draft" ? (
                <Button asChild size="full">
                  <Link href={`/dashboard/contracts/${contract.id}/review`}>{t("contracts.reviewAndSend")}</Link>
                </Button>
              ) : null}
              {canAct ? (
                <Button
                  variant="attention"
                  size="full"
                  type="button"
                  loading={busy === "remind"}
                  onClick={() => void remind()}
                >
                  {t("contracts.sendReminder")}
                </Button>
              ) : null}
              {canAct && signingUrl ? (
                <Button
                  variant="secondary"
                  size="full"
                  type="button"
                  onClick={() => copyText(signingUrl, "contracts.signingLinkCopied")}
                >
                  {t("contracts.copySigningLink")}
                </Button>
              ) : null}
              {contract.pdfUrl ? (
                <Button asChild variant="secondary" size="full">
                  <a href={contract.pdfUrl} download>
                    {t("contracts.downloadPdf")}
                  </a>
                </Button>
              ) : null}
              {canVoid ? (
                <Button
                  variant="text"
                  className="w-full text-danger"
                  type="button"
                  loading={busy === "void"}
                  onClick={() => void voidContract()}
                >
                  {t("contracts.voidContract")}
                </Button>
              ) : null}
            </div>
          </section>
        </aside>

        <section className="rounded-card border border-border bg-card p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
                {t("contracts.agreement")}
              </p>
              <h2 className="mt-1 font-display text-section text-ink">{contract.title}</h2>
            </div>
            {contract.pdfUrl ? (
              <Button asChild variant="secondary" size="sm">
                <a href={contract.pdfUrl} download>
                  {t("contracts.downloadPdf")}
                </a>
              </Button>
            ) : null}
          </div>

          {documentModel && documentModel.sections.length > 2 ? (
            <nav aria-label={t("contracts.contents")} className="mb-5 rounded-control bg-page px-3 py-3">
              <p className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
                {t("contracts.contents")}
              </p>
              <ol className="mt-2 columns-1 gap-x-6 sm:columns-2">
                {documentModel.sections.map((section, index) => (
                  <li key={`${section.heading}-${index}`} className="break-inside-avoid">
                    <a
                      href={`#rw-clause-${index}`}
                      className="inline-flex items-center gap-1 font-sans text-[13px] text-deep-navy hover:text-[#1E3A8A]"
                      onClick={(event) => {
                        event.preventDefault();
                        const id = `rw-clause-${index}`;
                        scrollClauseIntoView(id);
                        window.history.replaceState(null, "", `#${id}`);
                      }}
                    >
                      {index + 1}. {section.heading}
                      <ArrowRight className="h-3 w-3 shrink-0 rtl:-scale-x-100" aria-hidden />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <StoredContractBody body={contract.bodyHtml} title={contract.title} />

          <div className="mt-6">
            <p className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
              {t("contracts.signatures")}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-control border-s-[3px] border-success bg-page px-3 py-3">
                <p className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
                  {t("contracts.company")}
                </p>
                <p className="mt-2 font-sans text-[15px] font-semibold text-ink">
                  {documentModel?.companyName || contract.companyName}
                </p>
                <p className="mt-1 font-sans text-small text-success-text">
                  {t("contracts.signedByLabel", { name: contract.createdBy })}
                </p>
              </div>
              <div
                className={
                  contract.signedAt
                    ? "rounded-control border-s-[3px] border-success bg-page px-3 py-3"
                    : "rounded-control border-s-[3px] border-warning bg-page px-3 py-3"
                }
              >
                <p className="font-sans text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
                  {t("contracts.freelancerParty")}
                </p>
                <p className="mt-2 font-sans text-[15px] font-semibold text-ink">
                  {freelancer?.fullName || documentModel?.freelancerName || t("contracts.freelancerParty")}
                </p>
                <p
                  className={
                    contract.signedAt
                      ? "mt-1 font-sans text-small text-success-text"
                      : "mt-1 font-sans text-small text-warning-text"
                  }
                >
                  {contract.signedAt
                    ? t("contracts.signedByLabel", { name: contract.signerName ?? freelancer?.fullName ?? "" })
                    : t("contracts.awaitingSignature")}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 font-sans text-small text-ink-muted">{t("contracts.retentionNote")}</p>
        </section>
      </div>
    </PageTransition>
  );
}

/**
 * Scrolls a contract clause so its heading sits below the sticky dashboard header.
 */
function scrollClauseIntoView(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector("header.sticky");
  const headerHeight =
    header instanceof HTMLElement ? header.getBoundingClientRect().height : 56;
  const gap = 16;
  const top = window.scrollY + target.getBoundingClientRect().top - headerHeight - gap;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function daysUntil(iso: string) {
  const end = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - today.getTime()) / 86_400_000);
}

function nextStepCopy(contract: StoredContract, name: string | undefined, t: TranslateFn) {
  if (contract.status === "signed") return t("contracts.signedAndStored");
  if (contract.status === "cancelled") return t("contracts.voidedNextStep");
  if (contract.status === "expired") return t("contracts.expiredNextStep");
  if (contract.status === "draft") return t("contracts.draftNextStep");
  return t("contracts.waitingForSigner", { name: name || t("contracts.freelancerParty") });
}

function timelineEvents(
  contract: StoredContract,
  freelancerName: string,
  format: ReturnType<typeof useFormat>,
  t: TranslateFn,
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "created",
      title: t("contracts.created"),
      detail: `${contract.createdBy} · ${format.dateTime(contract.createdAt)}`,
      done: true,
    },
    {
      id: "sent",
      title: t("contracts.sent"),
      detail: contract.sentAt
        ? `${freelancerName} · ${format.dateTime(contract.sentAt)}`
        : t("contracts.awaitingValue"),
      done: Boolean(contract.sentAt),
    },
  ];

  if (contract.sentAt) {
    events.push({
      id: "viewed",
      title: t("contracts.viewed"),
      detail: contract.viewedAt
        ? `${freelancerName} · ${format.dateTime(contract.viewedAt)}`
        : t("contracts.awaitingValue"),
      done: Boolean(contract.viewedAt),
    });
  }

  events.push({
    id: "signed",
    title: t("contracts.signed"),
    detail: contract.signedAt
      ? `${contract.signerName ?? freelancerName} · ${format.dateTime(contract.signedAt)}`
      : t("contracts.awaitingValue"),
    done: Boolean(contract.signedAt),
  });

  return events;
}
