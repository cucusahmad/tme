"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Boxes, KeyRound, LayoutDashboard, ListChecks, LogOut, Menu, Search, Users, X } from "lucide-react";

const menu = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Data Pengguna", icon: Users },
  { href: "/dashboard/admin/dimensions", label: "Data Dimensi", icon: Boxes },
  { href: "/dashboard/admin/questions", label: "Data Pertanyaan", icon: ListChecks },
  { href: "/dashboard/admin/change-password", label: "Ubah Password", icon: KeyRound },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/auth/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <Image src="/images/logo-sipeta.png" alt="SIPETA POLRI" width={180} height={180} priority className="h-auto w-32" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Panel</p>
      </div>
      <p className="px-6 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Menu Utama</p>
      <nav className="flex-1 space-y-2 px-4">
        {menu.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                active ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/50" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} /> {label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="m-4 flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500/15 hover:text-red-300">
        <LogOut size={20} /> Keluar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 lg:block">{sidebar}</aside>
      {open && <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <button aria-label="Tutup menu" onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 text-slate-300"><X /></button>
        {sidebar}
      </aside>
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 backdrop-blur-xl lg:px-8">
          <button aria-label="Buka menu" onClick={() => setOpen(true)} className="rounded-lg p-2 lg:hidden"><Menu /></button>
          <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-400 md:flex"><Search size={16}/><span>Pencarian cepat</span></div>
          <div className="ml-auto flex items-center gap-4">
            <button aria-label="Notifikasi" className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500"><Bell size={18}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-500"/></button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right"><p className="text-sm font-semibold text-slate-900">Administrator</p><p className="text-xs text-slate-500">{email}</p></div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-sm font-bold text-white">A</div>
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
