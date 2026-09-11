import Link from "next/link";
import { requireSupervisor } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { organizationMemberSelect } from "@/lib/organization-members";
import MemberTable from "@/components/dashboard/organization/MemberTable";
import ActionForm from "@/components/dashboard/organization/ActionForm";
import { reviewOrganizationRequest } from "../actions";

export default async function ManageOrganizationPage() {
  const supervisor = await requireSupervisor();
  const organizationId = supervisor.organization_id;
  const [requests, members, mentors] = await Promise.all([
    prisma.organization_join_request.findMany({
      where: { organization_id: organizationId, status: "PENDING" }, orderBy: { created_at: "asc" },
      include: { user: { select: { email: true, is_active: true, biodata: { select: { nama_lengkap: true } } } } },
    }),
    prisma.users.findMany({ where: { organization_id: organizationId, role: "USER" }, orderBy: { email: "asc" }, select: organizationMemberSelect }),
    prisma.users.findMany({
      where: { organization_id: organizationId, role: "USER", mentees: { some: { organization_id: organizationId, role: "USER" } } },
      orderBy: { email: "asc" },
      select: { user_id: true, email: true, is_active: true, biodata: { select: { nama_lengkap: true } }, _count: { select: { mentees: { where: { organization_id: organizationId, role: "USER" } } } } },
    }),
  ]);
  const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" });
  return <div className="space-y-8">
    <div><h1 className="text-3xl font-bold text-slate-900">Kelola Organisasi</h1><p className="mt-2 text-slate-500">{supervisor.organization?.name} · Ruang supervisor</p></div>
    <nav aria-label="Bagian organisasi" className="flex flex-wrap gap-3 text-sm font-semibold text-emerald-800"><a href="#requests" className="rounded-xl bg-white px-4 py-3 shadow-sm">Permintaan ({requests.length})</a><a href="#members" className="rounded-xl bg-white px-4 py-3 shadow-sm">Anggota ({members.length})</a><a href="#mentors" className="rounded-xl bg-white px-4 py-3 shadow-sm">Mentor ({mentors.length})</a></nav>
    <section id="requests" className="scroll-mt-24 space-y-4"><h2 className="text-xl font-bold text-slate-900">Permintaan Bergabung</h2>
      {!requests.length && <p className="rounded-2xl bg-white p-6 text-slate-500">Tidak ada permintaan yang menunggu persetujuan.</p>}
      {requests.map(request => <div key={request.request_id.toString()} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start">
        <div><p className="font-bold text-slate-900">{request.user.biodata?.nama_lengkap || request.user.email}</p><p className="text-sm text-slate-500">{request.user.email}</p><p className="mt-2 text-xs text-slate-500">Diajukan {date.format(request.created_at)}{!request.user.is_active ? " · Akun nonaktif" : ""}</p></div>
        <ActionForm action={reviewOrganizationRequest} className="max-w-md space-y-2"><input type="hidden" name="requestId" value={request.request_id.toString()} /><input type="hidden" name="requestedAt" value={request.created_at.toISOString()} /><div className="flex gap-2">
          <button name="decision" value="APPROVED" disabled={!request.user.is_active} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Setujui</button>
          <button name="decision" value="REJECTED" className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Tolak</button>
        </div></ActionForm>
      </div>)}
    </section>
    <section id="members" className="scroll-mt-24 space-y-4"><h2 className="text-xl font-bold text-slate-900">Anggota Organisasi</h2><MemberTable members={members} /></section>
    <section id="mentors" className="scroll-mt-24 space-y-4"><div><h2 className="text-xl font-bold text-slate-900">Daftar Mentor</h2><p className="mt-1 text-sm text-slate-500">Anggota yang telah dipilih sebagai mentor. Klik mentor untuk melihat anggota bimbingannya.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{mentors.map(mentor => <Link key={mentor.user_id.toString()} href={`/dashboard/organization/manage/mentors/${mentor.user_id}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-md">
        <h3 className="font-bold text-slate-900">{mentor.biodata?.nama_lengkap || mentor.email}</h3><p className="mt-1 break-all text-sm text-slate-500">{mentor.email}{!mentor.is_active ? " · Nonaktif" : ""}</p><p className="mt-4 font-semibold text-emerald-800">{mentor._count.mentees} anggota bimbingan →</p>
      </Link>)}</div>
      {!mentors.length && <p className="rounded-2xl bg-white p-6 text-slate-500">Belum ada mentor yang dipilih oleh anggota organisasi.</p>}
    </section>
  </div>;
}
