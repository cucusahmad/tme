"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  RefreshCw,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

import api from "@/lib/api";
import AssessmentShareCard from "@/components/dashboard/AssessmentShareCard";

type Biodata = Record<string, unknown> & {
  nama_lengkap?: string | null;
};

type ResultData = {
  recommendation?: {
    percentage?: number;
    profession_unit?: { unit_name?: string };
  } | null;
  ranking?: unknown[];
  dimensions?: unknown[];
};

const profileFields = [
  "nama_lengkap",
  "jenis_kelamin",
  "tempat_lahir",
  "tanggal_lahir",
  "alamat",
  "kabupaten_kota",
  "provinsi",
  "no_hp",
  "email",
  "education_level_id",
  "jurusan",
  "status_pekerjaan",
  "profession_id",
] as const;

function hasValue(value: unknown) {
  return value !== null && value !== undefined && value !== "";
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  description: string;
  tone: "blue" | "indigo" | "emerald" | "amber";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone]}`}>
          <Icon size={21} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Biodata | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [hasRecommendation, setHasRecommendation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadDashboard() {
    const responses = await Promise.allSettled([
      api.get("/profile"),
      api.get("/assessment/result"),
      api.get("/assessment/recommendation"),
    ]);

    const [profileResponse, resultResponse, recommendationResponse] = responses;

    if (profileResponse.status === "fulfilled") {
      setProfile(profileResponse.value.data.data ?? null);
    } else {
      setError(true);
    }

    if (resultResponse.status === "fulfilled") {
      setResult(resultResponse.value.data.data ?? null);
    }

    setHasRecommendation(
      recommendationResponse.status === "fulfilled" &&
        Boolean(recommendationResponse.value.data.data),
    );
    setLoading(false);
  }

  function reloadDashboard() {
    setLoading(true);
    setError(false);
    void loadDashboard();
  }

  useEffect(() => {
    // Data dashboard disinkronkan sekali saat halaman dibuka.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard();
  }, []);

  const profileProgress = useMemo(() => {
    const completed = profile
      ? profileFields.filter((field) => hasValue(profile[field])).length
      : 0;
    return {
      completed,
      percent: Math.round((completed / profileFields.length) * 100),
    };
  }, [profile]);

  const profilePercent = profileProgress.percent;
  const assessmentComplete = Boolean(result?.dimensions?.length || result?.ranking?.length);
  const topMatch = result?.recommendation;
  const overallProgress = Math.round(
    (profilePercent + (assessmentComplete ? 100 : 0) + (hasRecommendation ? 100 : 0)) / 3,
  );
  const firstName = profile?.nama_lengkap?.trim().split(/\s+/)[0];

  const steps = [
    {
      title: "Lengkapi biodata",
      description: `${profilePercent}% data profil sudah terisi`,
      href: "/dashboard/profile",
      complete: profilePercent === 100,
    },
    {
      title: "Kerjakan assessment",
      description: assessmentComplete ? "Assessment sudah selesai" : "Temukan kekuatan dan potensi Anda",
      href: "/dashboard/assessment",
      complete: assessmentComplete,
    },
    {
      title: "Lihat kecocokan profesi Anda",
      description: assessmentComplete ? "Hasil Anda sudah tersedia" : "Tersedia setelah assessment selesai",
      href: "/dashboard/result",
      complete: assessmentComplete,
    },
    {
      title: "Susun roadmap pengembangan",
      description: hasRecommendation ? "Rekomendasi personal sudah tersedia" : "Dapatkan arah pengembangan berikutnya",
      href: "/dashboard/recommendation",
      complete: hasRecommendation,
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-6" aria-label="Memuat dashboard">
        <div className="h-64 rounded-3xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-40 rounded-2xl bg-slate-200" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-6">
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
          <span>Beberapa data dashboard belum berhasil dimuat.</span>
          <button onClick={reloadDashboard} className="inline-flex items-center gap-2 font-semibold hover:text-amber-700">
            <RefreshCw size={15} /> Coba lagi
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07182d] px-6 py-8 text-white shadow-2xl shadow-slate-900/15 sm:px-8 sm:py-10 lg:px-10">
        <div className="talent-dashboard-grid absolute inset-0 opacity-60" />
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
              <Sparkles size={14} /> Talent journey Anda
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Selamat datang{firstName ? `, ${firstName}` : ""}!
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Kenali potensi terbaik Anda dan lanjutkan setiap tahap untuk mendapatkan rekomendasi karier yang lebih personal.
            </p>
            <Link href={profilePercent < 100 ? "/dashboard/profile" : assessmentComplete ? "/dashboard/result" : "/dashboard/assessment"} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#07182d] shadow-lg shadow-amber-950/30 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200">
              {profilePercent < 100 ? "Lengkapi biodata" : assessmentComplete ? "Lihat hasil assessment" : "Mulai assessment"}
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-300">Progress keseluruhan</p>
                <p className="mt-1 text-4xl font-bold">{overallProgress}<span className="text-xl text-amber-300">%</span></p>
              </div>
              <Target className="text-amber-300" size={28} />
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Progress keseluruhan" aria-valuenow={overallProgress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-[width] duration-700" style={{ width: `${overallProgress}%` }} />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">Berdasarkan biodata, assessment, dan rekomendasi Anda.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="summary-title">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="summary-title" className="text-xl font-bold text-slate-900">Ringkasan Anda</h2>
            <p className="mt-1 text-sm text-slate-500">Pantau perkembangan terbaru dalam satu tampilan.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={UserRound} label="Kelengkapan biodata" value={`${profilePercent}%`} description={profilePercent === 100 ? "Biodata sudah lengkap" : `${profileFields.length - profileProgress.completed} bagian perlu dilengkapi`} tone="blue" />
          <MetricCard icon={ClipboardList} label="Assessment" value={assessmentComplete ? "Selesai" : "Belum"} description={assessmentComplete ? "Hasil assessment tersedia" : "Assessment belum dikerjakan"} tone="indigo" />
          <MetricCard icon={BarChart3} label="Kecocokan profesi" value={topMatch?.percentage != null ? `${Math.round(topMatch.percentage)}%` : "—"} description={topMatch?.profession_unit?.unit_name ?? "Tersedia setelah assessment"} tone="emerald" />
          <MetricCard icon={BriefcaseBusiness} label="Roadmap karier" value={hasRecommendation ? "Tersedia" : "Belum"} description={hasRecommendation ? "Rekomendasi siap dipelajari" : "Selesaikan assessment terlebih dahulu"} tone="amber" />
        </div>
      </section>

      <AssessmentShareCard />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="profile-progress-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="profile-progress-title" className="text-xl font-bold text-slate-900">Kelengkapan profil</h2>
              <p className="mt-1 text-sm text-slate-500">Profil lengkap membuat hasil pencocokan lebih akurat.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">{profilePercent}% lengkap</span>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Kelengkapan biodata" aria-valuenow={profilePercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-700" style={{ width: `${profilePercent}%` }} />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${profilePercent === 100 ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>
                {profilePercent === 100 ? <Check size={20} /> : <UserRound size={20} />}
              </div>
              <p className="text-sm font-medium text-slate-700">{profilePercent === 100 ? "Semua data utama sudah terisi." : "Lanjutkan pengisian data utama Anda."}</p>
            </div>
            <Link href="/dashboard/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-600">Buka biodata <ChevronRight size={16} /></Link>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7" aria-labelledby="next-steps-title">
          <h2 id="next-steps-title" className="text-xl font-bold text-slate-900">Langkah berikutnya</h2>
          <p className="mt-1 text-sm text-slate-500">Ikuti tahapan sesuai urutan.</p>
          <div className="mt-5 space-y-1">
            {steps.map((step) => (
              <Link key={step.title} href={step.href} className="group flex gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                {step.complete ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} /> : <Circle className="mt-0.5 shrink-0 text-slate-300 group-hover:text-blue-500" size={20} />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{step.description}</p>
                </div>
                <ChevronRight className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" size={16} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
