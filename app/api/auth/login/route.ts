import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { EMAIL_PATTERN } from "@/lib/utils";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ message: "Enter a valid email", field: "email" }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ message: "Enter your password", field: "password" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json(
      { message: "Check the email and password and try again.", field: "password" },
      { status: 401 },
    );
  }

  return NextResponse.json({ redirect: "/dashboard/overview" });
}
