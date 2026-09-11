"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, Users, BarChart3, BookOpenCheck, BriefcaseBusiness, ChevronLeft, ChevronRight, ClipboardCheck, KeyRound, LayoutDashboard, UserRound } from "lucide-react";
import SidebarItem from "./SidebarItem";
import LogoutButton from "./LogoutButton";

const baseMenus = [
  { href: "/dashboard", icon: LayoutDashboard, title: "Ikhtisar" },
  { href: "/dashboard/profile", icon: UserRound, title: "Profil Talenta" },
  { href: "/dashboard/organization", icon: Building2, title: "Organisasi & Mentor" },
  { href: "/dashboard/assessment", icon: ClipboardCheck, title: "Assessment" },
  { href: "/dashboard/result", icon: BarChart3, title: "Peta Potensi" },
  { href: "/dashboard/recommendation", icon: BriefcaseBusiness, title: "Rekomendasi Karier" },
  { href: "/dashboard/training", icon: BookOpenCheck, title: "Pengembangan" },
  { href: "/dashboard/change-password", icon: KeyRound, title: "Ubah Password" },
];

export default function Sidebar({ isSupervisor = false }: { isSupervisor?: boolean }) {
  const menus = isSupervisor ? [...baseMenus, { href: "/dashboard/organization/manage", icon: Users, title: "Kelola Organisasi" }] : baseMenus;
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={`${collapsed ? "w-24" : "w-72"} h-screen border-r border-white/10 bg-[#064e3b] text-white shadow-2xl shadow-slate-950/20 transition-[width] duration-300`}>
      <div className="flex h-full flex-col overflow-hidden">
        <div className={`flex h-24 items-center border-b border-white/10 ${collapsed ? "justify-center px-3" : "justify-between px-5"}`}>
          <div className="flex min-w-0 items-center gap-3">
            <Image src={collapsed ? "/images/logo-talent-match-mark.svg" : "/images/logo-talent-match.svg"} alt="Talent Match Ecosystem" width={collapsed ? 64 : 240} height={collapsed ? 64 : 150} preload className={collapsed ? "h-auto w-14" : "h-auto w-32"} />
          </div>
          {!collapsed && <button onClick={() => setCollapsed(true)} aria-label="Ciutkan navigasi" className="rounded-xl border border-white/10 p-2 text-emerald-100/75 transition hover:bg-white/10 hover:text-white"><ChevronLeft size={17} /></button>}
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {!collapsed && <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/65">Ruang Talenta</p>}
          <nav className="space-y-1.5" aria-label="Navigasi dashboard">{menus.map((menu) => <SidebarItem key={menu.href} {...menu} collapsed={collapsed} />)}</nav>
          {collapsed && <button onClick={() => setCollapsed(false)} aria-label="Perluas navigasi" className="mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-emerald-100/75 transition hover:bg-white/10 hover:text-white"><ChevronRight size={18} /></button>}
        </div>
        <div className="border-t border-white/10 p-3">
          {!collapsed && <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4"><p className="text-xs font-semibold text-slate-200">Satu profil, banyak potensi.</p><p className="mt-1 text-xs leading-5 text-emerald-100/75">Lengkapi setiap tahap untuk hasil pencocokan yang lebih presisi.</p></div>}
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
