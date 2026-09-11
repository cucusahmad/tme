import Link from "next/link";
import OrganizationManager from "@/components/admin/OrganizationManager";
import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default async function AdminOrganizationsPage() {
  await requireAdmin();
  const organizations = await prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: {
      organization_id: true, name: true, description: true,
      _count: { select: { members: true } },
      members: { where: { role: "USER" }, orderBy: { email: "asc" }, select: { user_id: true, email: true, organization_role: true, biodata: { select: { nama_lengkap: true } } } },
    },
  });
  return <div className="space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Pengaturan Organisasi</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Data Organisasi</h1>
      <p className="mt-2 text-sm text-slate-500">Kelola organisasi dan supervisor di sini. Tetapkan organisasi anggota melalui <Link href="/dashboard/admin/users" className="font-semibold text-cyan-700 underline">Data Pengguna</Link>.</p>
    </div>
    <OrganizationManager organizations={organizations.map(item => ({ id: item.organization_id.toString(), name: item.name, description: item.description, memberCount: item._count.members, supervisorCount: item.members.filter(member => member.organization_role === "SUPERVISOR").length, members: item.members.map(member => ({ id: member.user_id.toString(), name: member.biodata?.nama_lengkap || member.email, email: member.email, supervisor: member.organization_role === "SUPERVISOR" })) }))} />
  </div>;
}
