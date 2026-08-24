import Link from "next/link";
import { ArrowRight, Mail, MapPin, Shield } from "lucide-react";

export default function Footer() {
  return <footer className="bg-[#061221] text-white"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
    <div className="mb-16 flex flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 lg:flex-row lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-amber-300">Portal Personel</p><h2 className="mt-3 text-3xl font-black">Kenali potensi. Arahkan kontribusi.</h2><p className="mt-3 text-slate-300">Akses SIPETA POLRI untuk memulai proses pemetaan talenta.</p></div><Link href="/auth/login" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-amber-300 px-7 py-4 font-bold text-[#071426]">Masuk Sistem <ArrowRight size={18}/></Link></div>
    <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-3"><div><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-300 text-[#071426]"><Shield/></span><div><p className="text-lg font-black tracking-wider">SIPETA POLRI</p><p className="text-xs text-slate-400">Sistem Informasi Pemetaan Talenta Polri</p></div></div><p className="mt-5 max-w-sm leading-7 text-slate-400">Memetakan Kompetensi, Mengarahkan Penempatan.</p></div>
      <div><p className="font-bold">Navigasi</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-400">{[["Tentang","#tentang"],["Manfaat","#manfaat"],["Cara Kerja","#cara-kerja"],["Pemetaan","#pemetaan"]].map(([t,h])=><Link key={t} href={h} className="hover:text-amber-300">{t}</Link>)}</div></div>
      <div><p className="font-bold">Informasi</p><div className="mt-5 space-y-3 text-sm text-slate-400"><p className="flex gap-3"><MapPin size={17} className="shrink-0 text-amber-300"/>Kepolisian Negara Republik Indonesia</p><p className="flex gap-3"><Mail size={17} className="shrink-0 text-amber-300"/>Kontak pengelola sistem melalui kanal internal</p></div></div>
    </div><div className="flex flex-col gap-2 pt-8 text-xs text-slate-500 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} SIPETA POLRI. Hak cipta dilindungi.</p><p>Informasi pemetaan talenta untuk mendukung pengelolaan SDM Polri.</p></div>
  </div></footer>;
}
