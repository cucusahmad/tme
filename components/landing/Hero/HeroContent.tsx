
import { ArrowRight, BadgeCheck, ChevronRight, ShieldCheck } from "lucide-react";

import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="max-w-3xl">
      <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-amber-300/25 bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-800">
        <ShieldCheck size={16} /> Future Education & Career
      </div>
      <h1 className="text-5xl font-bold leading-[1.12] tracking-[-.045em] text-emerald-950 sm:text-6xl xl:text-7xl">
        Belajar hari ini.<span className="mt-2 block text-emerald-700">Bertumbuh untuk masa depan.</span>
      </h1>
      <p className="mt-7 text-xl font-semibold text-emerald-800 sm:text-2xl">Dari pendidikan menuju karier yang berarti.</p>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
        Hubungkan pendidikan, potensi, dan cita-cita Anda. Kenali kekuatan diri, kembangkan kompetensi, dan temukan arah karier yang sesuai bersama Talent Match.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link href="/auth/register" className="group inline-flex items-center justify-center gap-3 rounded-xl bg-amber-300 px-7 py-4 font-bold text-[#022c22] shadow-[0_14px_40px_rgba(251,191,36,.18)] transition hover:bg-amber-200">Mulai perjalanan Anda <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link>
        <Link href="#cara-kerja" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-900/15 bg-white/70 px-7 py-4 font-semibold text-emerald-950 transition hover:bg-white/10">Pelajari sistem <ChevronRight size={18} /></Link>
      </div>
      <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-emerald-900/10 pt-7 text-sm text-slate-600">
        {["Kenali potensi", "Bangun kompetensi", "Temukan arah karier"].map((item) => <span key={item} className="flex items-center gap-2"><BadgeCheck size={17} className="text-emerald-700" />{item}</span>)}
      </div>
    </div>
  );
}
