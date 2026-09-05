"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { StoredContractBody } from "@/components/contracts/stored-contract-body";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT, useFormat } from "@/components/i18n/language-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

type SignPayload = {
  valid: boolean;
  contractHtml?: string;
  companyName?: string;
  freelancerName?: string;
  freelancerEmail?: string;
  title?: string;
  type?: string;
  expiresAt?: string;
  sentAt?: string | null;
  status?: string;
};

export function SignContractClient({ token }: { token: string }) {
  const t = useT();
  const format = useFormat();
  const [data, setData] = useState<SignPayload | null>(null);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sign/${token}/validate`)
      .then((res) => res.json())
      .then(setData);
  }, [token]);

  async function sign() {
    const response = await fetch(`/api/sign/${token}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signerName: name,
        ipAddress: undefined,
        userAgent: navigator.userAgent,
      }),
    });
    const json = (await response.json()) as { success?: boolean; downloadUrl?: string };
    if (json.success) {
      setDownloadUrl(json.downloadUrl ?? null);
      setDone(true);
    }
  }

  if (!data) return null;
  if (!data.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p className="font-sans text-body text-danger">{t("sign.invalid")}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-success-light px-4">
        <div className="max-w-lg text-center">
          <motion.div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-success"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6 }}
          >
            <Check className="h-12 w-12" />
          </motion.div>
          <h1 className="mt-6 font-display text-[28px] font-semibold text-ink">
            {t("sign.successTitle")}
          </h1>
          <p className="mt-3 font-sans text-body text-ink-secondary">
            {t("sign.successBody", { email: data.freelancerEmail ?? "" })}
          </p>
          {downloadUrl ? (
            <a href={downloadUrl} download="signed-contract.pdf">
              <Button className="mt-6">{t("sign.downloadPdf")}</Button>
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  const canSign = name.trim().length > 1 && agreed;

  return (
    <div className="min-h-screen bg-page">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-white px-6 py-3">
        <span className="font-display text-[16px] font-semibold text-ink">RemoteWise</span>
        <span className="flex items-center gap-1 font-sans text-small text-ink-secondary">
          <Lock className="h-3.5 w-3.5" /> {t("sign.secure")}
        </span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a href="mailto:support@remotewise.dev" className="font-sans text-[14px] text-primary">
            {t("sign.help")}
          </a>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1200px] flex-col lg:flex-row">
        <aside className="w-full border-b border-border bg-page p-6 lg:w-[280px] lg:border-b-0 lg:border-r">
          <p className="font-sans text-small text-ink-muted">{t("sign.sentBy")}</p>
          <p className="mt-1 font-display text-card text-ink">{data.companyName}</p>
          <p className="mt-4 font-sans text-small text-ink-secondary">{t("sign.type", { type: data.type ?? "" })}</p>
          <p className="font-sans text-small text-ink-secondary">
            {t("sign.expires", { date: format.date(data.expiresAt) })}
          </p>
          <div className="mt-6 rounded-card border border-border bg-white p-4">
            <p className="font-sans text-[13px] font-medium text-ink">{t("sign.secured")}</p>
            <ul className="mt-2 space-y-1 font-sans text-small text-ink-secondary">
              <li>✓ {t("sign.ssl")}</li>
              <li>✓ {t("sign.audit")}</li>
              <li>✓ {t("sign.ipLogged")}</li>
              <li>✓ {t("sign.legallyBinding")}</li>
            </ul>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-6">
          <article className="rounded-card border border-border bg-card p-4">
            <StoredContractBody body={data.contractHtml ?? ""} title={data.title} />
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="border-s-[3px] border-success bg-success-light p-4">
                <p className="font-sans text-small uppercase text-ink-muted">{data.companyName}</p>
                <p className="mt-2 font-[cursive] text-[24px] text-ink">{data.companyName}</p>
                <p className="font-sans text-small text-ink-secondary">{t("sign.alreadySigned")}</p>
              </div>
              <div className="border border-border p-4">
                <p className="font-sans text-small uppercase text-ink-muted">{t("sign.yourSignature")}</p>
                <Input
                  className="mt-3"
                  placeholder={t("sign.placeholder")}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <p className="mt-2 font-[cursive] text-[28px] text-ink">{name || " "}</p>
                <label className="mt-3 flex items-start gap-2 font-sans text-[13px] text-ink">
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                  {t("sign.agree")}
                </label>
                <Button className="mt-4 w-full" disabled={!canSign} onClick={sign}>
                  {t("sign.cta")}
                </Button>
                <p className="mt-3 font-sans text-small text-ink-muted">
                  {t("sign.eSignNote")}
                </p>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
