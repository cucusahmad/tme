"use client";

import { useActionState, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

import {
  createDimension,
  deleteDimension,
  updateDimension,
  type DimensionActionState,
} from "@/app/dashboard/admin/dimensions/actions";

type Profession = { id: string; name: string };
type Dimension = {
  id: string;
  name: string;
  orderNo: number | null;
  professionId: string;
  professionName: string;
  questionCount: number;
  usageCount: number;
};

const initialState: DimensionActionState = { success: false, message: "" };

function Feedback({ state }: { state: DimensionActionState }) {
  if (!state.message) return null;
  return <p aria-live="polite" className={`rounded-xl px-4 py-3 text-sm font-medium ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>;
}

export default function DimensionManager({ dimensions, professions }: { dimensions: Dimension[]; professions: Profession[] }) {
  const [editing, setEditing] = useState<Dimension | null>(null);
  const [createState, createAction, createPending] = useActionState(createDimension, initialState);
  const [updateState, updateAction, updatePending] = useActionState(updateDimension, initialState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteDimension, initialState);

  return <div className="space-y-6">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><Plus size={20}/></div><div><h2 className="font-bold text-slate-900">Tambah Dimensi</h2><p className="text-xs text-slate-500">Tentukan profesi, nama, dan urutan tampil.</p></div></div>
      <form action={createAction} className="grid gap-4 md:grid-cols-[1fr_1.4fr_140px_auto] md:items-end">
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">Profesi<select name="professionId" required defaultValue="" className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500"><option value="" disabled>Pilih profesi</option>{professions.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">Nama dimensi<input name="dimensionName" required maxLength={100} placeholder="Contoh: Kepemimpinan" className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500"/></label>
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">Urutan<input name="orderNo" type="number" min={0} placeholder="Opsional" className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500"/></label>
        <button disabled={createPending || !professions.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17}/>{createPending ? "Menyimpan..." : "Tambah"}</button>
      </form>
      {!professions.length && <p className="mt-3 text-sm text-amber-700">Belum ada profesi. Tambahkan profesi terlebih dahulu.</p>}
      <div className="mt-4"><Feedback state={createState}/></div>
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Daftar Dimensi</h2><p className="text-xs text-slate-500">{dimensions.length} dimensi tersimpan</p></div>
      {(updateState.message || deleteState.message) && <div className="p-4 pb-0"><Feedback state={updateState.message ? updateState : deleteState}/></div>}
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Urutan</th><th className="px-5 py-4">Dimensi</th><th className="px-5 py-4">Profesi</th><th className="px-5 py-4">Pertanyaan</th><th className="px-5 py-4 text-right">Aksi</th></tr></thead>
      <tbody className="divide-y divide-slate-100">{dimensions.map(item=><tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-4 text-slate-500">{item.orderNo ?? "-"}</td><td className="px-5 py-4 font-bold text-slate-900">{item.name}</td><td className="px-5 py-4 text-slate-600">{item.professionName}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{item.questionCount} pertanyaan</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={()=>setEditing(item)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"><Pencil size={14}/>Ubah</button><form action={deleteAction} onSubmit={(event)=>{if(!window.confirm(`Hapus dimensi “${item.name}”?`)) event.preventDefault();}}><input type="hidden" name="dimensionId" value={item.id}/><button disabled={deletePending || item.usageCount > 0} title={item.usageCount > 0 ? "Dimensi masih memiliki data terkait" : "Hapus dimensi"} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={14}/>Hapus</button></form></div></td></tr>)}{!dimensions.length&&<tr><td colSpan={5} className="px-5 py-14 text-center text-slate-500">Belum ada dimensi.</td></tr>}</tbody></table></div>
    </section>

    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-dimension-title"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-start justify-between"><div><h2 id="edit-dimension-title" className="text-xl font-black text-slate-900">Ubah Dimensi</h2><p className="mt-1 text-sm text-slate-500">Perbarui informasi dimensi yang dipilih.</p></div><button onClick={()=>setEditing(null)} aria-label="Tutup" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button></div><form action={updateAction} className="space-y-4"><input type="hidden" name="dimensionId" value={editing.id}/><label className="block space-y-1.5 text-sm font-semibold text-slate-700">Profesi<select name="professionId" required defaultValue={editing.professionId} className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500">{professions.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="block space-y-1.5 text-sm font-semibold text-slate-700">Nama dimensi<input name="dimensionName" required maxLength={100} defaultValue={editing.name} className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500"/></label><label className="block space-y-1.5 text-sm font-semibold text-slate-700">Urutan<input name="orderNo" type="number" min={0} defaultValue={editing.orderNo ?? ""} className="block w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-emerald-500"/></label><Feedback state={updateState}/><div className="flex justify-end gap-3 pt-2"><button type="button" onClick={()=>setEditing(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">Batal</button><button disabled={updatePending} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Save size={16}/>{updatePending ? "Menyimpan..." : "Simpan"}</button></div></form></div></div>}
  </div>;
}
