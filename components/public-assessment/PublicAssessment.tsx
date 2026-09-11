"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";

import ProgressBar from "@/components/dashboard/assessment/ProgressBar";
import QuestionCard from "@/components/dashboard/assessment/QuestionCard";
import OptionSelector from "@/components/dashboard/assessment/OptionSelector";

type Owner = { ownerName: string; profession: string | null };
type Question = { question_id: string; question: string; question_order?: number; dimension?: { dimension_name: string }; question_option: Array<{ option_id: number; option_text: string }> };
type Progress = { current: number; total: number; answered: number; percentage: number };

export default function PublicAssessment({ token }: { token: string }) {
  const endpoint = `/api/public-assessment/${encodeURIComponent(token)}`;
  const [owner, setOwner] = useState<Owner | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(endpoint)
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setOwner(payload.data);
      })
      .catch((requestError) => setError(requestError.message ?? "Tautan tidak valid."))
      .finally(() => setLoading(false));
  }, [endpoint]);

  async function sendAction(action: "question" | "answer" | "finish", extra = {}) {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, session_token: sessionToken, ...extra }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message);
    return payload.data;
  }

  async function start(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evaluator_name: name, evaluator_relationship: relationship }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message);
      setSessionToken(payload.data.sessionToken);

      const first = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "question", session_token: payload.data.sessionToken }),
      }).then((result) => result.json());
      setQuestion(first.data.question);
      setProgress(first.data.progress);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Gagal memulai penilaian.");
    } finally {
      setSubmitting(false);
    }
  }

  async function answer(optionId: number) {
    if (!question || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await sendAction("answer", { question_id: question.question_id, option_id: optionId });
      setQuestion(data.question);
      setProgress(data.progress);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Jawaban gagal disimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function finish() {
    setSubmitting(true);
    setError("");
    try {
      await sendAction("finish");
      setFinished(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Penilaian gagal dikirim.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="text-center text-slate-500">Memuat penilaian…</div>;
  if (!owner) return <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg"><h1 className="text-2xl font-bold text-slate-900">Tautan tidak tersedia</h1><p className="mt-3 text-slate-500">{error}</p></div>;
  if (finished) return <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-lg"><CheckCircle2 className="mx-auto text-emerald-500" size={54} /><h1 className="mt-5 text-2xl font-bold text-slate-900">Terima kasih atas penilaian Anda</h1><p className="mt-3 leading-7 text-slate-500">Jawaban telah tersimpan dan akan membantu {owner.ownerName} memperoleh gambaran potensi yang lebih menyeluruh.</p></div>;

  if (!sessionToken) return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-lg sm:p-9">
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><ShieldCheck size={15} /> Tanpa login</span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Nilai potensi {owner.ownerName}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">Jawablah berdasarkan pengamatan Anda yang sebenarnya. Hasil akan digabungkan dengan penilaian lain.</p>
      {owner.profession && <p className="mt-3 text-sm font-semibold text-emerald-700">Profesi target: {owner.profession}</p>}
      <form onSubmit={start} className="mt-7 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">Nama Anda<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={120} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Contoh: Budi Santoso" /></label>
        <label className="block text-sm font-semibold text-slate-700">Hubungan dengan {owner.ownerName}<input value={relationship} onChange={(event) => setRelationship(event.target.value)} required minLength={2} maxLength={80} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Contoh: Rekan kerja, atasan, teman" /></label>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:bg-emerald-400">{submitting && <LoaderCircle className="animate-spin" size={18} />} Mulai penilaian</button>
      </form>
    </div>
  );

  if (!question) return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white p-9 text-center shadow-lg"><CheckCircle2 className="mx-auto text-emerald-600" size={48} /><h1 className="mt-4 text-2xl font-bold text-slate-900">Semua pertanyaan telah dijawab</h1><p className="mt-2 text-slate-500">Periksa kembali kesiapan Anda, lalu kirim penilaian.</p>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<button onClick={finish} disabled={submitting} className="mt-6 rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-400">{submitting ? "Mengirim…" : "Kirim penilaian"}</button></div>
  );

  return <div className={`mx-auto max-w-4xl space-y-6 rounded-3xl bg-white p-6 shadow-xl sm:p-8 ${submitting ? "pointer-events-none opacity-70" : ""}`}><ProgressBar current={progress?.current ?? 0} total={progress?.total ?? 0} percentage={progress?.percentage ?? 0} /><QuestionCard question={question} /><OptionSelector options={question.question_option ?? []} disabled={submitting} onSelect={answer} />{error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}</div>;
}
