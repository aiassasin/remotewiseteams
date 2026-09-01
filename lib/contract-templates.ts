import { TEMPLATE_IDS, typeCopy, type TemplateId } from "@/lib/contracts/i18n";
import { TEMPLATE_VARIABLES } from "@/lib/contracts/templates";

export type ContractTemplate = {
  id: TemplateId;
  name: string;
  type: "NDA" | "MSA" | "SOW" | "ICA" | "Custom";
  description: string;
  included: string[];
  readTime: string;
  body: string;
  variables: string[];
};

const TYPE_MAP: Record<TemplateId, ContractTemplate["type"]> = {
  nda: "NDA",
  msa: "MSA",
  sow: "SOW",
  ica: "ICA",
  blank: "Custom",
};

export function getTemplate(id: string): ContractTemplate | null {
  if (!(TEMPLATE_IDS as readonly string[]).includes(id)) return null;
  const templateId = id as TemplateId;
  const meta = typeCopy(templateId, "en");
  return {
    id: templateId,
    name: meta.name,
    type: TYPE_MAP[templateId],
    description: meta.oneLiner,
    included: [],
    readTime: "",
    body: "",
    variables: TEMPLATE_VARIABLES[templateId],
  };
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = TEMPLATE_IDS.filter((id) => id !== "blank").map(
  (id) => getTemplate(id) as ContractTemplate,
);

export function fillTemplate(body: string, variables: Record<string, string>) {
  return body.replace(/\[([A-Z_]+)\]/g, (match, key: string) => variables[key] || match);
}
