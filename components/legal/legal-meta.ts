import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export function legalMetadata(title: string, description: string): Metadata {
  return pageMeta(title, description);
}
