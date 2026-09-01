import type { ContractDocumentModel } from "@/lib/contracts/document";

export function ContractDocumentView({
  model,
  compact = false,
}: {
  model: ContractDocumentModel;
  compact?: boolean;
}) {
  return (
    <article
      className={`border border-border bg-white text-slate-900 dark:bg-[#111A2E] dark:text-slate-100 ${
        compact ? "p-6" : "p-10"
      }`}
      style={{ fontFamily: "Georgia, Times, serif" }}
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
        RemoteWise Teams
      </p>
      <h2 className="mt-3 font-display text-[22px] font-semibold tracking-tight">{model.title}</h2>
      <p className="mt-2 font-sans text-[12px] text-slate-500">
        {model.startDateLabel} · {model.governingLaw}
      </p>
      <div className="my-5 h-px bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-5">
        {model.sections.map((section, index) => (
          <section key={`${section.heading}-${index}`}>
            <h3 className="font-display text-[15px] font-semibold">
              {index + 1}. {section.heading}
            </h3>
            <p className="mt-1 font-sans text-[13px] italic text-slate-500">{section.summary}</p>
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
