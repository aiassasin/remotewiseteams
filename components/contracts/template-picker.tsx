"use client";

import Link from "next/link";
import { IsoIcon } from "@/components/icons/iso-icon";
import { TEMPLATE_ICONS, TEMPLATE_IDS, typeCopy } from "@/lib/contracts/i18n";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";

export function ContractTemplatePicker() {
  return (
    <PageTransition>
      <PageHeader
        title="New contract"
        description="Choose the agreement that matches the work, or start from scratch."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {TEMPLATE_IDS.map((id) => {
          const copy = typeCopy(id, "en");
          return (
            <article
              key={id}
              className="flex flex-col rounded-card border border-border bg-card p-6 transition-colors hover:border-border-hover"
            >
              <IsoIcon name={TEMPLATE_ICONS[id]} size={48} title={copy.name} />
              <h2 className="mt-4 font-display text-card text-ink">{copy.name}</h2>
              <p className="mt-2 flex-1 font-sans text-[13px] leading-relaxed text-ink-slate">{copy.oneLiner}</p>
              <Button asChild variant="secondary" className="mt-4">
                <Link href={`/dashboard/contracts/new/${id}`}>
                  {id === "blank" ? "Start blank" : "Use this template"}
                </Link>
              </Button>
            </article>
          );
        })}
      </div>
    </PageTransition>
  );
}
