"use client";

import Link from "next/link";
import { FilePlus, FileText } from "lucide-react";
import { CONTRACT_TEMPLATES } from "@/lib/contract-templates";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";

export function ContractTemplatePicker() {
  return (
    <PageTransition>
      <PageHeader
        title="New contract"
        description="Choose a template to get started, or start from scratch."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CONTRACT_TEMPLATES.map((template) => (
          <article
            key={template.id}
            className="rounded-card border border-border bg-card p-6 transition-colors hover:border-border-hover"
          >
            <FileText className="h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-card text-ink">{template.name}</h2>
            <p className="mt-2 font-sans text-[13px] text-ink-slate">{template.description}</p>
            <p className="mt-4 font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
              What&apos;s included
            </p>
            <ul className="mt-2 space-y-1">
              {template.included.map((item) => (
                <li key={item} className="font-sans text-[13px] text-ink-secondary">
                  ✓ {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-sans text-small text-ink-muted">{template.readTime}</p>
            <Button asChild variant="secondary" className="mt-4">
              <Link href={`/dashboard/contracts/new/${template.id}`}>Use this template</Link>
            </Button>
          </article>
        ))}
        <article className="rounded-card border border-dashed border-border bg-card p-6">
          <FilePlus className="h-8 w-8 text-ink-muted" />
          <h2 className="mt-4 font-display text-card text-ink">Start from scratch</h2>
          <p className="mt-2 font-sans text-[13px] text-ink-slate">
            Write a custom contract from scratch
          </p>
          <Button asChild variant="secondary" className="mt-8">
            <Link href="/dashboard/contracts/new/blank">Start blank</Link>
          </Button>
        </article>
      </div>
    </PageTransition>
  );
}
