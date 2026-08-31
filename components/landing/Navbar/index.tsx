"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const menus = [{ title: "Tentang", href: "#tentang" }, { title: "Manfaat", href: "#manfaat" }, { title: "Cara Kerja", href: "#cara-kerja" }, { title: "Pemetaan", href: "#pemetaan" }];
export default function Navbar() {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const handler = () => setScrolled(window.scrollY > 24); handler(); window.addEventListener("scroll", handler); return () => window.removeEventListener("scroll", handler); }, []);
  return <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl" : "bg-transparent"}`}>
    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
      <Link href="#beranda" className="flex flex-col" onClick={() => setOpen(false)}>
        <span className={`text-lg font-black tracking-wide sm:text-xl ${scrolled ? "text-[#0b2744]" : "text-white"}`}>SIPETA POLRI</span>
        <span className={`text-[10px] font-medium sm:text-xs ${scrolled ? "text-slate-500" : "text-slate-300"}`}>Sistem Informasi Pemetaan Talenta</span>
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">{menus.map(item => <Link key={item.title} href={item.href} className={`text-sm font-semibold transition ${scrolled ? "text-slate-600 hover:text-[#0b2744]" : "text-slate-200 hover:text-amber-300"}`}>{item.title}</Link>)}</nav>
      <Link href="/auth/login" className="hidden rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-[#071426] transition hover:bg-amber-200 lg:block">Masuk Sistem</Link>
      <button type="button" aria-label="Buka navigasi" onClick={() => setOpen(!open)} className={`lg:hidden ${scrolled ? "text-slate-900" : "text-white"}`}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="border-t border-slate-200 bg-white px-6 py-5 shadow-xl lg:hidden"><nav className="flex flex-col gap-4">{menus.map(item => <Link key={item.title} href={item.href} onClick={() => setOpen(false)} className="font-semibold text-slate-700">{item.title}</Link>)}<Link href="/auth/login" className="mt-2 rounded-xl bg-[#0b2744] px-5 py-3 text-center font-bold text-white">Masuk Sistem</Link></nav></div>}
  </header>;
}
