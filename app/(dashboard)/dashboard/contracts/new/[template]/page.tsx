import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/contract-templates";
import { ContractBuilder } from "@/components/contracts/contract-builder";

export default function ContractBuilderPage({
  params,
}: {
  params: { template: string };
}) {
  const template = getTemplate(params.template);
  if (!template) notFound();
  return <ContractBuilder template={template} />;
}
