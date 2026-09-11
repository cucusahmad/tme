import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireActiveUser } from "@/lib/auth-session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireActiveUser();
  const isSupervisor = user.role === "USER" && user.organization_role === "SUPERVISOR" && Boolean(user.organization_id && user.organization?.is_active);
  return <DashboardShell isSupervisor={isSupervisor}>{children}</DashboardShell>;
}
