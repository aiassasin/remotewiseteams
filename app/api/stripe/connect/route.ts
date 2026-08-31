import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const key = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!key) {
    return NextResponse.json({
      mocked: true,
      url: `${appUrl}/onboarding/profile?stripe=mock`,
    });
  }

  const stripe = new Stripe(key);
  const account = await stripe.accounts.create({
    type: "express",
  });

  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${appUrl}/onboarding/profile?stripe=refresh`,
    return_url: `${appUrl}/onboarding/profile?stripe=return`,
    type: "account_onboarding",
  });

  return NextResponse.json({ mocked: false, url: link.url, accountId: account.id });
}
