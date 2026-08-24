import Link from "next/link";
import { ArrowLeft, BookOpen, BrainCircuit, CalendarRange, CheckCircle2, Compass, Flag, Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

type JsonMap = Record<string, unknown>;
function asList(value: unknown): JsonMap[] { return Array.isArray(value) ? value.filter((item): item is JsonMap => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : []; }
function text(value: unknown) { return typeof value === "string" || typeof value === "number" ? String(value) : "-"; }

export default async function UserRecommendationPage({ params }: { params: Promise<{ userId: string }> }) {
  await requireAdmin();
  const { userId } = await params;
  if (!/^\d+$/.test(userId)) notFound();
  const user = await prisma.users.findFirst({ where: { user_id: BigInt(userId), role: "USER" }, select: { email: true, biodata: { select: { nama_lengkap: true, profession: { select: { profession_name: true } }, assessment_ai_recommendation: true } } } });
  const rec = user?.biodata?.assessment_ai_recommendation;
  if (!user || !rec) notFound();
  const priorities = asList(rec.top_5_development_priorities);
  const roadmap = asList(rec.individual_career_roadmap);
  const plan = asList(rec.individual_development_plan);
  const learning = asList(rec.recommended_learning_path);
  const development = rec.development_recommendation as JsonMap | null;
  const commitment = rec.personal_commitment as JsonMap | null;

  return <div className="space-y-6">
    <Link href="/dashboard/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan-700"><ArrowLeft size={17}/>Kembali ke data pengguna</Link>
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 p-7 text-white shadow-xl sm:p-9"><div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"/><div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-cyan-200"><BrainCircuit size={14}/>Rekomendasi berbasis AI</span><h1 className="mt-5 text-3xl font-black">Rencana Pengembangan Individu</h1><p className="mt-2 text-slate-300">{user.biodata?.nama_lengkap || user.email} · {user.biodata?.profession?.profession_name || "SIPETA POLRI"}</p></div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Lightbulb size={21}/></div><div><h2 className="font-bold text-slate-900">Prioritas Pengembangan</h2><p className="text-xs text-slate-500">Fokus utama yang disarankan untuk peserta</p></div></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{priorities.map((item,index)=><article key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{index+1}</div><h3 className="font-bold text-slate-900">{text(item.title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text(item.description || item.reason)}</p></article>)}</div></section>
    {development && <section className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-6"><h2 className="flex items-center gap-2 font-bold text-cyan-950"><Compass size={20}/>Arahan Pengembangan</h2><p className="mt-3 text-sm leading-7 text-slate-700">{text(development.summary)}</p>{Array.isArray(development.recommendations)&&<ul className="mt-4 grid gap-2 md:grid-cols-2">{development.recommendations.map((item,index)=><li key={index} className="flex gap-2 rounded-lg bg-white p-3 text-sm text-slate-700"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-cyan-600"/>{text(item)}</li>)}</ul>}</section>}
    <section className="grid gap-5 xl:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 flex items-center gap-2 font-bold text-slate-900"><CalendarRange size={20} className="text-violet-600"/>Roadmap Karier</h2><div className="space-y-3">{roadmap.map((item,index)=><div key={index} className="flex gap-4 rounded-xl bg-violet-50/60 p-4"><div className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-violet-600 px-2 text-sm font-black text-white">{text(item.year)}</div><div><p className="font-bold text-slate-900">{text(item.focus)}</p><p className="mt-1 text-sm text-slate-600">Target: {text(item.target)}</p></div></div>)}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 flex items-center gap-2 font-bold text-slate-900"><Flag size={20} className="text-emerald-600"/>Rencana Aksi</h2><div className="space-y-3">{plan.map((item,index)=><div key={index} className="rounded-xl border border-slate-100 p-4"><p className="font-bold text-slate-900">{text(item.activity)}</p><div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">{text(item.timeline)}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{text(item.indicator)}</span></div></div>)}</div></div></section>
    {learning.length>0&&<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 flex items-center gap-2 font-bold text-slate-900"><BookOpen size={20} className="text-blue-600"/>Learning Path</h2><div className="grid gap-3 md:grid-cols-2">{learning.map((item,index)=><div key={index} className="rounded-xl border border-blue-100 bg-blue-50/50 p-4"><h3 className="font-bold text-slate-900">{text(item.title)}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text(item.description)}</p></div>)}</div></section>}
    {commitment&&<section className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-7 text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Komitmen personal</p><h2 className="mt-3 text-xl font-black">{text(commitment.title)}</h2><p className="mt-3 max-w-3xl text-sm italic leading-7 text-slate-300">“{text(commitment.statement)}”</p></section>}
  </div>;
}
