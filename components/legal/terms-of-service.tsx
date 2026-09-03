"use client";

import { LegalH2, LegalShell } from "@/components/legal/legal-shell";
import { useT } from "@/components/i18n/language-provider";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";
import { PLATFORM_TAKE_PERCENT } from "@/lib/pricing";

export function TermsOfService() {
  const t = useT();
  const v = {
    entity: FINLAND_COMPLIANCE.legalEntityName,
    law: t("legal.lawFinland"),
    take: PLATFORM_TAKE_PERCENT,
    tax: FINLAND_COMPLIANCE.taxWithholding,
    disputes: FINLAND_COMPLIANCE.consumerDisputes,
    odr: FINLAND_COMPLIANCE.euOdr,
    hours: FINLAND_COMPLIANCE.supportSlaHours,
  };
  return (
    <LegalShell title={t("legal.termsTitle")}>
      <p>{t("legal.termsIntro", v)}</p>
      <LegalH2>{t("legal.termsH1")}</LegalH2>
      <p>{t("legal.termsP1", v)}</p>
      <LegalH2>{t("legal.termsH2")}</LegalH2>
      <p>{t("legal.termsP2", v)}</p>
      <LegalH2>{t("legal.termsH3")}</LegalH2>
      <ul className="list-disc space-y-2 pl-5">
        <li>{t("legal.termsF1")}</li>
        <li>{t("legal.termsF2")}</li>
        <li>{t("legal.termsF3")}</li>
        <li>{t("legal.termsF4")}</li>
        <li>{t("legal.termsF5")}</li>
      </ul>
      <LegalH2>{t("legal.termsH4")}</LegalH2>
      <ul className="list-disc space-y-2 pl-5">
        <li>{t("legal.termsC1")}</li>
        <li>{t("legal.termsC2")}</li>
        <li>{t("legal.termsC3")}</li>
        <li>{t("legal.termsC4")}</li>
      </ul>
      <LegalH2>{t("legal.termsH5")}</LegalH2>
      <p>{t("legal.termsP5")}</p>
      <LegalH2>{t("legal.termsH6")}</LegalH2>
      <p>{t("legal.termsP6")}</p>
      <LegalH2>{t("legal.termsH7")}</LegalH2>
      <p>{t("legal.termsP7", v)}</p>
      <LegalH2>{t("legal.termsH8")}</LegalH2>
      <p>{t("legal.termsP8")}</p>
      <LegalH2>{t("legal.termsH9")}</LegalH2>
      <p>{t("legal.termsP9", v)}</p>
    </LegalShell>
  );
}
