import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentFreelancer, getCurrentWorkspace } from "@/lib/auth/session";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await getCurrentWorkspace();
  if (!current) {
    const freelancer = await getCurrentFreelancer();
    redirect(freelancer ? "/freelancer/dashboard" : "/signup");
  }

  return (
    <DashboardShell
      userName={current.user.fullName}
      companyName={current.workspace.name}
      plan={current.workspace.plan}
    >
      {children}
    </DashboardShell>
  );
}
