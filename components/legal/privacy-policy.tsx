"use client";

import { LegalH2, LegalShell } from "@/components/legal/legal-shell";
import { useT } from "@/components/i18n/language-provider";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";

function vars() {
  return {
    operator: FINLAND_COMPLIANCE.operatorName,
    entity: FINLAND_COMPLIANCE.legalEntityName,
    country: FINLAND_COMPLIANCE.country,
    authority: FINLAND_COMPLIANCE.supervisoryAuthority,
    url: FINLAND_COMPLIANCE.supervisoryUrl,
    months: FINLAND_COMPLIANCE.dataRetentionMonths,
    version: FINLAND_COMPLIANCE.cookiePolicyVersion,
  };
}

export function PrivacyPolicy() {
  const t = useT();
  const v = vars();
  return (
    <LegalShell title={t("legal.privacyTitle")}>
      <p>{t("legal.privacyIntro", v)}</p>
      <LegalH2>{t("legal.privacyH1")}</LegalH2>
      <p>{t("legal.privacyP1", v)}</p>
      <LegalH2>{t("legal.privacyH2")}</LegalH2>
      <ul className="list-disc space-y-2 pl-5">
        <li>{t("legal.privacyL1")}</li>
        <li>{t("legal.privacyL2")}</li>
        <li>{t("legal.privacyL3")}</li>
        <li>{t("legal.privacyL4")}</li>
        <li>{t("legal.privacyL5")}</li>
        <li>{t("legal.privacyL6")}</li>
      </ul>
      <LegalH2>{t("legal.privacyH3")}</LegalH2>
      <p>{t("legal.privacyP3")}</p>
      <LegalH2>{t("legal.privacyH4")}</LegalH2>
      <p>{t("legal.privacyP4")}</p>
      <LegalH2>{t("legal.privacyH5")}</LegalH2>
      <p>{t("legal.privacyP5")}</p>
      <LegalH2>{t("legal.privacyH6")}</LegalH2>
      <p>{t("legal.privacyP6", v)}</p>
      <LegalH2>{t("legal.privacyH7")}</LegalH2>
      <p>{t("legal.privacyP7", v)}</p>
      <LegalH2>{t("legal.privacyH8")}</LegalH2>
      <p>{t("legal.privacyP8", { ...v, accept: t("cookies.acceptAll") })}</p>
      <LegalH2>{t("legal.privacyH9")}</LegalH2>
      <p>{t("legal.privacyP9")}</p>
    </LegalShell>
  );
}
