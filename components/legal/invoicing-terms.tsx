"use client";

import { LegalH2, LegalShell } from "@/components/legal/legal-shell";
import { useT } from "@/components/i18n/language-provider";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";
import { PLATFORM_TAKE_PERCENT } from "@/lib/pricing";

export function InvoicingTerms() {
  const t = useT();
  const v = { vat: FINLAND_COMPLIANCE.vatNote, take: PLATFORM_TAKE_PERCENT };
  return (
    <LegalShell title={t("legal.invoicingTitle")}>
      <p>{t("legal.invIntro", v)}</p>
      <LegalH2>{t("legal.invH1")}</LegalH2>
      <p>{t("legal.invP1", v)}</p>
      <LegalH2>{t("legal.invH2")}</LegalH2>
      <p>{t("legal.invP2")}</p>
      <LegalH2>{t("legal.invH3")}</LegalH2>
      <p>{t("legal.invP3")}</p>
      <LegalH2>{t("legal.invH4")}</LegalH2>
      <p>{t("legal.invP4")}</p>
      <LegalH2>{t("legal.invH5")}</LegalH2>
      <p>{t("legal.invP5")}</p>
      <LegalH2>{t("legal.invH6")}</LegalH2>
      <p>{t("legal.invP6")}</p>
      <LegalH2>{t("legal.invH7")}</LegalH2>
      <p>{t("legal.invP7")}</p>
      <LegalH2>{t("legal.invH8")}</LegalH2>
      <p>{t("legal.invP8")}</p>
    </LegalShell>
  );
}
