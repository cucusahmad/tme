"use client";

import { useActionState, useId, useRef, useState } from "react";
import { Settings, X } from "lucide-react";
import { assignUserMentor, type OrganizationActionState } from "@/app/dashboard/admin/organizations/actions";

export default function UserMentorForm({ userId, userName, organizationId, mentorId, candidates }: {
  userId: string;
  userName: string;
  organizationId: string;
  mentorId: string;
  candidates: { id: string; name: string; email: string }[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState("");
  const [state, action, pending] = useActionState(async (previous: OrganizationActionState, form: FormData) => {
    const result = await assignUserMentor(previous, form);
    if (result.success) dialog.current?.close();
    return result;
  }, { success: false, message: "" });
  const options = organizationId ? candidates.filter(item => item.id !== userId) : [];
  const matches = options.filter(item => `${item.name} ${item.email}`.toLocaleLowerCase("id").includes(query.trim().toLocaleLowerCase("id")));

  return <div>
    <button type="button" onClick={() => { setQuery(""); dialog.current?.showModal(); }} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100">
      <Settings size={14} />Setting Mentor
    </button>
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={event => { if (pending) event.preventDefault(); }} className="fixed inset-0 m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/50">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><h2 id={titleId} className="text-xl font-bold">Setting Mentor</h2><p className="mt-1 text-sm text-slate-500">Pilih mentor untuk {userName} dari anggota organisasi yang sama.</p></div>
        <button type="button" disabled={pending} onClick={() => dialog.current?.close()} aria-label="Tutup pengaturan mentor" className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50"><X size={20} /></button>
      </div>
      {!organizationId ? <p className="text-sm text-slate-500">Simpan organisasi pengguna terlebih dahulu untuk memilih mentor.</p> : <form action={action}>
        <input type="hidden" name="userId" value={userId} />
        <fieldset disabled={pending} className="space-y-4 disabled:opacity-60">
          <label className="block text-sm font-semibold">Cari nama mentor<input autoFocus type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ketik nama atau email..." className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal" /></label>
          <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
            {matches.map(item => <li key={item.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0"><p className="break-words text-sm font-semibold">{item.name}</p><p className="break-all text-xs text-slate-500">{item.email}</p></div>
              <button type="submit" name="mentorId" value={item.id} disabled={item.id === mentorId} className="shrink-0 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">{item.id === mentorId ? "Mentor saat ini" : "Pilih Mentor"}</button>
            </li>)}
          </ul>
          {!matches.length && <p className="text-sm text-slate-500">{options.length ? "Nama tidak ditemukan dalam organisasi ini." : "Belum ada anggota lain yang dapat dipilih sebagai mentor."}</p>}
          {mentorId && <button type="submit" name="mentorId" value="" className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">Hapus mentor</button>}
        </fieldset>
      </form>}
      <p role="status" className={`mt-3 text-sm ${state.success ? "text-emerald-700" : "text-red-700"}`}>{pending ? "Menyimpan mentor..." : state.message}</p>
    </dialog>
    {state.success && <p role="status" className="mt-1 text-xs text-emerald-700">{state.message}</p>}
  </div>;
}
