import { governingCountryName } from "@/lib/contracts/countries";
import {
  CLAUSE_IDS,
  clauseCopy,
  uiCopy,
  type ClauseId,
  type ContractLanguage,
  type TemplateId,
} from "@/lib/contracts/i18n";
import { templateDisplayName, templateSections, type ContractSection } from "@/lib/contracts/templates";

export type ContractDocumentModel = {
  v: 1;
  title: string;
  language: ContractLanguage;
  companyName: string;
  freelancerName: string;
  startDateLabel: string;
  governingLaw: string;
  sections: ContractSection[];
  disclaimer: string;
};

export function serializeDocument(model: ContractDocumentModel) {
  return JSON.stringify(model);
}

export function parseStoredDocument(raw: string): ContractDocumentModel | null {
  try {
    const data = JSON.parse(raw) as Partial<ContractDocumentModel>;
    if (data?.v === 1 && typeof data.title === "string" && Array.isArray(data.sections)) {
      return data as ContractDocumentModel;
    }
  } catch {
    return null;
  }
  return null;
}

export function composeCompanyIdLine(companyId: string) {
  const trimmed = companyId.trim();
  return trimmed ? `, business ID ${trimmed}` : "";
}

export function composeAddress(parts: {
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
}) {
  const street = [parts.line1, parts.line2, [parts.postalCode, parts.city].filter(Boolean).join(" ")]
    .map((part) => part.trim())
    .filter(Boolean);
  if (!street.length) return "";
  const country = parts.country.trim();
  return [...street, country].filter(Boolean).join(", ");
}

export function buildContractDocument(input: {
  templateId: TemplateId;
  language: ContractLanguage;
  title: string;
  companyName: string;
  companyAddress: string;
  companyId: string;
  freelancerName: string;
  startDate: string;
  useLastSignature: boolean;
  lastSignatureLabel: string;
  governingCountryCode: string;
  variables: Record<string, string>;
  clauses: string[];
}): ContractDocumentModel {
  const copy = uiCopy(input.language);
  const law = governingCountryName(input.governingCountryCode);
  const start = input.useLastSignature || !input.startDate.trim() ? input.lastSignatureLabel : input.startDate;
  const vars: Record<string, string> = {
    ...input.variables,
    COMPANY_NAME: input.companyName.trim() || "[COMPANY_NAME]",
    COMPANY_ADDRESS: input.companyAddress.trim() || "[COMPANY_ADDRESS]",
    COMPANY_ID_LINE: composeCompanyIdLine(input.companyId),
    FREELANCER_NAME: input.freelancerName.trim() || "[FREELANCER_NAME]",
    START_DATE: start,
    GOVERNING_LAW: law,
    DURATION: input.variables.DURATION || "2 years",
    PAYMENT_TERMS: input.variables.PAYMENT_TERMS || "Net 14",
    NOTICE_PERIOD: input.variables.NOTICE_PERIOD || "30 days",
    PROJECT_NAME: input.variables.PROJECT_NAME || "[PROJECT_NAME]",
    DELIVERABLES: input.variables.DELIVERABLES || "[DELIVERABLES]",
    TIMELINE: input.variables.TIMELINE || "[TIMELINE]",
    AMOUNT: input.variables.AMOUNT || "[AMOUNT]",
    RATE: input.variables.RATE || "[RATE]",
    SCOPE: input.variables.SCOPE || "[SCOPE]",
  };

  const sections = templateSections(input.templateId, input.language, vars);
  const extra: ContractSection[] = [];
  for (const id of CLAUSE_IDS) {
    if (!input.clauses.includes(id)) continue;
    const clause = clauseCopy(id, input.language);
    extra.push({ heading: clause.title, summary: clause.explanation, body: clause.clause });
  }

  return {
    v: 1,
    title: input.title.trim() || templateDisplayName(input.templateId, input.language),
    language: input.language,
    companyName: input.companyName.trim() || "[COMPANY_NAME]",
    freelancerName: input.freelancerName.trim() || "[FREELANCER_NAME]",
    startDateLabel: start,
    governingLaw: law,
    sections: [...sections, ...extra],
    disclaimer: copy.disclaimer,
  };
}

export function documentToPlainText(model: ContractDocumentModel) {
  const blocks = [
    model.title,
    `Start date: ${model.startDateLabel}`,
    `Governing law: ${model.governingLaw}`,
    ...model.sections.flatMap((section, index) => [
      `${index + 1}. ${section.heading}`,
      section.summary,
      section.body,
    ]),
    model.disclaimer,
  ];
  return blocks.join("\n\n");
}

export function isClauseId(value: string): value is ClauseId {
  return (CLAUSE_IDS as readonly string[]).includes(value);
}
