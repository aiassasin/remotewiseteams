"use client";

import type { ContractDocumentModel } from "@/lib/contracts/document";
import { useT } from "@/components/i18n/language-provider";

/**
 * Renders a stored contract as a featured paper document with parties and clause anchors.
 */
export function ContractDocumentView({
  model,
  compact = false,
}: {
  model: ContractDocumentModel;
  compact?: boolean;
}) {
  const t = useT();

  return (
    <article
      className={`rounded-card border border-border bg-white text-slate-900 shadow-lift dark:bg-[#111A2E] dark:text-slate-100 ${
        compact ? "p-6" : "px-8 py-9 sm:px-10"
      }`}
      style={{ fontFamily: "Georgia, Times, serif" }}
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
        RemoteWise Teams
      </p>
      <h2 className="mt-3 font-display text-[22px] font-semibold tracking-tight">{model.title}</h2>
      <p className="mt-2 font-sans text-[12px] text-slate-500 dark:text-slate-400">
        {model.startDateLabel} · {model.governingLaw}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-control border-s-[3px] border-primary bg-page px-3 py-2 font-sans">
          <p className="text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
            {t("contracts.company")}
          </p>
          <p className="mt-1 text-[14px] font-semibold text-ink">{model.companyName}</p>
        </div>
        <div className="rounded-control border-s-[3px] border-cyan bg-page px-3 py-2 font-sans">
          <p className="text-small font-semibold uppercase tracking-[0.06em] text-ink-muted">
            {t("contracts.freelancerParty")}
          </p>
          <p className="mt-1 text-[14px] font-semibold text-ink">{model.freelancerName}</p>
        </div>
      </div>

      <div className="my-6 h-px bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-6">
        {model.sections.map((section, index) => (
          <section
            key={`${section.heading}-${index}`}
            id={`rw-clause-${index}`}
            className="scroll-mt-28"
          >
            <h3 className="font-display text-[15px] font-semibold">
              {index + 1}. {section.heading}
            </h3>
            {section.summary ? (
              <p className="mt-1 font-sans text-[13px] text-ink-secondary">{section.summary}</p>
            ) : null}
            <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.8]">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 border-t border-slate-200 pt-4 font-sans text-[11px] text-slate-500 dark:border-slate-700">
        {model.disclaimer}
      </p>
    </article>
  );
}
