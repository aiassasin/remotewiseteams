import type { Metadata } from "next";
import { ContractTemplatePicker } from "@/components/contracts/template-picker";

export const metadata: Metadata = { title: "New contract" };

export default function NewContractPage() {
  return <ContractTemplatePicker />;
}
