import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const kind = form.get("kind") === "logo" ? "logo" : "avatar";
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Choose a photo" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ message: "Use JPEG, PNG, WebP, or GIF" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "Keep the file under 5 MB" }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ message: "Storage is not configured" }, { status: 500 });

  const ext = file.type.split("/")[1] || "png";
  const path = `${user.id}/${kind}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from("avatars").upload(path, buffer, {
    upsert: true,
    contentType: file.type,
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  const { data } = admin.storage.from("avatars").getPublicUrl(path);
  const url = `${data.publicUrl}?v=${Date.now()}`;
  const supabase = createServerSupabaseClient();

  if (kind === "avatar") {
    await supabase.from("user_profiles").upsert({
      user_id: user.id,
      avatar_url: url,
      updated_at: new Date().toISOString(),
    });
  } else {
    const { data: membership } = await supabase
      .from("members")
      .select("company_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (membership?.company_id) {
      await supabase.from("companies").update({ logo_url: url }).eq("id", membership.company_id);
    }
  }

  return NextResponse.json({ url });
}
