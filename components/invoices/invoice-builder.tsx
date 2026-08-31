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
  const [lines, setLines] = useState<InvoiceLine[]>([{ description: "", quantity: 1, unitPrice: 0 }]);

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
            <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Client address" />
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
              <div key={index} className="grid gap-2 sm:grid-cols-[1fr_80px_100px]">
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
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={line.unitPrice || ""}
                  onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) })}
                  placeholder="Price"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setLines((current) => [...current, { description: "", quantity: 1, unitPrice: 0 }])}
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
