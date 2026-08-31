import { PageHeader } from "@/components/layout/page-header";
import { PageTransition } from "@/components/motion/page-transition";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyBody,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyBody: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <PageTransition>
      <PageHeader title={title} description={description} />
      <div className="rw-card">
        <EmptyState
          icon={Icon}
          title={emptyTitle}
          description={emptyBody}
          actionLabel={actionHref ? undefined : actionLabel}
        />
        {actionHref && actionLabel ? (
          <div className="flex justify-center pb-10">
            <Button asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}
