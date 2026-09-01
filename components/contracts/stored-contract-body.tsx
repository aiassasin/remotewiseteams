import { ContractDocumentView } from "@/components/contracts/contract-document-view";
import { parseStoredDocument } from "@/lib/contracts/document";

export function StoredContractBody({ body, title }: { body: string; title?: string }) {
  const model = parseStoredDocument(body);
  if (model) return <ContractDocumentView model={model} />;
  return (
    <article className="border border-border bg-white p-10 text-slate-900 dark:bg-[#111A2E] dark:text-slate-100">
      {title ? <h2 className="font-display text-[22px] font-semibold">{title}</h2> : null}
      <pre className="mt-6 whitespace-pre-wrap font-[Georgia] text-[14px] leading-[1.8]">{body}</pre>
    </article>
  );
}
