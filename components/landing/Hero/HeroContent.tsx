
import { ArrowRight, BadgeCheck, ChevronRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="max-w-3xl">
      <Image src="/images/logo-talent-match.svg" alt="Logo Talent Match Ecosystem" width={240} height={150} preload className="mb-6 h-auto w-44 drop-shadow-[0_16px_30px_rgba(0,0,0,.3)] sm:w-52" />
      <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-amber-300/25 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-amber-200">
        <ShieldCheck size={16} /> Sistem Informasi pengembangan karier
      </div>
      <h1 className="text-5xl font-black leading-[1.02] tracking-[-.045em] text-white sm:text-6xl xl:text-7xl">
        Temukan profesi yang<span className="mt-2 block text-amber-300">sesuai potensimu.</span>
      </h1>
      <p className="mt-7 text-xl font-semibold text-cyan-100 sm:text-2xl">Kenali Potensi, Temukan Profesi yang Sesuai.</p>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        Talent Match Ecosystem membantu Anda mengenali kekuatan diri, melihat kecocokan dengan profesi dalam bidang pilihan, dan menyusun langkah pengembangan karier berdasarkan hasil asesmen.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link href="/auth/login" className="group inline-flex items-center justify-center gap-3 rounded-xl bg-amber-300 px-7 py-4 font-bold text-[#071426] shadow-[0_14px_40px_rgba(251,191,36,.18)] transition hover:bg-amber-200">Mulai Talent Matching <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link>
        <Link href="#cara-kerja" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10">Pelajari sistem <ChevronRight size={18} /></Link>
      </div>
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7 text-sm text-slate-300">
        {["Terukur", "Terintegrasi", "Berorientasi karier"].map((item) => <span key={item} className="flex items-center gap-2"><BadgeCheck size={17} className="text-amber-300" />{item}</span>)}
      </div>
    </div>
  );
}
