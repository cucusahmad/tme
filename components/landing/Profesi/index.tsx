"use client";
import { motion } from "framer-motion";
import { BookOpenCheck, Building2, ChartNoAxesCombined, RadioTower, Scale, ShieldCheck } from "lucide-react";

const scopes = [
  { icon: ShieldCheck, title: "Operasional Kepolisian", text: "Kesesuaian kompetensi untuk fungsi yang berhadapan langsung dengan dinamika pemeliharaan keamanan dan pelayanan." },
  { icon: ChartNoAxesCombined, title: "Manajerial & Kepemimpinan", text: "Pemetaan kapasitas memimpin, mengelola sumber daya, mengambil keputusan, dan mengarahkan kinerja organisasi." },
  { icon: RadioTower, title: "Teknologi & Informasi", text: "Identifikasi talenta analitis dan digital untuk mendukung sistem informasi, data, komunikasi, serta transformasi teknologi." },
  { icon: BookOpenCheck, title: "Pendidikan & Pengembangan", text: "Pemetaan potensi sebagai pendidik, fasilitator, pengembang kompetensi, dan pengelola pembelajaran personel." },
  { icon: Scale, title: "Pengawasan & Tata Kelola", text: "Kesesuaian pada area yang menuntut integritas, ketelitian, kepatuhan, objektivitas, dan akuntabilitas." },
  { icon: Building2, title: "Staf & Dukungan Organisasi", text: "Pemetaan talenta untuk fungsi perencanaan, administrasi, logistik, dan dukungan kelembagaan lainnya." },
];
export default function Profesi() {
  return <section id="pemetaan" className="bg-white py-24 sm:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-2 lg:items-end"><div><p className="section-kicker">Cakupan Pemetaan</p><h2 className="section-title mt-5">Melihat potensi lintas fungsi dan peran di lingkungan Polri.</h2></div><p className="text-lg leading-8 text-slate-600">Pemetaan tidak membatasi personel pada satu jabatan. Sistem membantu melihat kecenderungan kompetensi terhadap kelompok peran sebagai dasar eksplorasi talenta yang lebih luas.</p></div>
    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{scopes.map(({icon:Icon,title,text},i)=><motion.article key={title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*.06}} viewport={{once:true}} className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"><div className="flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-[#0b2744] transition group-hover:bg-[#0b2744] group-hover:text-amber-300"><Icon size={23}/></div><span className="text-xs font-bold text-slate-300">0{i+1}</span></div><h3 className="mt-7 text-xl font-bold text-[#0b2744]">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></motion.article>)}</div>
  </div></section>;
}
