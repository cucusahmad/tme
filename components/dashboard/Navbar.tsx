"use client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Menu, ShieldCheck, UserRound } from "lucide-react";

const routeMeta = [
  ["/dashboard/profile", "Profil Talenta", "Kelola identitas dan riwayat profesional Anda"],
  ["/dashboard/assessment", "Assessment", "Ukur kompetensi, potensi, dan preferensi kerja"],
  ["/dashboard/result", "Peta Potensi", "Kenali kekuatan dan kecocokan peran terbaik"],
  ["/dashboard/recommendation", "Rekomendasi Karier", "Arah penempatan dan pengembangan personal"],
  ["/dashboard/training", "Pengembangan", "Program belajar untuk memperkuat kompetensi"],
] as const;

export default function Navbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const pathname = usePathname();
  const meta = useMemo(() => routeMeta.find(([path]) => pathname.startsWith(path))?.slice(1) ?? ["Ikhtisar Talenta", "Pantau perjalanan pengembangan potensi Anda"], [pathname]);
  return <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f3f6f9]/90 backdrop-blur-xl"><div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
    <div className="flex min-w-0 items-center gap-3"><button onClick={onOpenSidebar} aria-label="Buka navigasi" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 lg:hidden"><Menu size={20} /></button><div className="min-w-0"><div className="hidden items-center gap-1 text-[11px] font-semibold text-slate-400 sm:flex"><span>SIPETA POLRI</span><ChevronRight size={12} /><span className="text-amber-700">Ruang Talenta</span></div><h1 className="truncate text-lg font-black tracking-tight text-[#0b2744] sm:text-xl">{meta[0]}</h1><p className="hidden truncate text-xs text-slate-500 sm:block">{meta[1]}</p></div></div>
    <div className="flex shrink-0 items-center gap-2 sm:gap-3"><button aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-amber-300 hover:text-amber-700"><Bell size={18} /><span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" /></button><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b2744] text-amber-300"><UserRound size={18} /></div><div className="hidden sm:block"><p className="text-xs font-bold text-slate-800">Pengguna SIPETA</p><p className="flex items-center gap-1 text-[10px] text-slate-500"><ShieldCheck size={11} className="text-emerald-600" />Akun terverifikasi</p></div></div></div>
  </div></header>;
}
