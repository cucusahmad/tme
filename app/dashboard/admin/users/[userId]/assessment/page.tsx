import Link from "next/link";
import { ArrowLeft, Award, BarChart3, CheckCircle2, Trophy } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default async function UserAssessmentPage({ params }: { params: Promise<{ userId: string }> }) {
  await requireAdmin();
  const { userId } = await params;
  if (!/^\d+$/.test(userId)) notFound();

  const user = await prisma.users.findFirst({
    where: { user_id: BigInt(userId), role: "USER" },
    select: {
      email: true,
      biodata: {
        select: {
          nama_lengkap: true,
          profession: { select: { profession_name: true } },
          assessment: {
            where: { status: "COMPLETED" }, orderBy: { completed_at: "desc" }, take: 1,
            select: {
              completed_at: true,
              assessment_dimension_result: { select: { percentage: true, dimension: { select: { dimension_name: true } } }, orderBy: { dimension: { order_no: "asc" } } },
              assessment_result: { select: { percentage: true, rank_order: true, is_recommended: true, profession_unit: { select: { unit_name: true } } }, orderBy: { rank_order: "asc" } },
            },
          },
        },
      },
    },
  });
  if (!user) notFound();
  const assessment = user.biodata?.assessment[0];
  if (!assessment) notFound();
  const best = assessment.assessment_result[0];
  const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" });

  return <div className="space-y-6">
    <Link href="/dashboard/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan-700"><ArrowLeft size={17}/>Kembali ke data pengguna</Link>
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-7 text-white shadow-xl sm:p-9"><div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl"/><div className="relative"><span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-300"><CheckCircle2 size={14}/>Assessment selesai</span><h1 className="mt-5 text-3xl font-black">{user.biodata?.nama_lengkap || "Pengguna"}</h1><p className="mt-1 text-sm text-slate-300">{user.email} · {user.biodata?.profession?.profession_name || "Profesi belum dipilih"}</p><p className="mt-5 text-xs text-slate-400">Diselesaikan {assessment.completed_at ? date.format(assessment.completed_at) : "-"}</p></div></section>
    {best && <section className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700"><Trophy size={16}/>Rekomendasi utama</p><h2 className="mt-2 text-2xl font-black text-slate-900">{best.profession_unit.unit_name}</h2><p className="mt-1 text-sm text-slate-600">Unit profesi dengan tingkat kecocokan tertinggi.</p></div><div className="text-left sm:text-right"><p className="text-4xl font-black text-amber-600">{Number(best.percentage).toFixed(1)}%</p><p className="text-xs font-semibold text-slate-500">tingkat kecocokan</p></div></section>}
    <section className="grid gap-5 xl:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-700"><BarChart3 size={20}/></div><div><h2 className="font-bold text-slate-900">Skor Dimensi</h2><p className="text-xs text-slate-500">Pencapaian kompetensi per dimensi</p></div></div><div className="space-y-5">{assessment.assessment_dimension_result.map((item)=><div key={item.dimension.dimension_name}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-700">{item.dimension.dimension_name}</span><span className="font-bold text-slate-900">{Number(item.percentage).toFixed(1)}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{width:`${Math.min(Number(item.percentage),100)}%`}}/></div></div>)}</div></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="flex items-center gap-2 font-bold text-slate-900"><Award size={20} className="text-violet-600"/>Peringkat Pemetaan Talenta</h2><p className="mt-1 text-xs text-slate-500">Urutan seluruh unit profesi yang sesuai</p></div><div className="divide-y divide-slate-100">{assessment.assessment_result.map((item,index)=><div key={`${item.profession_unit.unit_name}-${index}`} className="flex items-center gap-4 px-6 py-4"><div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${index===0?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-600"}`}>#{item.rank_order || index+1}</div><p className="flex-1 font-semibold text-slate-800">{item.profession_unit.unit_name}</p><span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-bold text-cyan-700">{Number(item.percentage).toFixed(1)}%</span></div>)}</div></div></section>
  </div>;
}
