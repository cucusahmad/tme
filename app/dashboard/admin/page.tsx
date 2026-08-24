import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [totalUsers, activeUsers, completedProfiles, completedAssessments, recommendations, recentUsers] =
    await Promise.all([
      prisma.users.count({ where: { role: "USER" } }),
      prisma.users.count({ where: { role: "USER", is_active: true } }),
      prisma.biodata.count({ where: { users: { role: "USER" } } }),
      prisma.assessment.count({ where: { status: "COMPLETED" } }),
      prisma.assessment_ai_recommendation.count(),
      prisma.users.findMany({
        where: { role: "USER" },
        take: 5,
        orderBy: { created_at: "desc" },
        select: {
          user_id: true,
          email: true,
          created_at: true,
          biodata: {
            select: {
              nama_lengkap: true,
              assessment: { orderBy: { created_at: "desc" }, take: 1, select: { status: true } },
              assessment_ai_recommendation: { select: { ai_recommendation_id: true } },
            },
          },
        },
      }),
    ]);

  const completionRate = totalUsers ? Math.round((completedAssessments / totalUsers) * 100) : 0;
  const profileRate = totalUsers ? Math.round((completedProfiles / totalUsers) * 100) : 0;
  const cards = [
    { label: "Total Pengguna", value: totalUsers, note: `${activeUsers} akun aktif`, icon: Users, tone: "from-blue-500 to-indigo-600", soft: "bg-blue-50 text-blue-600" },
    { label: "Profil Lengkap", value: completedProfiles, note: `${profileRate}% dari pengguna`, icon: UserCheck, tone: "from-violet-500 to-fuchsia-600", soft: "bg-violet-50 text-violet-600" },
    { label: "Assessment Selesai", value: completedAssessments, note: `${completionRate}% tingkat selesai`, icon: ClipboardCheck, tone: "from-emerald-500 to-teal-600", soft: "bg-emerald-50 text-emerald-600" },
    { label: "Rekomendasi AI", value: recommendations, note: "Telah berhasil dibuat", icon: BrainCircuit, tone: "from-amber-400 to-orange-600", soft: "bg-amber-50 text-amber-600" },
  ];
  const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-200 sm:px-9">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              <Sparkles size={14} /> Pusat kontrol SIPETA POLRI
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Selamat datang, Administrator</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Pantau perkembangan peserta, hasil assessment, dan rekomendasi talenta dalam satu tampilan.</p>
          </div>
          <Link href="/dashboard/admin/users" className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
            Kelola pengguna <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon, tone, soft }) => (
          <article key={label} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
            <div className="flex items-start justify-between">
              <div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</p></div>
              <div className={`rounded-xl p-3 ${soft}`}><Icon size={22} /></div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500"><TrendingUp size={14} className="text-emerald-500" />{note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div><h2 className="font-bold text-slate-900">Pengguna terbaru</h2><p className="mt-1 text-xs text-slate-500">Aktivitas pendaftaran terkini</p></div>
            <Link href="/dashboard/admin/users" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">Lihat semua</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentUsers.map((user) => {
              const completed = user.biodata?.assessment[0]?.status === "COMPLETED";
              return <div key={user.user_id.toString()} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 font-bold text-cyan-700">{(user.biodata?.nama_lengkap || user.email).charAt(0).toUpperCase()}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{user.biodata?.nama_lengkap || "Profil belum dilengkapi"}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div>
                <div className="hidden text-right sm:block"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${completed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{completed ? <CheckCircle2 size={12}/> : <Clock3 size={12}/>} {completed ? "Selesai" : "Belum selesai"}</span><p className="mt-1 text-[11px] text-slate-400">{user.created_at ? dateFormatter.format(user.created_at) : "-"}</p></div>
              </div>;
            })}
            {!recentUsers.length && <p className="px-6 py-12 text-center text-sm text-slate-500">Belum ada pengguna.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Progres keseluruhan</h2><p className="mt-1 text-xs text-slate-500">Kesiapan data peserta saat ini</p>
          <div className="mt-7 space-y-6">
            {[{ label: "Kelengkapan profil", value: profileRate, color: "bg-violet-500" }, { label: "Assessment selesai", value: completionRate, color: "bg-emerald-500" }, { label: "Rekomendasi tersedia", value: totalUsers ? Math.round((recommendations / totalUsers) * 100) : 0, color: "bg-cyan-500" }].map((item) => (
              <div key={item.label}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-600">{item.label}</span><span className="font-bold text-slate-900">{item.value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.min(item.value, 100)}%` }} /></div></div>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><span className="font-bold text-slate-900">{Math.max(totalUsers - completedAssessments, 0)} pengguna</span> masih perlu menyelesaikan assessment.</div>
        </div>
      </section>
    </div>
  );
}
