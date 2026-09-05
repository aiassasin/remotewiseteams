"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { useTheme } from "@/components/theme/theme-provider";
import { useT } from "@/components/i18n/language-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { initials } from "@/lib/utils";
import {
  SETTINGS_TABS,
  isSettingsTab,
  type CompanyPayload,
  type MemberPayload,
  type NotificationPayload,
  type SettingsPayload,
  type SettingsTab,
} from "@/lib/settings";
import type { ThemePreference } from "@/lib/theme";
import type { MessageKey } from "@/lib/i18n";

const TAB_KEY: Record<SettingsTab, MessageKey> = {
  profile: "settings.tabProfile",
  language: "settings.tabLanguage",
  appearance: "settings.tabAppearance",
  company: "settings.tabCompany",
  members: "settings.tabMembers",
  notifications: "settings.tabNotifications",
  billing: "settings.tabBilling",
  security: "settings.tabSecurity",
  privacy: "settings.tabPrivacy",
};

export function SettingsView({ initial }: { initial: SettingsPayload | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setPreference } = useTheme();
  const t = useT();
  const [data, setData] = useState<SettingsPayload | null>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initial);

  const requested = searchParams.get("tab");
  const tab: SettingsTab = isSettingsTab(requested)
    ? requested
    : data?.tab ?? "profile";

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    fetch("/api/settings")
      .then(async (response) => {
        const json = (await response.json()) as { settings?: SettingsPayload; message?: string };
        if (!response.ok || !json.settings) throw new Error(json.message || t("settings.loadFailed"));
        if (!cancelled) {
          setData(json.settings);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t("settings.loadFailed"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initial, t]);

  function selectTab(next: SettingsTab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`/dashboard/settings?${params.toString()}`, { scroll: false });
    void fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tab: next }),
    });
  }

  if (loading) {
    return (
      <PageTransition>
        <PageHeader title={t("settings.title")} description={t("settings.shortDescription")} />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-card border border-border bg-card" />
          ))}
        </div>
      </PageTransition>
    );
  }

  if (error || !data) {
    return (
      <PageTransition>
        <PageHeader title={t("settings.title")} description={t("settings.shortDescription")} />
        <div className="rw-card">
          <EmptyState
            icon="settings"
            title={t("settings.loadError")}
            description={error || t("settings.refreshTry")}
            actionLabel={t("common.retry")}
            onAction={() => window.location.reload()}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title={t("settings.title")} description={t("settings.description")} />
      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="flex gap-1 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible" aria-label={t("settings.sections")}>
          {SETTINGS_TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectTab(item)}
              className={`whitespace-nowrap rounded-control px-3 py-2 text-left font-sans text-[13px] font-medium ${
                tab === item ? "bg-primary-light text-primary-text" : "text-ink-secondary hover:bg-page hover:text-ink"
              }`}
              aria-current={tab === item ? "page" : undefined}
            >
              {t(TAB_KEY[item])}
            </button>
          ))}
        </nav>
        <div className="min-w-0 flex-1 rounded-card border border-border bg-card p-6">
          {tab === "profile" ? (
            <ProfileTab data={data} onChange={setData} />
          ) : null}
          {tab === "language" ? <LanguageTab /> : null}
          {tab === "appearance" ? (
            <AppearanceTab
              theme={data.theme}
              onChange={(theme) => {
                setData({ ...data, theme });
                setPreference(theme);
              }}
            />
          ) : null}
          {tab === "company" ? <CompanyTab data={data} onChange={setData} /> : null}
          {tab === "members" ? <MembersTab data={data} onChange={setData} /> : null}
          {tab === "notifications" ? <NotificationsTab data={data} onChange={setData} /> : null}
          {tab === "billing" ? <BillingTab plan={data.company?.plan ?? "free"} /> : null}
          {tab === "security" ? <SecurityTab email={data.profile.email} /> : null}
          {tab === "privacy" ? <PrivacyTab /> : null}
        </div>
      </div>
    </PageTransition>
  );
}

function ProfileTab({
  data,
  onChange,
}: {
  data: SettingsPayload;
  onChange: (next: SettingsPayload) => void;
}) {
  const t = useT();
  const [fullName, setFullName] = useState(data.profile.fullName);
  const [headline, setHeadline] = useState(data.profile.headline);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: { fullName, headline } }),
    });
    setSaving(false);
    if (!response.ok) {
      const json = (await response.json()) as { message?: string };
      toast.error(json.message || t("settings.profileFailed"));
      return;
    }
    onChange({ ...data, profile: { ...data.profile, fullName, headline } });
    toast.success(t("settings.profileSaved"));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="rw-section-title">{t("settings.tabProfile")}</h2>
      <AvatarField
        url={data.profile.avatarUrl}
        name={fullName}
        onUploaded={(url) => onChange({ ...data, profile: { ...data.profile, avatarUrl: url } })}
      />
      <div>
        <label htmlFor="settings-name" className="rw-label">
          {t("common.name")}
        </label>
        <Input id="settings-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
      </div>
      <div>
        <label htmlFor="settings-headline" className="rw-label">
          {t("settings.headline")}
        </label>
        <Input
          id="settings-headline"
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
          placeholder={t("settings.headlinePlaceholder")}
        />
      </div>
      <p className="font-sans text-small text-ink-muted">{data.profile.email}</p>
      <Button type="submit" loading={saving}>
        {t("settings.saveProfile")}
      </Button>
    </form>
  );
}

function AvatarField({
  url,
  name,
  kind = "avatar",
  onUploaded,
}: {
  url: string | null;
  name: string;
  kind?: "avatar" | "logo";
  onUploaded: (url: string) => void;
}) {
  const t = useT();
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.set("file", file);
    body.set("kind", kind);
    const response = await fetch("/api/settings/avatar", { method: "POST", body });
    setUploading(false);
    const json = (await response.json()) as { url?: string; message?: string };
    if (!response.ok || !json.url) {
      toast.error(json.message || t("settings.uploadFailed"));
      return;
    }
    onUploaded(json.url);
    toast.success(kind === "logo" ? t("settings.logoUpdated") : t("settings.photoUpdated"));
  }

  return (
    <div className="flex items-center gap-4">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-16 w-16 rounded-full object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light font-sans text-[18px] text-primary-text">
          {initials(name)}
        </div>
      )}
      <div>
        <label className="rw-cta inline-flex cursor-pointer rounded-control px-4 py-2 font-sans text-[13px] font-semibold">
          {uploading ? t("settings.uploading") : kind === "logo" ? t("settings.uploadLogo") : t("settings.uploadPhoto")}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
        </label>
        <p className="mt-1 font-sans text-small text-ink-muted">{t("settings.uploadHint")}</p>
      </div>
    </div>
  );
}

function AppearanceTab({
  theme,
  onChange,
}: {
  theme: ThemePreference;
  onChange: (theme: ThemePreference) => void;
}) {
  const t = useT();
  async function choose(next: ThemePreference) {
    onChange(next);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: next }),
    });
  }

  return (
    <div>
      <h2 className="rw-section-title">{t("settings.tabAppearance")}</h2>
      <p className="mt-2 font-sans text-body text-ink-secondary">{t("settings.appearanceHint")}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {(["light", "dark", "system"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => void choose(option)}
            className={`rounded-card border p-4 text-left ${
              theme === option ? "border-primary bg-primary-light" : "border-border"
            }`}
          >
            <p className="font-display text-card text-ink">
              {option === "light" ? t("theme.lightName") : option === "dark" ? t("theme.darkName") : t("theme.systemName")}
            </p>
          </button>
        ))}
      </div>
      <div className="mt-8 border-t border-border pt-8">
        <LanguageFields />
      </div>
    </div>
  );
}

function LanguageTab() {
  return <LanguageFields />;
}

function LanguageFields() {
  const t = useT();
  return (
    <div>
      <h2 className="rw-section-title">{t("settings.tabLanguage")}</h2>
      <p className="mt-2 font-sans text-body text-ink-secondary">{t("settings.languageHint")}</p>
      <div className="mt-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}

function CompanyTab({
  data,
  onChange,
}: {
  data: SettingsPayload;
  onChange: (next: SettingsPayload) => void;
}) {
  const t = useT();
  const company = data.company;
  const [form, setForm] = useState<CompanyPayload>(
    company ?? {
      name: "",
      logoUrl: null,
      plan: "free",
      yTunnus: "",
      vatId: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      country: "FI",
    },
  );
  const [saving, setSaving] = useState(false);

  if (!data.canManageCompany) {
    return (
      <EmptyState
        icon="settings"
        title={t("settings.noCompanyTitle")}
        description={t("settings.noCompanyBody")}
      />
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: {
          name: form.name,
          yTunnus: form.yTunnus,
          vatId: form.vatId,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
      }),
    });
    setSaving(false);
    if (!response.ok) {
      toast.error(t("settings.companyFailed"));
      return;
    }
    onChange({ ...data, company: form });
    toast.success(t("settings.companySaved"));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="rw-section-title">{t("settings.tabCompany")}</h2>
      <AvatarField
        url={form.logoUrl}
        name={form.name}
        kind="logo"
        onUploaded={(url) => {
          setForm({ ...form, logoUrl: url });
          onChange({ ...data, company: { ...form, logoUrl: url } });
        }}
      />
      {(
        [
          ["name", t("settings.companyName")],
          ["yTunnus", t("settings.yTunnus")],
          ["vatId", t("settings.vatId")],
          ["addressLine1", t("settings.address")],
          ["addressLine2", t("settings.address2")],
          ["city", t("settings.city")],
          ["postalCode", t("settings.postalCode")],
          ["country", t("settings.country")],
        ] as const
      ).map(([key, label]) => (
        <div key={key}>
          <label className="rw-label" htmlFor={`company-${key}`}>
            {label}
          </label>
          <Input
            id={`company-${key}`}
            value={form[key] ?? ""}
            onChange={(event) => setForm({ ...form, [key]: event.target.value })}
            required={key === "name"}
          />
        </div>
      ))}
      <Button type="submit" loading={saving}>
        {t("settings.saveCompany")}
      </Button>
    </form>
  );
}

function MembersTab({
  data,
  onChange,
}: {
  data: SettingsPayload;
  onChange: (next: SettingsPayload) => void;
}) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const members = data.members;

  async function invite(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/settings/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role: "member" }),
    });
    setBusy(false);
    const json = (await response.json()) as { message?: string };
    if (!response.ok) {
      toast.error(json.message || t("settings.inviteFailed"));
      return;
    }
    setEmail("");
    toast.success(t("settings.memberAdded"));
    const reload = await fetch("/api/settings");
    const next = (await reload.json()) as { settings?: SettingsPayload };
    if (next.settings) onChange(next.settings);
  }

  async function remove(id: string) {
    const response = await fetch(`/api/settings/members?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      const json = (await response.json()) as { message?: string };
      toast.error(json.message || t("settings.removeFailed"));
      return;
    }
    onChange({ ...data, members: members.filter((row) => row.id !== id) });
    toast.success(t("settings.memberRemoved"));
  }

  if (!members.length) {
    return (
      <div>
        <h2 className="rw-section-title">{t("settings.tabMembers")}</h2>
        <EmptyState
          icon="freelancers"
          title={t("settings.onlyYou")}
          description={t("settings.inviteTeammate")}
        />
        <form onSubmit={invite} className="mt-4 flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("settings.teammatePlaceholder")}
            required
          />
          <Button type="submit" loading={busy}>
            {t("common.invite")}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2 className="rw-section-title">{t("settings.tabMembers")}</h2>
      <ul className="mt-4 divide-y divide-border">
        {members.map((row) => (
          <MemberRow key={row.id} row={row} onRemove={() => void remove(row.id)} />
        ))}
      </ul>
      <form onSubmit={invite} className="mt-6 flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("settings.teammatePlaceholder")}
          required
        />
        <Button type="submit" loading={busy}>
            {t("common.invite")}
          </Button>
      </form>
    </div>
  );
}

function MemberRow({ row, onRemove }: { row: MemberPayload; onRemove: () => void }) {
  const t = useT();
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="font-sans text-[14px] font-medium text-ink">{row.fullName}</p>
        <p className="font-sans text-small text-ink-muted">
          {row.email} · {row.role}
        </p>
      </div>
      {row.role !== "owner" ? (
        <Button variant="ghost" size="sm" onClick={onRemove}>
          {t("settings.remove")}
        </Button>
      ) : null}
    </li>
  );
}

function NotificationsTab({
  data,
  onChange,
}: {
  data: SettingsPayload;
  onChange: (next: SettingsPayload) => void;
}) {
  const t = useT();
  const notes = data.notifications;
  const items: { key: keyof NotificationPayload; label: string }[] = [
    { key: "invoicePaid", label: t("settings.notifyInvoicePaid") },
    { key: "contractSigned", label: t("settings.notifyContractSigned") },
    { key: "payoutSent", label: t("settings.notifyPayoutSent") },
    { key: "weeklyDigest", label: t("settings.notifyWeekly") },
    { key: "productUpdates", label: t("settings.notifyProduct") },
  ];

  async function toggle(key: keyof NotificationPayload) {
    const next = { ...notes, [key]: !notes[key] };
    onChange({ ...data, notifications: next });
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notifications: next }),
    });
  }

  return (
    <div>
      <h2 className="rw-section-title">{t("settings.tabNotifications")}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.key}>
            <label className="flex items-center justify-between gap-3 font-sans text-[14px] text-ink">
              {item.label}
              <input type="checkbox" checked={notes[item.key]} onChange={() => void toggle(item.key)} />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BillingTab({ plan }: { plan: string }) {
  const t = useT();
  return (
    <div>
      <h2 className="rw-section-title">{t("settings.tabBilling")}</h2>
      <p className="mt-2 font-sans text-body text-ink-secondary">
        {t("settings.onPlan", { plan })}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { name: t("settings.planFree"), price: "$0", current: plan === "free" },
          { name: t("settings.planGrowth"), price: "$49/mo", current: plan === "growth" },
          { name: t("settings.planScale"), price: "$149/mo", current: plan === "scale" },
        ].map((item) => (
          <div
            key={item.name}
            className={`rounded-card border p-4 ${item.current ? "border-primary" : "border-border"}`}
          >
            <p className="font-display text-card text-ink">{item.name}</p>
            <p className="mt-1 font-sans text-[14px] text-ink-secondary">{item.price}</p>
            {item.current ? (
              <p className="mt-3 font-sans text-small text-primary-text">{t("settings.current")}</p>
            ) : (
              <Button asChild variant="secondary" size="sm" className="mt-3">
                <a href="/pricing">{t("settings.compare")}</a>
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-card border border-border bg-card p-5">
        <h3 className="font-display text-card text-ink">{t("settings.addonTitle")}</h3>
        <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-secondary">
          {t("settings.addonBody")}
        </p>
        <Button asChild variant="secondary" size="sm" className="mt-4">
          <a href="/dashboard/settings?tab=company">{t("settings.addYTunnus")}</a>
        </Button>
      </div>
    </div>
  );
}

function SecurityTab({ email }: { email: string }) {
  const t = useT();
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setSaving(false);
    if (!response.ok) {
      const json = (await response.json()) as { message?: string };
      toast.error(json.message || t("settings.passwordFailed"));
      return;
    }
    setPassword("");
    toast.success(t("settings.passwordUpdated"));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="rw-section-title">{t("settings.tabSecurity")}</h2>
        <p className="mt-2 font-sans text-body text-ink-secondary">{t("settings.signedInAs", { email })}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="rw-label" htmlFor="new-password">
          {t("settings.newPassword")}
        </label>
        <Input
          id="new-password"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" loading={saving}>
          {t("settings.updatePassword")}
        </Button>
      </form>
      <div className="rounded-card border border-border bg-page p-4">
        <p className="font-sans text-[14px] font-medium text-ink">{t("settings.thisSession")}</p>
        <p className="mt-1 font-sans text-small text-ink-muted">{t("settings.currentBrowser")}</p>
      </div>
    </div>
  );
}

function PrivacyTab() {
  const t = useT();
  async function requestDelete() {
    if (!window.confirm(t("settings.deleteConfirm"))) return;
    const response = await fetch("/api/settings/delete", { method: "POST" });
    const json = (await response.json()) as { message?: string };
    if (!response.ok) {
      toast.error(json.message || t("settings.deleteFailed"));
      return;
    }
    toast.success(json.message || t("settings.deleteRequested"));
  }

  return (
    <div className="space-y-4">
      <h2 className="rw-section-title">{t("settings.tabPrivacy")}</h2>
      <p className="font-sans text-body text-ink-secondary">{t("settings.privacyBody")}</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <a href="/api/settings/export">{t("settings.exportData")}</a>
        </Button>
        <Button variant="danger" onClick={() => void requestDelete()}>
          {t("settings.deleteAccount")}
        </Button>
      </div>
    </div>
  );
}
