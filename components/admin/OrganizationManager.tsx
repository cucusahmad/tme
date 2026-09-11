"use client";

import { useActionState } from "react";
import { saveOrganization, saveSupervisors, type OrganizationActionState } from "@/app/dashboard/admin/organizations/actions";

type Organization = { id: string; name: string; description: string | null; memberCount: number; supervisorCount: number; members: { id: string; name: string; email: string; supervisor: boolean }[] };
const initialState: OrganizationActionState = { success: false, message: "" };
const fieldClass = "mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal text-slate-900 focus:border-emerald-500";

function OrganizationForm({ organization }: { organization?: Organization }) {
  const [state, action, pending] = useActionState(saveOrganization, initialState);
  return <form action={action} className="space-y-4">
    {organization && <input type="hidden" name="organizationId" value={organization.id} />}
    <fieldset disabled={pending} className="space-y-4 disabled:opacity-60">
      <label className="block text-sm font-semibold text-slate-700">Nama organisasi<input name="name" required maxLength={150} defaultValue={organization?.name ?? ""} className={fieldClass} /></label>
      <label className="block text-sm font-semibold text-slate-700">Deskripsi<textarea name="description" maxLength={2000} defaultValue={organization?.description ?? ""} rows={2} className={fieldClass} /></label>
      <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">{pending ? "Menyimpan..." : organization ? "Simpan perubahan" : "Tambah organisasi"}</button>
    </fieldset>
    <p role="status" className={`text-sm ${state.success ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>
  </form>;
}

function SupervisorForm({ organization }: { organization: Organization }) {
  const [state, action, pending] = useActionState(saveSupervisors, initialState);
  return <form action={action} className="mt-6 space-y-3 border-t border-slate-100 pt-5">
    <input type="hidden" name="organizationId" value={organization.id} />
    <fieldset disabled={pending} className="space-y-3 disabled:opacity-60">
      <legend className="mb-2 text-sm font-bold text-slate-900">Supervisor organisasi</legend>
      <p className="text-xs text-slate-500">Centang anggota yang menjadi supervisor. Hapus centang untuk mengembalikannya menjadi anggota.</p>
      {!organization.members.length && <p className="text-sm text-slate-500">Belum ada anggota. Tetapkan organisasi anggota di Data Pengguna terlebih dahulu.</p>}
      <div className="max-h-64 space-y-2 overflow-y-auto">{organization.members.map(member => <label key={member.id} className="flex items-center gap-3 text-sm text-slate-700">
        <input type="checkbox" name="supervisorIds" value={member.id} defaultChecked={member.supervisor} className="h-4 w-4" />
        <span>{member.name} <span className="text-xs text-slate-500">({member.email})</span></span>
      </label>)}</div>
      <button disabled={!organization.members.length} className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60">{pending ? "Menyimpan..." : "Simpan supervisor"}</button>
    </fieldset>
    <p role="status" className={`text-sm ${state.success ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>
  </form>;
}

export default function OrganizationManager({ organizations }: { organizations: Organization[] }) {
  return <div className="space-y-6">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Tambah Organisasi</h2>
      <OrganizationForm />
    </section>
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900">Daftar Organisasi ({organizations.length})</h2>
      {!organizations.length && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Belum ada organisasi. Tambahkan organisasi untuk mulai menetapkan anggota dan supervisor.</p>}
      {organizations.map(organization => <details key={`${organization.id}:${organization.name}:${organization.description}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <summary className="cursor-pointer font-semibold text-slate-900">{organization.name}<span className="ml-3 text-xs font-normal text-slate-500">{organization.memberCount} pengguna · {organization.supervisorCount} supervisor · Klik untuk mengubah</span></summary>
        <div className="mt-5"><OrganizationForm organization={organization} /><SupervisorForm key={organization.members.map(member => `${member.id}:${member.supervisor}`).join(",")} organization={organization} /></div>
      </details>)}
    </section>
  </div>;
}
