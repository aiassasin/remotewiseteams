import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EMAIL_PATTERN } from "@/lib/utils";
import { isWorkspaceAccent } from "@/lib/workspace-accents";

type SignupBody = {
  fullName?: string;
  email?: string;
  password?: string;
  companyName?: string;
  accentColor?: string;
};

export async function POST(request: Request) {
  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const companyName = body.companyName?.trim() ?? "";
  const accentColor = body.accentColor ?? "#4F46E5";

  if (!fullName) {
    return NextResponse.json({ message: "Enter your full name", field: "fullName" }, { status: 400 });
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: "Enter a valid work email", field: "email" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { message: "Use at least 8 characters for your password", field: "password" },
      { status: 400 },
    );
  }
  if (!companyName) {
    return NextResponse.json(
      { message: "Name the workspace your team will share", field: "companyName" },
      { status: 400 },
    );
  }
  if (!isWorkspaceAccent(accentColor)) {
    return NextResponse.json(
      { message: "Choose one of the workspace colors", field: "accentColor" },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const admin = createAdminClient();
  let userId: string | null = null;

  if (admin) {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (createError || !created.user) {
      const exists = (createError?.message || "").toLowerCase().includes("already");
      return NextResponse.json(
        {
          message: exists
            ? "That email is already registered. Sign in instead."
            : createError?.message || "Could not create the account",
          field: "email",
        },
        { status: exists ? 409 : 400 },
      );
    }
    userId = created.user.id;
  } else {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      const exists = error.message.toLowerCase().includes("already");
      return NextResponse.json(
        {
          message: exists
            ? "That email is already registered. Sign in instead."
            : error.message,
          field: "email",
        },
        { status: exists ? 409 : 400 },
      );
    }
    if (data.user?.identities && data.user.identities.length === 0) {
      return NextResponse.json(
        { message: "That email is already registered. Sign in instead.", field: "email" },
        { status: 409 },
      );
    }
    userId = data.user?.id ?? null;
    if (!data.session && userId) {
      return NextResponse.json(
        {
          message: "Check your inbox to confirm this email, then sign in.",
          field: "email",
        },
        { status: 401 },
      );
    }
  }

  const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !sessionData.user) {
    return NextResponse.json(
      {
        message: "Account created. Sign in to finish setting up the workspace.",
        field: "password",
      },
      { status: 401 },
    );
  }
  userId = sessionData.user.id;

  const writer = admin ?? supabase;
  const { data: company, error: companyError } = await writer
    .from("companies")
    .insert({
      owner_id: userId,
      name: companyName,
      accent_color: accentColor,
    })
    .select("id")
    .single();

  if (companyError || !company) {
    return NextResponse.json(
      { message: companyError?.message || "Could not create the workspace" },
      { status: 500 },
    );
  }

  const { error: memberError } = await writer.from("members").insert({
    user_id: userId,
    company_id: company.id,
    role: "owner",
  });
  if (memberError) {
    return NextResponse.json({ message: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ redirect: "/dashboard/overview", companyId: company.id });
}
