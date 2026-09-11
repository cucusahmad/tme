import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSupervisor } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { organizationMemberSelect } from "@/lib/organization-members";
import MemberTable from "@/components/dashboard/organization/MemberTable";

export default async function MentorMembersPage({ params }: { params: Promise<{ mentorId: string }> }) {
  const supervisor = await requireSupervisor();
  const { mentorId } = await params;
  if (!/^[1-9]\d*$/.test(mentorId) || mentorId.length > 19 || BigInt(mentorId) > BigInt("9223372036854775807")) notFound();
  const mentor = await prisma.users.findFirst({
    where: { user_id: BigInt(mentorId), organization_id: supervisor.organization_id, role: "USER" },
    select: {
      user_id: true, email: true, biodata: { select: { nama_lengkap: true } },
      mentees: { where: { organization_id: supervisor.organization_id, role: "USER" }, orderBy: { email: "asc" }, select: organizationMemberSelect },
    },
  });
  if (!mentor) notFound();
  return <div className="space-y-6">
    <Link href="/dashboard/organization/manage#mentors" className="text-sm font-semibold text-cyan-700 hover:underline">← Kembali ke daftar mentor</Link>
    <div className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-cyan-700">Mentor · {supervisor.organization?.name}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{mentor.biodata?.nama_lengkap || mentor.email}</h1><p className="mt-2 text-slate-500">{mentor.email}</p><p className="mt-4 font-semibold text-slate-700">{mentor.mentees.length} anggota bimbingan</p></div>
    <h2 className="text-xl font-bold text-slate-900">Anggota Bimbingan</h2><MemberTable members={mentor.mentees} />
  </div>;
}
