import { NextResponse } from "next/server";
import { fetchFxRates } from "@/lib/fx";

export const revalidate = 3600;

export async function GET() {
  const rates = await fetchFxRates();
  return NextResponse.json(rates);
}
