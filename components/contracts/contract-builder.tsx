"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fillTemplate, type ContractTemplate } from "@/lib/contract-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/motion/page-transition";
import type { Freelancer } from "@/lib/types";

const CLAUSES = [
  { id: "noncompete", label: "Non-compete clause (6 months)" },
  { id: "ip", label: "Intellectual property assignment" },
  { id: "arbitration", label: "Dispute resolution (arbitration)" },
];

export function ContractBuilder({ template }: { template: ContractTemplate }) {
  const router = useRouter();
  const [title, setTitle] = useState(`${template.name} — Northstar Studio`);
  const [freelancerId, setFreelancerId] = useState("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [law, setLaw] = useState("England and Wales");
  const [effective, setEffective] = useState(new Date().toISOString().slice(0, 10));
  const [expires, setExpires] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  );
  const [values, setValues] = useState<Record<string, string>>({
    COMPANY_NAME: "Northstar Studio",
    DATE: new Date().toLocaleDateString("en-GB"),
    GOVERNING_LAW: "England and Wales",
    DURATION: "2 years",
    PAYMENT_TERMS: "Net 30",
    NOTICE_PERIOD: "30 days",
  });
  const [clauses, setClauses] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/freelancers")
      .then((res) => res.json())
      .then((data: { freelancers?: Freelancer[] }) => setFreelancers(data.freelancers ?? []))
      .catch(() => setFreelancers([]));
  }, []);

  const selected = freelancers.find((row) => row.id === freelancerId);
  const merged = {
    ...values,
    FREELANCER_NAME: selected?.fullName || values.FREELANCER_NAME || "[FREELANCER_NAME]",
    GOVERNING_LAW: law,
    DATE: new Date(effective).toLocaleDateString("en-GB"),
  };
  const preview = fillTemplate(template.body, merged);

  async function goToReview() {
    const response = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        freelancerId,
        templateId: template.id,
        title,
        type: template.type,
        variables: merged,
        clauses,
        expiresAt: expires,
        body: preview,
      }),
    });
    const data = (await response.json()) as { contractId?: string; message?: string };
    if (!response.ok || !data.contractId) return;
    router.push(`/dashboard/contracts/${data.contractId}/review`);
  }

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-96px)] flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-card border border-border bg-page p-6 lg:w-[400px] lg:shrink-0">
          <h1 className="rw-section-title">Contract details</h1>
          <section className="mt-6 space-y-4">
            <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
              Parties
            </p>
            <div>
              <Label>Company</Label>
              <Input value="Northstar Studio" readOnly />
            </div>
            <div>
              <Label htmlFor="freelancer">Freelancer</Label>
              <select
                id="freelancer"
                className="rw-input"
                value={freelancerId}
                onChange={(event) => setFreelancerId(event.target.value)}
              >
                <option value="">Select a freelancer</option>
                {freelancers.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.fullName} — {row.email}
                  </option>
                ))}
              </select>
            </div>
          </section>
          <section className="mt-6 space-y-4">
            <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
              Contract settings
            </p>
            <div>
              <Label htmlFor="title">Contract title</Label>
              <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div>
              <Label>Type</Label>
              <Input value={template.type} readOnly={template.type !== "Custom"} />
            </div>
            <div>
              <Label htmlFor="law">Governing law</Label>
              <Input id="law" value={law} onChange={(event) => setLaw(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="effective">Effective date</Label>
              <Input id="effective" type="date" value={effective} onChange={(event) => setEffective(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="expires">Expiry date for signing</Label>
              <Input id="expires" type="date" value={expires} onChange={(event) => setExpires(event.target.value)} />
            </div>
          </section>
          <section className="mt-6 space-y-4">
            <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
              Variables
            </p>
            {template.variables
              .filter((key) => !["COMPANY_NAME", "FREELANCER_NAME", "DATE", "GOVERNING_LAW"].includes(key))
              .map((key) => (
                <div key={key}>
                  <Label htmlFor={key}>{key.replaceAll("_", " ")}</Label>
                  {key === "DELIVERABLES" ? (
                    <Textarea
                      id={key}
                      value={values[key] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  ) : (
                    <Input
                      id={key}
                      value={values[key] ?? ""}
                      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  )}
                </div>
              ))}
          </section>
          <section className="mt-6 space-y-2">
            <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
              Additional clauses
            </p>
            {CLAUSES.map((clause) => (
              <label key={clause.id} className="flex items-center gap-2 font-sans text-[14px] text-ink">
                <input
                  type="checkbox"
                  checked={clauses.includes(clause.id)}
                  onChange={(event) =>
                    setClauses((current) =>
                      event.target.checked
                        ? [...current, clause.id]
                        : current.filter((id) => id !== clause.id),
                    )
                  }
                />
                {clause.label}
              </label>
            ))}
          </section>
          <Button className="sticky bottom-4 mt-8 w-full" onClick={goToReview} disabled={!freelancerId}>
            Preview contract →
          </Button>
        </aside>
        <section className="min-w-0 flex-1 rounded-card border border-border bg-card p-6">
          <article className="mx-auto min-h-[640px] max-w-[640px] border border-border bg-white p-10" style={{ fontFamily: "Georgia, Times, serif" }}>
            <h2 className="font-display text-section text-ink">{title}</h2>
            <pre className="mt-6 whitespace-pre-wrap font-[Georgia] text-[14px] leading-[1.8] text-ink">
              {preview}
            </pre>
            <p className="mt-10 font-sans text-small text-ink-muted">
              Page 1 of 1 · RemoteWise · Confidential
            </p>
          </article>
          <p className="mt-4 text-center font-sans text-small text-ink-muted">
            PDF will be generated when contract is sent
          </p>
        </section>
      </div>
    </PageTransition>
  );
}
