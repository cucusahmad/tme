"use client";

import { useState } from "react";
import { BarChart3, BookOpenCheck, BriefcaseBusiness, ChevronLeft, ChevronRight, ClipboardCheck, LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";
import SidebarItem from "./SidebarItem";
import LogoutButton from "./LogoutButton";

const menus = [
  { href: "/dashboard", icon: LayoutDashboard, title: "Ikhtisar" },
  { href: "/dashboard/profile", icon: UserRound, title: "Profil Talenta" },
  { href: "/dashboard/assessment", icon: ClipboardCheck, title: "Assessment" },
  { href: "/dashboard/result", icon: BarChart3, title: "Peta Potensi" },
  { href: "/dashboard/recommendation", icon: BriefcaseBusiness, title: "Rekomendasi Karier" },
  { href: "/dashboard/training", icon: BookOpenCheck, title: "Pengembangan" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`${collapsed ? "w-24" : "w-72"} h-screen border-r border-white/10 bg-[#07182d] text-white shadow-2xl shadow-slate-950/20 transition-[width] duration-300`}>
      <div className="flex h-full flex-col overflow-hidden">
        <div className={`flex h-24 items-center border-b border-white/10 ${collapsed ? "justify-center px-3" : "justify-between px-5"}`}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-300 to-amber-500 text-[#07182d] shadow-lg shadow-amber-950/20">
              <ShieldCheck size={25} strokeWidth={2.2} /><span className="absolute -bottom-1 h-1.5 w-5 rounded-full bg-white/80" />
            </div>
            {!collapsed && <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">Talent Match</p><h2 className="mt-0.5 truncate text-lg font-black tracking-tight">SIPETA POLRI</h2><p className="text-[11px] text-slate-400">Pemetaan & pengembangan</p></div>}
          </div>
          {!collapsed && <button onClick={() => setCollapsed(true)} aria-label="Ciutkan navigasi" className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"><ChevronLeft size={17} /></button>}
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {!collapsed && <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Ruang Talenta</p>}
          <nav className="space-y-1.5" aria-label="Navigasi dashboard">{menus.map((menu) => <SidebarItem key={menu.href} {...menu} collapsed={collapsed} />)}</nav>
          {collapsed && <button onClick={() => setCollapsed(false)} aria-label="Perluas navigasi" className="mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white"><ChevronRight size={18} /></button>}
        </div>
        <div className="border-t border-white/10 p-3">
          {!collapsed && <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4"><p className="text-xs font-semibold text-slate-200">Satu profil, banyak potensi.</p><p className="mt-1 text-[11px] leading-5 text-slate-400">Lengkapi setiap tahap untuk hasil pencocokan yang lebih presisi.</p></div>}
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
