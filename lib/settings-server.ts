import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAppLanguage } from "@/lib/i18n";
import {
  isSettingsTab,
  type CompanyPayload,
  type MemberPayload,
  type SettingsPayload,
  type SettingsTab,
} from "@/lib/settings";

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function loadSettings(
  userId: string,
  email: string,
  fullName: string,
  companyId: string | null,
) {
  const supabase = createServerSupabaseClient();
  const admin = createAdminClient();

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("user_settings").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  let company: CompanyPayload | null = null;
  let members: MemberPayload[] = [];
  if (companyId) {
    const fullSelect =
      "name, logo_url, plan, y_tunnus, vat_id, address_line1, address_line2, city, postal_code, country";
    let { data: companyRow } = await supabase
      .from("companies")
      .select(fullSelect)
      .eq("id", companyId)
      .maybeSingle();
    if (!companyRow) {
      const fallback = await supabase
        .from("companies")
        .select("name, logo_url, plan")
        .eq("id", companyId)
        .maybeSingle();
      companyRow = fallback.data
        ? {
            ...fallback.data,
            y_tunnus: null,
            vat_id: null,
            address_line1: null,
            address_line2: null,
            city: null,
            postal_code: null,
            country: "FI",
          }
        : null;
    }
    if (companyRow) {
      const row = companyRow as Record<string, unknown>;
      company = {
        name: asString(row.name),
        logoUrl: typeof row.logo_url === "string" ? row.logo_url : null,
        plan: asString(row.plan) || "free",
        yTunnus: asString(row.y_tunnus),
        vatId: asString(row.vat_id),
        addressLine1: asString(row.address_line1),
        addressLine2: asString(row.address_line2),
        city: asString(row.city),
        postalCode: asString(row.postal_code),
        country: asString(row.country) || "FI",
      };
    }

    const { data: memberRows } = await supabase
      .from("members")
      .select("id, user_id, role")
      .eq("company_id", companyId);
    const rows = memberRows ?? [];
    const userIds = rows.map((item) => item.user_id as string);
    const emails = new Map<string, { email: string; fullName: string }>();
    if (admin && userIds.length) {
      for (let page = 1; page <= 5; page += 1) {
        const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        for (const user of data?.users ?? []) {
          if (userIds.includes(user.id)) {
            emails.set(user.id, {
              email: user.email ?? "",
              fullName:
                (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
                user.email?.split("@")[0] ||
                "Member",
            });
          }
        }
        if ((data?.users.length ?? 0) < 200) break;
      }
    }
    const { data: profiles } = userIds.length
      ? await supabase.from("user_profiles").select("user_id, full_name").in("user_id", userIds)
      : { data: [] as { user_id: string; full_name: string | null }[] };
    members = rows.map((item) => {
      const info = emails.get(item.user_id as string);
      const profileName = profiles?.find((row) => row.user_id === item.user_id)?.full_name;
      return {
        id: item.id as string,
        userId: item.user_id as string,
        role: (item.role as MemberPayload["role"]) || "member",
        email: info?.email || "",
        fullName: asString(profileName) || info?.fullName || "Member",
      };
    });
  }

  const settingsRow = settings as Record<string, unknown> | null;
  const payload: SettingsPayload = {
    tab: isSettingsTab(settings?.settings_tab) ? settings.settings_tab : "profile",
    theme:
      settings?.theme === "light" || settings?.theme === "dark" || settings?.theme === "system"
        ? settings.theme
        : "system",
    language: isAppLanguage(settingsRow?.language) ? settingsRow.language : "en",
    profile: {
      fullName: asString(profile?.full_name) || fullName,
      headline: asString(profile?.headline),
      avatarUrl: typeof profile?.avatar_url === "string" ? profile.avatar_url : null,
      email,
    },
    company,
    members,
    notifications: {
      invoicePaid: settings?.notify_invoice_paid !== false,
      contractSigned: settings?.notify_contract_signed !== false,
      payoutSent: settings?.notify_payout_sent !== false,
      weeklyDigest: settings?.notify_weekly_digest === true,
      productUpdates: settings?.notify_product_updates !== false,
    },
    canManageCompany: Boolean(companyId),
  };

  return payload;
}

export async function upsertSettingsTab(userId: string, tab: SettingsTab) {
  const supabase = createServerSupabaseClient();
  await supabase.from("user_settings").upsert({
    user_id: userId,
    settings_tab: tab,
    updated_at: new Date().toISOString(),
  });
}
