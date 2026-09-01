"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { StoredContractBody } from "@/components/contracts/stored-contract-body";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        <p className="font-sans text-body text-danger">This signing link is invalid or expired.</p>
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
            Contract signed successfully
          </h1>
          <p className="mt-3 font-sans text-body text-ink-secondary">
            A copy of the signed contract has been sent to {data.freelancerEmail}
          </p>
          {downloadUrl ? (
            <a href={downloadUrl} download="signed-contract.pdf">
              <Button className="mt-6">Download signed PDF</Button>
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  const canSign = name.trim().length > 1 && agreed;

  return (
    <div className="min-h-screen bg-page">
      <header className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <span className="font-display text-[16px] font-semibold text-ink">RemoteWise</span>
        <span className="flex items-center gap-1 font-sans text-small text-ink-secondary">
          <Lock className="h-3.5 w-3.5" /> Secure document signing
        </span>
        <a href="mailto:support@remotewise.dev" className="font-sans text-[14px] text-primary">
          Help
        </a>
      </header>
      <div className="mx-auto flex max-w-[1200px] flex-col lg:flex-row">
        <aside className="w-full border-b border-border bg-page p-6 lg:w-[280px] lg:border-b-0 lg:border-r">
          <p className="font-sans text-small text-ink-muted">Sent by</p>
          <p className="mt-1 font-display text-card text-ink">{data.companyName}</p>
          <p className="mt-4 font-sans text-small text-ink-secondary">Type: {data.type}</p>
          <p className="font-sans text-small text-ink-secondary">
            Expires: {data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : "—"}
          </p>
          <div className="mt-6 rounded-card border border-border bg-white p-4">
            <p className="font-sans text-[13px] font-medium text-ink">This document is secured by RemoteWise</p>
            <ul className="mt-2 space-y-1 font-sans text-small text-ink-secondary">
              <li>✓ 256-bit SSL encryption</li>
              <li>✓ Timestamped audit trail</li>
              <li>✓ IP address logged</li>
              <li>✓ Legally binding under ESIGN Act & eIDAS</li>
            </ul>
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-6">
          <article className="rounded-card border border-border bg-card p-4">
            <StoredContractBody body={data.contractHtml ?? ""} title={data.title} />
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="border-l-[3px] border-success bg-success-light p-4">
                <p className="font-sans text-small uppercase text-ink-muted">{data.companyName}</p>
                <p className="mt-2 font-[cursive] text-[24px] text-ink">{data.companyName}</p>
                <p className="font-sans text-small text-ink-secondary">Already signed</p>
              </div>
              <div className="border border-border p-4">
                <p className="font-sans text-small uppercase text-ink-muted">Your signature</p>
                <Input
                  className="mt-3"
                  placeholder="Type your full legal name to sign"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <p className="mt-2 font-[cursive] text-[28px] text-ink">{name || " "}</p>
                <label className="mt-3 flex items-start gap-2 font-sans text-[13px] text-ink">
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                  I have read and agree to this contract
                </label>
                <Button className="mt-4 w-full" disabled={!canSign} onClick={sign}>
                  Sign contract
                </Button>
                <p className="mt-3 font-sans text-small text-ink-muted">
                  By signing, you agree this electronic signature is legally binding under the US ESIGN Act and EU eIDAS Regulation.
                </p>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
