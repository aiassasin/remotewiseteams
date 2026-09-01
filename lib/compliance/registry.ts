import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";

export type CountryTaxModule = {
  code: string;
  name: string;
  reportingLabel: string;
  notes: string;
  ready: boolean;
};

/** One module file per country. Finland is live; others are architecture stubs. */
export const COUNTRY_TAX_MODULES: CountryTaxModule[] = [
  {
    code: "FI",
    name: "Finland",
    reportingLabel: "Tulorekisteri (income register) export",
    notes: FINLAND_COMPLIANCE.taxWithholding,
    ready: true,
  },
  {
    code: "US",
    name: "United States",
    reportingLabel: "1099-NEC year-end file",
    notes: "Queued. Same payout ledger, different report formatter.",
    ready: false,
  },
  {
    code: "GB",
    name: "United Kingdom",
    reportingLabel: "Self Assessment export",
    notes: "Queued. Same payout ledger, different report formatter.",
    ready: false,
  },
  {
    code: "EE",
    name: "Estonia",
    reportingLabel: "EMTA income report",
    notes: "Queued. Same payout ledger, different report formatter.",
    ready: false,
  },
  {
    code: "IN",
    name: "India",
    reportingLabel: "TDS worksheet",
    notes: "Queued. Same payout ledger, different report formatter.",
    ready: false,
  },
  {
    code: "PH",
    name: "Philippines",
    reportingLabel: "BIR 2307 worksheet",
    notes: "Queued. Same payout ledger, different report formatter.",
    ready: false,
  },
];

export function taxModuleFor(code: string) {
  return COUNTRY_TAX_MODULES.find((row) => row.code === code) ?? COUNTRY_TAX_MODULES[0];
}

export { buildTulorekisteriRow, tulorekisteriCsv } from "@/lib/compliance/tulorekisteri";
