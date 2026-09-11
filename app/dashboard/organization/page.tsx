import Link from "next/link";
import { requireMember } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import ActionForm from "@/components/dashboard/organization/ActionForm";
import { cancelOrganizationRequest, requestOrganization, selectMyMentor } from "./actions";

const statusLabels = { PENDING: "Menunggu persetujuan", APPROVED: "Disetujui", REJECTED: "Ditolak", CANCELLED: "Dibatalkan" };
const inputClass = "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900";
const buttonClass = "rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-800 disabled:opacity-50";

export default async function OrganizationSettingsPage() {
  const user = await requireMember();
  const [organizations, request, candidates] = await Promise.all([
    prisma.organization.findMany({ where: { is_active: true }, orderBy: { name: "asc" }, select: { organization_id: true, name: true } }),
    prisma.organization_join_request.findUnique({ where: { user_id: user.user_id }, include: { organization: { select: { name: true } } } }),
    user.organization_id && user.organization?.is_active ? prisma.users.findMany({
      where: { organization_id: user.organization_id, role: "USER", is_active: true, user_id: { not: user.user_id } },
      orderBy: { email: "asc" }, select: { user_id: true, email: true, biodata: { select: { nama_lengkap: true } } },
    }) : [],
  ]);
  const choices = organizations.filter(item => item.organization_id !== user.organization_id);
  const pending = request?.status === "PENDING";
  const currentMentor = candidates.find(item => item.user_id === user.mentor_id);

  return <div className="mx-auto max-w-4xl space-y-6">
    <div><h1 className="text-3xl font-bold text-slate-900">Organisasi &amp; Mentor</h1><p className="mt-2 text-slate-500">Ajukan keanggotaan organisasi, lalu pilih mentor setelah supervisor menyetujui.</p></div>
    <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div><h2 className="text-xl font-bold text-slate-900">Organisasi Saya</h2><p className="mt-2 font-semibold text-cyan-800">{user.organization?.name ?? "Belum bergabung dengan organisasi"}</p>
        {user.organization && <p className="mt-1 text-sm text-slate-500">{user.organization_role === "SUPERVISOR" ? "Supervisor" : "Anggota"}{!user.organization.is_active ? " · Organisasi nonaktif" : " · Keanggotaan aktif"}</p>}
      </div>
      {user.organization_role === "SUPERVISOR" && user.organization?.is_active && <Link href="/dashboard/organization/manage" className="inline-block font-semibold text-cyan-700 underline">Kelola permintaan dan anggota organisasi →</Link>}
      {request && <div className={`rounded-xl border p-4 ${pending ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
        <p className="font-semibold text-slate-900">{request.organization.name}</p><p className="mt-1 text-sm text-slate-700">Status permintaan: {statusLabels[request.status]}</p>
        {request.status === "REJECTED" && <p className="mt-2 text-sm text-slate-600">Anda dapat mengajukan kembali atau memilih organisasi lain.</p>}
        {pending && <ActionForm action={cancelOrganizationRequest} className="mt-3 space-y-2"><input type="hidden" name="requestId" value={request.request_id.toString()} /><input type="hidden" name="requestedAt" value={request.created_at.toISOString()} /><button className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100">Batalkan permintaan</button></ActionForm>}
      </div>}
      {!pending && <ActionForm action={requestOrganization}>
        <label className="block text-sm font-semibold text-slate-700">{user.organization_id ? "Ajukan pindah organisasi" : "Pilih organisasi"}
          <select name="organizationId" required defaultValue="" className={inputClass}><option value="" disabled>Pilih organisasi tujuan</option>{choices.map(item => <option key={item.organization_id.toString()} value={item.organization_id.toString()}>{item.name}</option>)}</select>
        </label>
        {user.organization_id && <p className="text-sm text-slate-500">Keanggotaan saat ini tetap berlaku selama menunggu. Setelah pindah disetujui, peran kembali menjadi anggota dan hubungan mentor di organisasi lama dilepas.</p>}
        {!choices.length && <p className="text-sm text-slate-500">Belum ada organisasi lain yang tersedia.</p>}
        <button disabled={!choices.length} className={buttonClass}>Ajukan keanggotaan</button>
      </ActionForm>}
    </section>
    <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <div><h2 className="text-xl font-bold text-slate-900">Mentor Saya</h2><p className="mt-2 text-sm text-slate-500">Mentor dipilih dari anggota aktif dalam organisasi Anda.</p></div>
      {!user.organization_id || !user.organization?.is_active ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Pilihan mentor tersedia setelah keanggotaan organisasi aktif disetujui.</p> : <ActionForm action={selectMyMentor} key={`${user.organization_id}:${user.mentor_id}`}>
        <p className="text-sm text-slate-600">Mentor saat ini: <strong>{currentMentor ? currentMentor.biodata?.nama_lengkap || currentMentor.email : user.mentor_id ? "Mentor tidak aktif; silakan pilih kembali." : "Belum dipilih"}</strong></p>
        <label className="block text-sm font-semibold text-slate-700">Pilih mentor<select name="mentorId" defaultValue={currentMentor?.user_id.toString() ?? ""} className={inputClass}>
          <option value="">Tanpa mentor</option>{candidates.map(item => <option key={item.user_id.toString()} value={item.user_id.toString()}>{item.biodata?.nama_lengkap || item.email}{item.biodata?.nama_lengkap ? ` (${item.email})` : ""}</option>)}
        </select></label>
        {!candidates.length && <p className="text-sm text-slate-500">Belum ada anggota aktif lain yang dapat dipilih.</p>}
        <button className={buttonClass}>Simpan mentor</button>
      </ActionForm>}
    </section>
  </div>;
}
