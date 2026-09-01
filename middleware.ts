import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

function isPublicPath(pathname: string) {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt"
  ) {
    return true;
  }
  const publicPrefixes = [
    "/login",
    "/signup",
    "/pricing",
    "/privacy",
    "/terms",
    "/invoicing-terms",
    "/cookies",
    "/invite",
    "/sign",
    "/preview",
    "/api/auth/login",
    "/api/auth/signup",
    "/api/invite",
    "/api/sign",
    "/api/e2e",
    "/api/fx",
    "/api/stripe/webhook",
  ];
  return publicPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  let response = NextResponse.next({ request });
  let user: { id: string } | null = null;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const dest = request.nextUrl.clone();
    dest.pathname = user ? "/dashboard/overview" : "/login";
    return NextResponse.redirect(dest);
  }

  if (!user && !isPublicPath(pathname)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Sign in to continue" }, { status: 401 });
    }
    const dest = request.nextUrl.clone();
    dest.pathname = "/login";
    dest.searchParams.set("next", pathname);
    return NextResponse.redirect(dest);
  }

  if (user && pathname === "/login") {
    const dest = request.nextUrl.clone();
    dest.pathname = "/dashboard/overview";
    return NextResponse.redirect(dest);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
