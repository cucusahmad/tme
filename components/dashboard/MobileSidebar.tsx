"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenCheck, BriefcaseBusiness, ClipboardCheck, KeyRound, LayoutDashboard, UserRound, X } from "lucide-react";
import LogoutButton from "./LogoutButton";

const menus = [
  { title: "Ikhtisar", href: "/dashboard", icon: LayoutDashboard }, { title: "Profil Talenta", href: "/dashboard/profile", icon: UserRound },
  { title: "Assessment", href: "/dashboard/assessment", icon: ClipboardCheck }, { title: "Peta Potensi", href: "/dashboard/result", icon: BarChart3 },
  { title: "Rekomendasi Karier", href: "/dashboard/recommendation", icon: BriefcaseBusiness }, { title: "Pengembangan", href: "/dashboard/training", icon: BookOpenCheck },
  { title: "Ubah Password", href: "/dashboard/change-password", icon: KeyRound },
];
export default function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return <><div onClick={onClose} className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`} /><aside className={`fixed left-0 top-0 z-50 flex h-dvh w-[min(88vw,20rem)] flex-col bg-[#07182d] text-white shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="flex h-24 items-center justify-between border-b border-white/10 px-5"><Image src="/images/logo-sipeta.png" alt="SIPETA POLRI" width={180} height={180} priority className="h-auto w-32" /><button onClick={onClose} aria-label="Tutup navigasi" className="rounded-xl border border-white/10 p-2 text-slate-400"><X size={19} /></button></div>
    <nav className="flex-1 space-y-1.5 overflow-y-auto p-4" aria-label="Navigasi mobile">{menus.map(({ title, href, icon: Icon }) => { const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href)); return <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-amber-400 text-[#07182d]" : "bg-white/5"}`}><Icon size={18} /></span>{title}</Link>; })}</nav>
    <div className="border-t border-white/10 p-4"><LogoutButton onLogout={onClose} /></div>
  </aside></>;
}
