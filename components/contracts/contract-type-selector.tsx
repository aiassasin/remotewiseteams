"use client";

import { IsoIcon } from "@/components/icons/iso-icon";
import {
  TEMPLATE_ICONS,
  TEMPLATE_IDS,
  typeCopy,
  type ContractLanguage,
  type TemplateId,
} from "@/lib/contracts/i18n";

export function ContractTypeSelector({
  value,
  language,
  help,
  onChange,
}: {
  value: TemplateId;
  language: ContractLanguage;
  help: string;
  onChange: (id: TemplateId) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{help}</legend>
      <p className="font-sans text-small text-ink-muted">{help}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {TEMPLATE_IDS.map((id) => {
          const copy = typeCopy(id, language);
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={selected}
              className={`rounded-card border p-4 text-left transition-colors ${
                selected ? "border-primary bg-primary-light" : "border-border bg-card hover:border-border-hover"
              }`}
            >
              <IsoIcon name={TEMPLATE_ICONS[id]} size={44} title={copy.name} />
              <p className="mt-3 font-display text-[15px] font-semibold text-ink">{copy.name}</p>
              <p className="mt-1 font-sans text-[13px] leading-relaxed text-ink-secondary">{copy.oneLiner}</p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
