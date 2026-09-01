"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Check, Clock, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/motion/page-transition";

export function ProfileOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Ahmed Hassan");
  const [title, setTitle] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  function onPhoto(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function connectBank() {
    setConnecting(true);
    const response = await fetch("/api/stripe/connect", { method: "POST" });
    const data = (await response.json()) as { url?: string; mocked?: boolean };
    if (data.url && !data.mocked) {
      window.location.href = data.url;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    setConnected(true);
    setConnecting(false);
    setTimeout(() => setStep(3), 2000);
  }

  return (
    <div className="min-h-screen bg-page px-4 py-10">
      <PageTransition>
        <div className="mx-auto w-full max-w-[560px]">
          <p className="font-sans text-small font-medium uppercase tracking-[0.05em] text-ink-muted">
            Step {step} of 3 — {step === 1 ? "Profile details" : step === 2 ? "Payment setup" : "All set"}
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-pill bg-border">
            <motion.div
              className="h-1 bg-primary"
              animate={{ width: `${(step / 3) * 100}%` }}
              style={{ height: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          </div>

          {step === 1 ? (
            <div className="mt-8 rounded-card border border-border bg-card p-8">
              <h1 className="rw-section-title">Tell us about your work</h1>
              <div className="mt-6 flex justify-center">
                <label className="group relative h-[120px] w-[120px] cursor-pointer overflow-hidden rounded-full border border-border bg-page">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center font-display text-section text-ink-muted">
                      Photo
                    </span>
                  )}
                  <span className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
                    <Camera className="h-5 w-5 text-white" />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) onPhoto(file);
                    }}
                  />
                </label>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="title">Professional title</Label>
                  <Input
                    id="title"
                    placeholder="Full-Stack Developer"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input id="linkedin" value={linkedin} onChange={(event) => setLinkedin(event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="website">Personal website</Label>
                  <Input id="website" value={website} onChange={(event) => setWebsite(event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    maxLength={300}
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                  />
                  <p className="mt-1 text-right font-sans text-small text-ink-muted">
                    {bio.length}/300
                  </p>
                </div>
              </div>
              <Button className="mt-6" size="full" onClick={() => setStep(2)}>
                Continue to payment setup
              </Button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-8 rounded-card border border-border bg-card p-8 text-center">
              {connected ? (
                <div>
                  <motion.div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-success"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Check className="h-8 w-8" />
                  </motion.div>
                  <p className="mt-4 font-sans text-body text-ink">
                    Your bank account is connected. You&apos;re ready to get paid.
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="rw-section-title">Connect your bank to get paid</h1>
                  <p className="mt-2 font-sans text-body text-ink-secondary">
                    RemoteWise uses Stripe to send payments directly to your bank account. Your banking details are never stored on our servers.
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Shield className="mx-auto h-5 w-5 text-primary" />
                      <p className="mt-2 font-sans text-small text-ink-secondary">Bank-level encryption</p>
                    </div>
                    <div>
                      <Globe className="mx-auto h-5 w-5 text-primary" />
                      <p className="mt-2 font-sans text-small text-ink-secondary">Available in 40+ countries</p>
                    </div>
                    <div>
                      <Clock className="mx-auto h-5 w-5 text-primary" />
                      <p className="mt-2 font-sans text-small text-ink-secondary">Payouts in 1–2 business days</p>
                    </div>
                  </div>
                  <Button className="mt-8" size="full" loading={connecting} onClick={connectBank}>
                    Connect bank account
                  </Button>
                </>
              )}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mt-8 rounded-card border border-border bg-card p-8 text-center">
              <motion.div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-light text-success"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Check className="h-10 w-10" />
              </motion.div>
              <h1 className="mt-6 font-display text-display text-ink">You&apos;re in, {name.split(" ")[0]}.</h1>
              <p className="mt-3 font-sans text-body text-ink-secondary">
                Your workspace will be notified that you&apos;ve joined. You&apos;ll get an email when your first contract is ready to sign.
              </p>
              <Button className="mt-8" size="full" onClick={() => router.push("/freelancer/dashboard")}>
                Go to my dashboard
              </Button>
            </div>
          ) : null}
        </div>
      </PageTransition>
    </div>
  );
}
