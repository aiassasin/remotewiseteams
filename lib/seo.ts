import type { Metadata } from "next";

const SITE = "RemoteWise Teams";
const DESCRIPTION =
  "Contracts, invoices, and payouts for agencies and their freelancers. 5.5% all-in, Shield included.";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://remotewiseteams-aiassasin1.vercel.app";
}

export function pageMeta(title: string, description = DESCRIPTION): Metadata {
  const url = siteUrl();
  const fullTitle = title === SITE ? title : `${title} · ${SITE}`;
  return {
    title,
    description,
    metadataBase: new URL(url),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE,
      type: "website",
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
