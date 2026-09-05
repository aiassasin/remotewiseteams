"use client";

import { PlaceholderPage } from "@/components/layout/placeholder-page";
import { useT } from "@/components/i18n/language-provider";

export function StandupsPageClient() {
  const t = useT();
  return (
    <PlaceholderPage
      title={t("standups.title")}
      description={t("standups.description")}
      icon="standups"
      emptyTitle={t("standups.emptyTitle")}
      emptyBody={t("standups.emptyBody")}
    />
  );
}
