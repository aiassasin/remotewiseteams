"use client";

import { LegalH2, LegalShell } from "@/components/legal/legal-shell";
import { useT } from "@/components/i18n/language-provider";
import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";

export function CookiePolicy() {
  const t = useT();
  const v = {
    version: FINLAND_COMPLIANCE.cookiePolicyVersion,
    authority: FINLAND_COMPLIANCE.supervisoryAuthority,
    accept: t("cookies.acceptAll"),
    necessary: t("cookies.necessary"),
  };
  return (
    <LegalShell title={t("legal.cookiesTitle")}>
      <p>{t("legal.cookIntro", v)}</p>
      <LegalH2>{t("legal.cookH1")}</LegalH2>
      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-border bg-page">
              <th className="px-3 py-2 text-ink">{t("legal.colName")}</th>
              <th className="px-3 py-2 text-ink">{t("legal.colPurpose")}</th>
              <th className="px-3 py-2 text-ink">{t("legal.colType")}</th>
              <th className="px-3 py-2 text-ink">{t("legal.colDuration")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-3 py-2">sb-*-auth-token</td>
              <td className="px-3 py-2">{t("legal.cookAuthPurpose")}</td>
              <td className="px-3 py-2">{t("legal.cookAuthType")}</td>
              <td className="px-3 py-2">{t("legal.cookAuthDur")}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">rw_cookie_consent</td>
              <td className="px-3 py-2">{t("legal.cookConsentPurpose")}</td>
              <td className="px-3 py-2">{t("legal.cookAuthType")}</td>
              <td className="px-3 py-2">{t("legal.cookConsentDur")}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">rw-theme</td>
              <td className="px-3 py-2">{t("legal.cookThemePurpose")}</td>
              <td className="px-3 py-2">{t("legal.cookThemeType")}</td>
              <td className="px-3 py-2">{t("legal.cookThemeDur")}</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-3 py-2">rw-language</td>
              <td className="px-3 py-2">{t("common.language")}</td>
              <td className="px-3 py-2">{t("legal.cookThemeType")}</td>
              <td className="px-3 py-2">{t("legal.cookThemeDur")}</td>
            </tr>
            <tr>
              <td className="px-3 py-2">{t("legal.cookAnalyticsName")}</td>
              <td className="px-3 py-2">{t("legal.cookAnalyticsPurpose")}</td>
              <td className="px-3 py-2">{t("legal.cookAnalyticsType")}</td>
              <td className="px-3 py-2">{t("legal.cookAnalyticsDur")}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <LegalH2>{t("legal.cookH2")}</LegalH2>
      <p>{t("legal.cookP2", v)}</p>
      <LegalH2>{t("legal.cookH3")}</LegalH2>
      <p>{t("legal.cookP3")}</p>
      <LegalH2>{t("legal.cookH4")}</LegalH2>
      <p>{t("legal.cookP4", v)}</p>
    </LegalShell>
  );
}
