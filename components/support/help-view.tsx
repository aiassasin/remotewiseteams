"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IsoIcon } from "@/components/icons/iso-icon";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";
import { useT } from "@/components/i18n/language-provider";

export function HelpView() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const faq = [
    { q: t("help.faqCompanyQ"), a: t("help.faqCompanyA") },
    { q: t("help.faqPaidQ"), a: t("help.faqPaidA") },
    { q: t("help.faqCancelQ"), a: t("help.faqCancelA") },
  ];

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, topic: "general", message }),
    });
    setSending(false);
    const json = (await response.json()) as { message?: string };
    if (!response.ok) {
      toast.error(json.message || t("help.sendFailed"));
      return;
    }
    setMessage("");
    toast.success(t("help.sent"));
  }

  return (
    <PageTransition>
      <PageHeader title={t("help.title")} description={t("help.description")} />
      <div className="mb-6 inline-flex items-center gap-2 rounded-pill bg-success-light px-3 py-1 font-sans text-small font-medium text-success-text">
        <IsoIcon name="support" size={22} />
        {t("help.replyWithin", { hours: FINLAND_COMPLIANCE.supportSlaHours })}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="rw-section-title">{t("help.faq")}</h2>
          <ul className="mt-4 space-y-3">
            {faq.map((item) => (
              <li key={item.q}>
                <p className="font-sans text-[14px] font-medium text-ink">{item.q}</p>
                <p className="font-sans text-[13px] text-ink-secondary">{item.a}</p>
              </li>
            ))}
          </ul>
          <Link href="/pricing" className="mt-4 inline-block font-sans text-[14px] font-medium text-primary">
            {t("help.pricingFaq")}
          </Link>
        </section>
        <form onSubmit={onSubmit} className="space-y-3 rounded-card border border-border bg-card p-6">
          <h2 className="rw-section-title">{t("help.contact")}</h2>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("common.name")} required />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("common.email")}
            required
          />
          <textarea
            className="rw-input min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("help.howCanWeHelp")}
            required
          />
          <Button type="submit" loading={sending}>
            {t("common.send")}
          </Button>
        </form>
      </div>
    </PageTransition>
  );
}
