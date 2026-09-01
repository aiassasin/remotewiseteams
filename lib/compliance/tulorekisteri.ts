import { FINLAND_COMPLIANCE } from "@/lib/compliance/finland";

/** One reporting module per country. Finland: Tulorekisteri-ready payout rows. */
export type TulorekisteriIncomeType = "320" | "321";

export type TulorekisteriRow = {
  country: "FI";
  incomeType: TulorekisteriIncomeType;
  payerName: string;
  payeeName: string;
  payeeBusinessId: string | null;
  paymentDate: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  notes: string;
};

export function buildTulorekisteriRow(input: {
  payeeName: string;
  payeeBusinessId?: string | null;
  paymentDate: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
}): TulorekisteriRow {
  return {
    country: "FI",
    incomeType: input.payeeBusinessId ? "321" : "320",
    payerName: FINLAND_COMPLIANCE.legalEntityName,
    payeeName: input.payeeName,
    payeeBusinessId: input.payeeBusinessId || null,
    paymentDate: input.paymentDate,
    amount: input.amount,
    currency: input.currency,
    invoiceNumber: input.invoiceNumber,
    notes: FINLAND_COMPLIANCE.taxWithholding,
  };
}

export function tulorekisteriCsv(rows: TulorekisteriRow[]) {
  const header = [
    "country",
    "incomeType",
    "payerName",
    "payeeName",
    "payeeBusinessId",
    "paymentDate",
    "amount",
    "currency",
    "invoiceNumber",
  ];
  const lines = rows.map((row) =>
    [
      row.country,
      row.incomeType,
      row.payerName,
      row.payeeName,
      row.payeeBusinessId ?? "",
      row.paymentDate,
      row.amount.toFixed(2),
      row.currency,
      row.invoiceNumber,
    ].join(";"),
  );
  return [header.join(";"), ...lines].join("\n");
}
