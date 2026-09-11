import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return <footer className="bg-[#073e35] text-white"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
    <div className="mb-16 flex flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 lg:flex-row lg:items-center"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-amber-300">Ruang Karier Anda</p><h2 className="mt-3 text-3xl font-black">Kenali potensi. Temukan profesi.</h2><p className="mt-3 text-slate-300">Akses Talent Match Ecosystem untuk memulai proses pemetaan talenta.</p></div><Link href="/auth/login" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-amber-300 px-7 py-4 font-bold text-[#022c22]">Masuk Sistem <ArrowRight size={18}/></Link></div>
    <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-3"><div><Image src="/images/logo-talent-match.svg" alt="Talent Match Ecosystem" width={240} height={150} className="h-auto w-44" /><p className="mt-5 max-w-sm leading-7 text-slate-400">Kenali Potensi, Temukan Profesi yang Sesuai.</p></div>
      <div><p className="font-bold">Navigasi</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-400">{[["Tentang","#tentang"],["Manfaat","#manfaat"],["Cara Kerja","#cara-kerja"],["Profesi","#pemetaan"]].map(([t,h])=><Link key={t} href={h} className="hover:text-amber-300">{t}</Link>)}</div></div>
      <div><p className="font-bold">Informasi</p><div className="mt-5 space-y-3 text-sm text-slate-400"><p className="flex gap-3"><MapPin size={17} className="shrink-0 text-amber-300"/>Ekosistem eksplorasi profesi dan pengembangan diri</p><p className="flex gap-3"><Mail size={17} className="shrink-0 text-amber-300"/>Profil, asesmen, dan rekomendasi karier dalam satu tempat</p></div></div>
    </div><div className="flex flex-col gap-2 pt-8 text-xs text-slate-500 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Talent Match Ecosystem. Hak cipta dilindungi.</p><p>Pencocokan talenta untuk mendukung perjalanan karier Anda.</p></div>
  </div></footer>;
}
