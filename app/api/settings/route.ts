import { NextResponse } from "next/server";
import { getCurrentWorkspace, getSessionUser } from "@/lib/auth/session";
import { isSettingsTab } from "@/lib/settings";
import { loadSettings } from "@/lib/settings-server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ThemePreference } from "@/lib/theme";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const current = await getCurrentWorkspace();
  const fullName =
    current?.user.fullName ||
    (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "") ||
    user.email?.split("@")[0] ||
    "You";
  try {
    const settings = await loadSettings(user.id, user.email ?? "", fullName, current?.workspace.id ?? null);
    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load settings";
    return NextResponse.json({ message }, { status: 500 });
  }
}

type PatchBody = {
  tab?: string;
  theme?: ThemePreference;
  profile?: { fullName?: string; headline?: string };
  company?: {
    name?: string;
    yTunnus?: string;
    vatId?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  notifications?: {
    invoicePaid?: boolean;
    contractSigned?: boolean;
    payoutSent?: boolean;
    weeklyDigest?: boolean;
    productUpdates?: boolean;
  };
};

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
  const supabase = createServerSupabaseClient();
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (body.tab && isSettingsTab(body.tab)) {
    await supabase.from("user_settings").upsert({
      user_id: user.id,
      settings_tab: body.tab,
      updated_at: new Date().toISOString(),
    });
  }

  if (body.theme === "light" || body.theme === "dark" || body.theme === "system") {
    await supabase.from("user_settings").upsert({
      user_id: user.id,
      theme: body.theme,
      updated_at: new Date().toISOString(),
    });
  }

  if (body.profile) {
    const fullName = body.profile.fullName?.trim();
    if (fullName === "") {
      return NextResponse.json({ message: "Name is required", field: "fullName" }, { status: 400 });
    }
    await supabase.from("user_profiles").upsert({
      user_id: user.id,
      full_name: fullName ?? undefined,
      headline: body.profile.headline?.trim() ?? undefined,
      updated_at: new Date().toISOString(),
    });
    if (fullName) {
      await supabase.auth.updateUser({ data: { full_name: fullName } });
    }
  }

  if (body.notifications) {
    await supabase.from("user_settings").upsert({
      user_id: user.id,
      notify_invoice_paid: body.notifications.invoicePaid,
      notify_contract_signed: body.notifications.contractSigned,
      notify_payout_sent: body.notifications.payoutSent,
      notify_weekly_digest: body.notifications.weeklyDigest,
      notify_product_updates: body.notifications.productUpdates,
      updated_at: new Date().toISOString(),
    });
  }

  if (body.company) {
    const current = await getCurrentWorkspace();
    if (!current) {
      return NextResponse.json({ message: "No workspace" }, { status: 403 });
    }
    const name = body.company.name?.trim();
    if (name === "") {
      return NextResponse.json({ message: "Company name is required", field: "name" }, { status: 400 });
    }
    const { error } = await supabase
      .from("companies")
      .update({
        name: name ?? undefined,
        y_tunnus: body.company.yTunnus?.trim() ?? undefined,
        vat_id: body.company.vatId?.trim() ?? undefined,
        address_line1: body.company.addressLine1?.trim() ?? undefined,
        address_line2: body.company.addressLine2?.trim() ?? undefined,
        city: body.company.city?.trim() ?? undefined,
        postal_code: body.company.postalCode?.trim() ?? undefined,
        country: body.company.country?.trim() ?? undefined,
      })
      .eq("id", current.workspace.id);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
