"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HeroContent() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
      <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-amber-300/25 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-amber-200 backdrop-blur-md">
        <ShieldCheck size={16} /> Sistem Informasi SDM Polri
      </div>
      <h1 className="text-5xl font-black leading-[1.02] tracking-[-.045em] text-white sm:text-6xl xl:text-7xl">
        Pemetaan talenta untuk<span className="mt-2 block text-amber-300">Polri yang presisi.</span>
      </h1>
      <p className="mt-7 text-xl font-semibold text-cyan-100 sm:text-2xl">Memetakan Kompetensi, Mengarahkan Penempatan.</p>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
        SIPETA POLRI mengintegrasikan profil, kompetensi, potensi, dan hasil asesmen personel menjadi informasi talenta yang objektif untuk mendukung pembinaan karier dan penempatan sesuai kebutuhan organisasi.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link href="/auth/login" className="group inline-flex items-center justify-center gap-3 rounded-xl bg-amber-300 px-7 py-4 font-bold text-[#071426] shadow-[0_14px_40px_rgba(251,191,36,.18)] transition hover:bg-amber-200">Masuk ke SIPETA <ArrowRight size={18} className="transition group-hover:translate-x-1" /></Link>
        <Link href="#cara-kerja" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10">Pelajari sistem <ChevronRight size={18} /></Link>
      </div>
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7 text-sm text-slate-300">
        {["Terukur", "Terintegrasi", "Berorientasi penempatan"].map((item) => <span key={item} className="flex items-center gap-2"><BadgeCheck size={17} className="text-amber-300" />{item}</span>)}
      </div>
    </motion.div>
  );
}
