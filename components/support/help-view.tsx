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

const FAQ = [
  { q: "Do I need a company?", a: "No. Light entrepreneur mode lets you invoice as yourself." },
  { q: "When do I get paid?", a: "24 hours after the client pays, free. Lightning Pay is optional." },
  { q: "Can I cancel an invoice?", a: "Yes, while it is draft or sent. The company is notified." },
];

export function HelpView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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
      toast.error(json.message || "Could not send");
      return;
    }
    setMessage("");
    toast.success("Sent. We reply within 24h.");
  }

  return (
    <PageTransition>
      <PageHeader
        title="Help & support"
        description="Finnish and English. A person replies within a working day."
      />
      <div className="mb-6 inline-flex items-center gap-2 rounded-pill bg-success-light px-3 py-1 font-sans text-small font-medium text-success-text">
        <IsoIcon name="support" size={22} />
        We reply within {FINLAND_COMPLIANCE.supportSlaHours}h
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-card border border-border bg-card p-6">
          <h2 className="rw-section-title">FAQ</h2>
          <ul className="mt-4 space-y-3">
            {FAQ.map((item) => (
              <li key={item.q}>
                <p className="font-sans text-[14px] font-medium text-ink">{item.q}</p>
                <p className="font-sans text-[13px] text-ink-secondary">{item.a}</p>
              </li>
            ))}
          </ul>
          <Link href="/pricing" className="mt-4 inline-block font-sans text-[14px] font-medium text-primary">
            Full pricing FAQ
          </Link>
        </section>
        <form onSubmit={onSubmit} className="space-y-3 rounded-card border border-border bg-card p-6">
          <h2 className="rw-section-title">Contact</h2>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <textarea
            className="rw-input min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
            required
          />
          <Button type="submit" loading={sending}>
            Send
          </Button>
        </form>
      </div>
    </PageTransition>
  );
}
