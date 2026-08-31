"use client";

import { useActionState, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";

import {
  createQuestion, createQuestionOption, deleteQuestion, deleteQuestionOption,
  updateQuestion, updateQuestionOption, type QuestionActionState,
} from "@/app/dashboard/admin/questions/actions";

type Dimension = { id: string; name: string; professionName: string };
type Option = { id: number; text: string; orderNo: number; weight: number; answerCount: number };
type Question = { id: string; text: string; orderNo: number | null; dimensionId: string; dimensionName: string; professionName: string; answerCount: number; options: Option[] };
const initialState: QuestionActionState = { success: false, message: "" };
const inputClass = "block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-cyan-500";

function Feedback({ state }: { state: QuestionActionState }) {
  if (!state.message) return null;
  return <p aria-live="polite" className={`rounded-xl px-4 py-3 text-sm font-medium ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>;
}

function WeightSelect({ defaultValue = 0 }: { defaultValue?: number }) {
  return <select name="weight" required defaultValue={defaultValue} className={inputClass}><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>;
}

export default function QuestionManager({ questions, dimensions }: { questions: Question[]; dimensions: Dimension[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingOption, setEditingOption] = useState<{ question: Question; option: Option } | null>(null);
  const [createState, createAction, createPending] = useActionState(createQuestion, initialState);
  const [updateState, updateAction, updatePending] = useActionState(updateQuestion, initialState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteQuestion, initialState);
  const [createOptionState, createOptionAction, createOptionPending] = useActionState(createQuestionOption, initialState);
  const [updateOptionState, updateOptionAction, updateOptionPending] = useActionState(updateQuestionOption, initialState);
  const [deleteOptionState, deleteOptionAction, deleteOptionPending] = useActionState(deleteQuestionOption, initialState);

  return <div className="space-y-6">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-700"><Plus size={20}/></div><div><h2 className="font-bold text-slate-900">Tambah Pertanyaan</h2><p className="text-xs text-slate-500">Opsi jawaban dapat ditambahkan setelah pertanyaan tersimpan.</p></div></div>
      <form action={createAction} className="grid gap-4 lg:grid-cols-[1fr_2fr_120px_auto] lg:items-end">
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">Dimensi<select name="dimensionId" required defaultValue="" className={inputClass}><option value="" disabled>Pilih dimensi</option>{dimensions.map(item=><option key={item.id} value={item.id}>{item.professionName} — {item.name}</option>)}</select></label>
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">Pertanyaan<textarea name="questionText" required rows={2} placeholder="Tuliskan pertanyaan" className={inputClass}/></label>
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">Urutan<input name="questionOrder" type="number" min={0} placeholder="Opsional" className={inputClass}/></label>
        <button disabled={createPending || !dimensions.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Plus size={17}/>{createPending ? "Menyimpan..." : "Tambah"}</button>
      </form>
      {!dimensions.length && <p className="mt-3 text-sm text-amber-700">Belum ada dimensi. Tambahkan dimensi terlebih dahulu.</p>}
      <div className="mt-4"><Feedback state={createState}/></div>
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Daftar Pertanyaan</h2><p className="text-xs text-slate-500">{questions.length} pertanyaan tersimpan</p></div>
      {(updateState.message || deleteState.message || createOptionState.message || updateOptionState.message || deleteOptionState.message) && <div className="p-4 pb-0"><Feedback state={updateState.message ? updateState : deleteState.message ? deleteState : createOptionState.message ? createOptionState : updateOptionState.message ? updateOptionState : deleteOptionState}/></div>}
      <div className="divide-y divide-slate-100">{questions.map(item => <article key={item.id}>
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
          <button type="button" onClick={()=>setExpanded(expanded === item.id ? null : item.id)} aria-expanded={expanded === item.id} className="flex min-w-0 flex-1 items-start gap-3 text-left">
            <span className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-500">{expanded === item.id ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}</span>
            <span className="min-w-0"><span className="block text-xs font-bold uppercase tracking-wide text-cyan-700">{item.professionName} · {item.dimensionName} · Urutan {item.orderNo ?? "-"}</span><span className="mt-1 block font-bold text-slate-900">{item.text}</span><span className="mt-1 block text-xs text-slate-500">{item.options.length} opsi · {item.answerCount} jawaban</span></span>
          </button>
          <div className="flex gap-2 lg:justify-end"><button onClick={()=>setEditingQuestion(item)} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700"><Pencil size={14}/>Ubah</button><form action={deleteAction} onSubmit={event=>{if(!window.confirm(`Hapus pertanyaan “${item.text}” beserta seluruh opsinya?`)) event.preventDefault();}}><input type="hidden" name="questionId" value={item.id}/><button disabled={deletePending || item.answerCount > 0} title={item.answerCount ? "Pertanyaan sudah memiliki jawaban" : "Hapus pertanyaan"} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-40"><Trash2 size={14}/>Hapus</button></form></div>
        </div>
        {expanded === item.id && <div className="border-t border-slate-100 bg-slate-50/70 p-5">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Urutan</th><th className="px-4 py-3">Opsi jawaban</th><th className="px-4 py-3">Weight</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{item.options.map(option=><tr key={option.id}><td className="px-4 py-3">{option.orderNo}</td><td className="px-4 py-3 font-medium text-slate-800">{option.text}</td><td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">{option.weight}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={()=>setEditingOption({ question: item, option })} className="rounded-lg bg-cyan-50 p-2 text-cyan-700" aria-label="Ubah opsi"><Pencil size={14}/></button><form action={deleteOptionAction} onSubmit={event=>{if(!window.confirm(`Hapus opsi “${option.text}”?`)) event.preventDefault();}}><input type="hidden" name="optionId" value={option.id}/><button disabled={deleteOptionPending || option.answerCount > 0} title={option.answerCount ? "Opsi sudah pernah dipilih" : "Hapus opsi"} className="rounded-lg bg-red-50 p-2 text-red-700 disabled:opacity-40" aria-label="Hapus opsi"><Trash2 size={14}/></button></form></div></td></tr>)}{!item.options.length&&<tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Belum ada opsi jawaban.</td></tr>}</tbody></table></div>
          <form action={createOptionAction} className="mt-4 grid gap-3 md:grid-cols-[100px_1fr_110px_auto] md:items-end"><input type="hidden" name="questionId" value={item.id}/><label className="space-y-1 text-xs font-bold text-slate-600">Urutan<input name="optionOrder" type="number" min={0} required defaultValue={item.options.length + 1} className={inputClass}/></label><label className="space-y-1 text-xs font-bold text-slate-600">Opsi jawaban<input name="optionText" required placeholder="Teks opsi" className={inputClass}/></label><label className="space-y-1 text-xs font-bold text-slate-600">Weight<WeightSelect/></label><button disabled={createOptionPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Plus size={16}/>Tambah opsi</button></form>
        </div>}
      </article>)}{!questions.length && <p className="px-5 py-14 text-center text-slate-500">Belum ada pertanyaan.</p>}</div>
    </section>

    {editingQuestion && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex justify-between"><div><h2 className="text-xl font-black text-slate-900">Ubah Pertanyaan</h2><p className="text-sm text-slate-500">Perbarui dimensi, pertanyaan, atau urutannya.</p></div><button onClick={()=>setEditingQuestion(null)} aria-label="Tutup"><X/></button></div><form action={updateAction} className="space-y-4"><input type="hidden" name="questionId" value={editingQuestion.id}/><label className="block space-y-1.5 text-sm font-semibold">Dimensi<select name="dimensionId" required defaultValue={editingQuestion.dimensionId} className={inputClass}>{dimensions.map(item=><option key={item.id} value={item.id}>{item.professionName} — {item.name}</option>)}</select></label><label className="block space-y-1.5 text-sm font-semibold">Pertanyaan<textarea name="questionText" required rows={4} defaultValue={editingQuestion.text} className={inputClass}/></label><label className="block space-y-1.5 text-sm font-semibold">Urutan<input name="questionOrder" type="number" min={0} defaultValue={editingQuestion.orderNo ?? ""} className={inputClass}/></label><Feedback state={updateState}/><div className="flex justify-end gap-3"><button type="button" onClick={()=>setEditingQuestion(null)} className="px-4 py-2.5 text-sm font-bold">Batal</button><button disabled={updatePending} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"><Save size={16}/>{updatePending ? "Menyimpan..." : "Simpan"}</button></div></form></div></div>}

    {editingOption && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-5 flex justify-between"><div><h2 className="text-xl font-black text-slate-900">Ubah Opsi Jawaban</h2><p className="text-sm text-slate-500">Weight hanya dapat dipilih 0, 1, atau 2.</p></div><button onClick={()=>setEditingOption(null)} aria-label="Tutup"><X/></button></div><form action={updateOptionAction} className="space-y-4"><input type="hidden" name="optionId" value={editingOption.option.id}/><input type="hidden" name="questionId" value={editingOption.question.id}/><label className="block space-y-1.5 text-sm font-semibold">Opsi jawaban<input name="optionText" required defaultValue={editingOption.option.text} className={inputClass}/></label><div className="grid grid-cols-2 gap-4"><label className="block space-y-1.5 text-sm font-semibold">Urutan<input name="optionOrder" type="number" min={0} required defaultValue={editingOption.option.orderNo} className={inputClass}/></label><label className="block space-y-1.5 text-sm font-semibold">Weight<WeightSelect defaultValue={editingOption.option.weight}/></label></div><Feedback state={updateOptionState}/><div className="flex justify-end gap-3"><button type="button" onClick={()=>setEditingOption(null)} className="px-4 py-2.5 text-sm font-bold">Batal</button><button disabled={updateOptionPending} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"><Save size={16}/>{updateOptionPending ? "Menyimpan..." : "Simpan"}</button></div></form></div></div>}
  </div>;
}
