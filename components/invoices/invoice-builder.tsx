"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoneyCircle } from "@/components/motion/money-circle";
import {
  DEFAULT_PRICING_CURRENCY,
  PRICING_CURRENCIES,
  calculateFreelancerPayout,
  formatPricingMoney,
  type PricingCurrency,
} from "@/lib/pricing";
import type { FreelancerBillingProfile, InvoiceLine } from "@/lib/invoices";
import { DEFAULT_VAT_RATE, VAT_RATE_LABELS, VAT_RATES, type VatRate } from "@/lib/compliance/vat";

export function InvoiceBuilder({ profile }: { profile: FreelancerBillingProfile }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [currency, setCurrency] = useState<PricingCurrency>(DEFAULT_PRICING_CURRENCY);
  const [clientName, setClientName] = useState(profile.defaultClientName);
  const [clientEmail, setClientEmail] = useState(profile.defaultClientEmail);
  const [clientAddress, setClientAddress] = useState(profile.defaultClientAddress);
  const [taxResidency, setTaxResidency] = useState(profile.taxResidency);
  const [vatId, setVatId] = useState(profile.vatId);
  const [addressLine1, setAddressLine1] = useState(profile.addressLine1);
  const [addressCity, setAddressCity] = useState(profile.addressCity);
  const [addressPostalCode, setAddressPostalCode] = useState(profile.addressPostalCode);
  const [addressCountry, setAddressCountry] = useState(profile.addressCountry || profile.taxResidency);
  const [bankIban, setBankIban] = useState(profile.bankIban);
  const [bankName, setBankName] = useState(profile.bankName);
  const [notes, setNotes] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("14 days net");
  const [vatExempt, setVatExempt] = useState(false);
  const [sellerBusinessId, setSellerBusinessId] = useState(profile.vatId);
  const [buyerBusinessId, setBuyerBusinessId] = useState("");
  const [lines, setLines] = useState<InvoiceLine[]>([
    { description: "", quantity: 1, unitPrice: 0, vatRate: DEFAULT_VAT_RATE },
  ]);

  const amount = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const breakdown = useMemo(
    () => calculateFreelancerPayout(amount, "standard", currency),
    [amount, currency],
  );

  function updateLine(index: number, patch: Partial<InvoiceLine>) {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currency,
        clientName,
        clientEmail,
        clientAddress,
        notes,
        lineItems: lines,
        invoiceDate,
        dueDate,
        paymentTerms,
        vatExempt,
        sellerBusinessId,
        buyerBusinessId,
        saveProfile: true,
        taxResidency,
        vatId,
        addressLine1,
        addressCity,
        addressPostalCode,
        addressCountry,
        bankIban,
        bankName,
      }),
    });
    setSaving(false);
    const json = (await response.json()) as { invoice?: { id: string }; message?: string };
    if (!response.ok) {
      toast.error(json.message || "Could not save invoice");
      return;
    }
    toast.success("Draft saved. Profile reused next time.");
    router.push("/freelancer/invoices");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-6">
        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="rw-section-title">Client</h2>
          <p className="mt-1 font-sans text-small text-ink-muted">Saved on your profile and auto-filled next time.</p>
          <div className="mt-4 grid gap-3">
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client name" required />
            <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Client email" />
            <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Client address" required />
            <Input value={buyerBusinessId} onChange={(e) => setBuyerBusinessId(e.target.value)} placeholder="Buyer Y-tunnus / VAT ID" />
          </div>
        </section>

        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="rw-section-title">Finnish invoice fields</h2>
          <p className="mt-1 font-sans text-small text-ink-muted">
            Accounting Act: invoice date, due date, seller/buyer IDs, VAT breakdown, payment terms.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="font-sans text-small text-ink-secondary">
              Invoice date
              <Input className="mt-1" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} required />
            </label>
            <label className="font-sans text-small text-ink-secondary">
              Due date
              <Input className="mt-1" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </label>
            <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Payment terms" required />
            <Input value={sellerBusinessId} onChange={(e) => setSellerBusinessId(e.target.value)} placeholder="Seller Y-tunnus (optional for light entrepreneurs)" />
            <label className="flex items-center gap-2 font-sans text-[14px] text-ink sm:col-span-2">
              <input type="checkbox" checked={vatExempt} onChange={(e) => setVatExempt(e.target.checked)} />
              VAT-exempt supply
            </label>
          </div>
        </section>

        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="rw-section-title">Your billing details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input value={taxResidency} onChange={(e) => setTaxResidency(e.target.value)} placeholder="Tax residency" />
            <Input value={vatId} onChange={(e) => setVatId(e.target.value)} placeholder="VAT ID" />
            <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Your address" />
            <Input value={addressCity} onChange={(e) => setAddressCity(e.target.value)} placeholder="City" />
            <Input value={addressPostalCode} onChange={(e) => setAddressPostalCode(e.target.value)} placeholder="Postal code" />
            <Input value={addressCountry} onChange={(e) => setAddressCountry(e.target.value)} placeholder="Country" />
            <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name" />
            <Input value={bankIban} onChange={(e) => setBankIban(e.target.value)} placeholder="IBAN" />
          </div>
        </section>

        <section className="rounded-card border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="rw-section-title">Line items</h2>
            <select
              className="rw-input w-[120px]"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as PricingCurrency)}
              aria-label="Currency"
            >
              {PRICING_CURRENCIES.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 space-y-3">
            {lines.map((line, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[1fr_80px_100px_140px]">
                <Input
                  value={line.description}
                  onChange={(e) => updateLine(index, { description: e.target.value })}
                  placeholder="Description"
                  required
                />
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                  aria-label="Quantity"
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={line.unitPrice || ""}
                  onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) })}
                  placeholder="Net price"
                />
                <select
                  className="rw-input"
                  value={line.vatRate}
                  onChange={(e) => updateLine(index, { vatRate: Number(e.target.value) as VatRate })}
                  aria-label="VAT rate"
                  disabled={vatExempt}
                >
                  {VAT_RATES.map((rate) => (
                    <option key={rate} value={rate}>
                      {VAT_RATE_LABELS[rate]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                setLines((current) => [
                  ...current,
                  { description: "", quantity: 1, unitPrice: 0, vatRate: DEFAULT_VAT_RATE },
                ])
              }
            >
              Add line
            </Button>
          </div>
        </section>
        <Button type="submit" loading={saving}>
          Save draft
        </Button>
      </div>

      <aside className="rounded-card border border-border bg-card p-5 lg:sticky lg:top-20 h-fit">
        <MoneyCircle
          keep={breakdown.youKeep}
          fees={breakdown.totalFees}
          label="You receive"
          formattedKeep={formatPricingMoney(breakdown.youKeep, currency)}
          size={150}
        />
        <p className="mt-3 text-center font-sans text-small text-ink-secondary">
          Invoice {formatPricingMoney(breakdown.amount, currency)}
        </p>
      </aside>
    </form>
  );
}
