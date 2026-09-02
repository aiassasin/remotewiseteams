"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ContractDocumentView } from "@/components/contracts/contract-document-view";
import { ContractTypeSelector } from "@/components/contracts/contract-type-selector";
import { FreelancerPicker } from "@/components/contracts/freelancer-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageTransition } from "@/components/motion/page-transition";
import { DEFAULT_GOVERNING_COUNTRY, GOVERNING_LAW_COUNTRIES } from "@/lib/contracts/countries";
import {
  buildContractDocument,
  composeAddress,
  serializeDocument,
} from "@/lib/contracts/document";
import {
  CLAUSE_IDS,
  CONTRACT_LANGUAGES,
  LANGUAGE_LABELS,
  clauseCopy,
  typeCopy,
  uiCopy,
  variableLabel,
  type ContractLanguage,
  type TemplateId,
} from "@/lib/contracts/i18n";
import { TEMPLATE_VARIABLES } from "@/lib/contracts/templates";
import type { ContractTemplate } from "@/lib/contract-templates";
import type { CompanyPayload } from "@/lib/settings";
import type { Freelancer } from "@/lib/types";
import { useAppLanguage } from "@/components/i18n/language-provider";

function plusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isTemplateId(value: string): value is TemplateId {
  return ["nda", "msa", "sow", "ica", "blank"].includes(value);
}

export function ContractBuilder({ template }: { template: ContractTemplate }) {
  const router = useRouter();
  const { language: appLanguage } = useAppLanguage();
  const [templateId, setTemplateId] = useState<TemplateId>(
    isTemplateId(template.id) ? template.id : "nda",
  );
  const [language, setLanguage] = useState<ContractLanguage>(appLanguage);
  const copy = uiCopy(language);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [title, setTitle] = useState(template.name);
  const [titleTouched, setTitleTouched] = useState(false);
  const [governingCountry, setGoverningCountry] = useState(DEFAULT_GOVERNING_COUNTRY);
  const [useLastSignature, setUseLastSignature] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [expires, setExpires] = useState(() => plusDays(7));
  const [values, setValues] = useState<Record<string, string>>({
    DURATION: "2 years",
    PAYMENT_TERMS: "Net 14",
    NOTICE_PERIOD: "30 days",
  });
  const [clauses, setClauses] = useState<string[]>([]);
  const [desktop, setDesktop] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLanguage(appLanguage);
  }, [appLanguage]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    fetch("/api/freelancers")
      .then((res) => res.json())
      .then((data: { freelancers?: Freelancer[] }) => setFreelancers(data.freelancers ?? []))
      .catch(() => setFreelancers([]));
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data: { settings?: { company: CompanyPayload | null } }) => {
        const company = data.settings?.company;
        if (!company) return;
        setCompanyName(company.name);
        setCompanyId(company.yTunnus || company.vatId);
        setCompanyAddress(
          composeAddress({
            line1: company.addressLine1,
            line2: company.addressLine2,
            city: company.city,
            postalCode: company.postalCode,
            country: company.country,
          }),
        );
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (titleTouched) return;
    const name = typeCopy(templateId, language).name;
    setTitle(companyName ? `${name} — ${companyName}` : name);
  }, [templateId, language, companyName, titleTouched]);

  const selected = freelancers.find((row) => row.id === freelancerId);
  const model = useMemo(
    () =>
      buildContractDocument({
        templateId,
        language,
        title,
        companyName,
        companyAddress,
        companyId,
        freelancerName: selected?.fullName ?? "",
        startDate,
        useLastSignature,
        lastSignatureLabel: copy.lastSignature,
        governingCountryCode: governingCountry,
        variables: values,
        clauses,
      }),
    [
      templateId,
      language,
      title,
      companyName,
      companyAddress,
      companyId,
      selected?.fullName,
      startDate,
      useLastSignature,
      copy.lastSignature,
      governingCountry,
      values,
      clauses,
    ],
  );

  const filled =
    Boolean(companyName.trim()) ||
    Boolean(title.trim()) ||
    Boolean(freelancerId) ||
    Boolean(companyAddress.trim()) ||
    Boolean(companyId.trim()) ||
    Boolean(startDate) ||
    clauses.length > 0 ||
    Object.values(values).some((value) => value.trim());

  async function goToReview() {
    if (!freelancerId) return;
    setSaving(true);
    const response = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        freelancerId,
        templateId,
        title: model.title,
        type: ({ nda: "NDA", msa: "MSA", sow: "SOW", ica: "ICA", blank: "Custom" } as const)[templateId],
        companyName: companyName.trim(),
        language,
        variables: {
          ...values,
          COMPANY_NAME: companyName,
          COMPANY_ADDRESS: companyAddress,
          COMPANY_ID: companyId,
          FREELANCER_NAME: selected?.fullName ?? "",
          GOVERNING_LAW: model.governingLaw,
          GOVERNING_COUNTRY: governingCountry,
          CONTRACT_LANGUAGE: language,
          START_DATE: model.startDateLabel,
        },
        clauses,
        expiresAt: expires,
        body: serializeDocument(model),
      }),
    });
    const data = (await response.json()) as { contractId?: string };
    setSaving(false);
    if (!response.ok || !data.contractId) return;
    router.push(`/dashboard/contracts/${data.contractId}/review`);
  }

  function toggleClause(id: string) {
    setClauses((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  const previewPane = (
    <div className="min-h-[640px] overflow-auto">
      {filled ? (
        <ContractDocumentView model={model} />
      ) : (
        <p className="p-8 text-center font-sans text-[14px] text-ink-muted">{copy.fillToPreview}</p>
      )}
    </div>
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <ContractTypeSelector
          value={templateId}
          language={language}
          help={copy.typeHelp}
          onChange={setTemplateId}
        />
        <div className="flex min-h-[calc(100vh-220px)] flex-col gap-4 lg:flex-row">
          <aside className="w-full rounded-card border border-border bg-page p-6 lg:w-[400px] lg:shrink-0">
            <h1 className="rw-section-title">{copy.details}</h1>
            <section className="mt-6 space-y-4">
              <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
                {copy.parties}
              </p>
              <div>
                <Label htmlFor="companyName">{copy.company}</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyAddress">{copy.companyAddress}</Label>
                <Textarea
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(event) => setCompanyAddress(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyId">{copy.companyId}</Label>
                <Input id="companyId" value={companyId} onChange={(event) => setCompanyId(event.target.value)} />
              </div>
              <FreelancerPicker
                freelancers={freelancers}
                value={freelancerId}
                label={copy.freelancer}
                emptyLabel={copy.noFreelancers}
                inviteLabel={copy.inviteFirst}
                onChange={setFreelancerId}
              />
            </section>
            <section className="mt-6 space-y-4">
              <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
                {copy.settings}
              </p>
              <div>
                <Label htmlFor="language">{copy.language}</Label>
                <select
                  id="language"
                  className="rw-input"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as ContractLanguage)}
                >
                  {CONTRACT_LANGUAGES.map((code) => (
                    <option key={code} value={code}>
                      {LANGUAGE_LABELS[code]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="title">{copy.title}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => {
                    setTitleTouched(true);
                    setTitle(event.target.value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="law">{copy.governingLaw}</Label>
                <select
                  id="law"
                  className="rw-input"
                  value={governingCountry}
                  onChange={(event) => setGoverningCountry(event.target.value)}
                >
                  {GOVERNING_LAW_COUNTRIES.map((row) => (
                    <option key={row.code} value={row.code}>
                      {row.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 font-sans text-[12px] text-ink-muted">{copy.governingLawHelp}</p>
              </div>
              <div>
                <Label htmlFor="effective">{copy.startDate}</Label>
                <label className="mb-2 flex items-center gap-2 font-sans text-[13px] text-ink">
                  <input
                    type="checkbox"
                    checked={useLastSignature}
                    onChange={(event) => setUseLastSignature(event.target.checked)}
                  />
                  {copy.lastSignature}
                </label>
                <Input
                  id="effective"
                  type="date"
                  disabled={useLastSignature}
                  value={startDate}
                  onChange={(event) => {
                    setUseLastSignature(false);
                    setStartDate(event.target.value);
                  }}
                />
                <p className="mt-1 font-sans text-[12px] text-ink-muted">{copy.startDateHelp}</p>
              </div>
              <div>
                <Label htmlFor="expires">{copy.signatureDeadline}</Label>
                <Input id="expires" type="date" value={expires} onChange={(event) => setExpires(event.target.value)} />
                <p className="mt-1 font-sans text-[12px] text-ink-muted">{copy.signatureDeadlineHelp}</p>
              </div>
            </section>
            <section className="mt-6 space-y-4">
              <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
                {copy.variables}
              </p>
              {TEMPLATE_VARIABLES[templateId].map((key) => (
                <div key={key}>
                  <Label htmlFor={key}>{variableLabel(key, language)}</Label>
                  {key === "DELIVERABLES" || key === "SCOPE" ? (
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
            <section className="mt-6 space-y-3">
              <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
                {copy.clauses}
              </p>
              {CLAUSE_IDS.map((id) => {
                const clause = clauseCopy(id, language);
                const on = clauses.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={() => toggleClause(id)}
                    className={`w-full rounded-card border p-4 text-left transition-colors ${
                      on ? "border-primary bg-primary-light" : "border-border bg-card"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-[15px] font-semibold text-ink">{clause.title}</span>
                      <span
                        className={`h-5 w-9 rounded-full ${on ? "bg-primary" : "bg-border"} relative shrink-0`}
                        aria-hidden
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                            on ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                    </span>
                    <span className="mt-1 block font-sans text-[13px] text-ink-secondary">{clause.explanation}</span>
                  </button>
                );
              })}
            </section>
            <div className="sticky bottom-4 mt-8 space-y-2">
              {filled ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    if (desktop) {
                      document.getElementById("contract-preview")?.scrollIntoView({ behavior: "smooth" });
                      return;
                    }
                    setMobilePreview(true);
                  }}
                >
                  {copy.preview}
                </Button>
              ) : null}
              <Button className="w-full" onClick={goToReview} disabled={!freelancerId || saving}>
                {copy.continue}
              </Button>
            </div>
          </aside>
          {desktop ? (
            <section id="contract-preview" className="min-w-0 flex-1 rounded-card border border-border bg-card p-6">
              {previewPane}
            </section>
          ) : null}
        </div>
      </div>
      {mobilePreview ? (
        <Dialog open onOpenChange={setMobilePreview}>
          <DialogContent className="max-h-[90vh] max-w-[720px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{copy.preview}</DialogTitle>
            </DialogHeader>
            {previewPane}
            <Button variant="secondary" className="mt-4 w-full" onClick={() => setMobilePreview(false)}>
              {copy.closePreview}
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </PageTransition>
  );
}
