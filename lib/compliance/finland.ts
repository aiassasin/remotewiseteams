export const FINLAND_COMPLIANCE = {
  operatorName: "RemoteWise Teams",
  legalEntityName: "RemoteWise Oy (in formation)",
  country: "Finland",
  governingLaw: "the laws of Finland",
  supervisoryAuthority: "Office of the Data Protection Ombudsman (Tietosuojavaltuutettu)",
  supervisoryUrl: "https://tietosuoja.fi",
  consumerDisputes: "Consumer Disputes Board (Kuluttajariitalautakunta)",
  consumerDisputesUrl: "https://www.kuluttajariita.fi",
  euOdr: "https://ec.europa.eu/consumers/odr",
  vatNote:
    "RemoteWise invoices as the billing entity. Light entrepreneurs are not required to hold a Finnish Y-tunnus to start. VAT is applied only when a VAT ID is on file and the supply is taxable.",
  taxWithholding:
    "Phase 2 does not withhold income tax. The freelancer reports payouts as income in their tax residency.",
  lightEntrepreneur: true,
  yTunnusRequiredToStart: false,
  dataRetentionMonths: 72,
  supportSlaHours: 24,
  supportLanguages: ["fi", "en"] as const,
  cookiePolicyVersion: "2026-09-01",
} as const;

export type FinlandCompliance = typeof FINLAND_COMPLIANCE;
