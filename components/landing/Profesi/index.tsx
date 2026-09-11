import { BookOpenCheck, Building2, ChartNoAxesCombined, RadioTower, Scale, ShieldCheck } from "lucide-react";

const scopes = [
  { icon: ShieldCheck, title: "Bisnis & Kewirausahaan", text: "Eksplorasi peran seperti analis bisnis, pengembang usaha, dan wirausaha yang membutuhkan inisiatif serta kemampuan memecahkan masalah." },
  { icon: ChartNoAxesCombined, title: "Manajerial & Kepemimpinan", text: "Pemetaan kapasitas memimpin, mengelola sumber daya, mengambil keputusan, dan mengarahkan kinerja organisasi." },
  { icon: RadioTower, title: "Teknologi & Informasi", text: "Identifikasi talenta analitis dan digital untuk mendukung sistem informasi, data, komunikasi, serta transformasi teknologi." },
  { icon: BookOpenCheck, title: "Pendidikan & Pengembangan", text: "Pemetaan potensi sebagai pendidik, fasilitator, pengembang kompetensi, dan pengelola pembelajaran individu." },
  { icon: Scale, title: "Pengawasan & Tata Kelola", text: "Kesesuaian pada area yang menuntut integritas, ketelitian, kepatuhan, objektivitas, dan akuntabilitas." },
  { icon: Building2, title: "Staf & Dukungan Organisasi", text: "Temukan profesi yang fungsi perencanaan, administrasi, logistik, dan dukungan kelembagaan lainnya." },
];
export default function Profesi() {
  return <section id="pemetaan" className="bg-white py-24 sm:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-2 lg:items-end"><div><p className="section-kicker">Eksplorasi Profesi</p><h2 className="section-title mt-5">Eksplorasi profesi yang sejalan dengan kekuatan Anda.</h2></div><p className="text-lg leading-8 text-slate-600">Berikut contoh bidang karier untuk Anda eksplorasi. Pilihan bidang dan peran yang dapat dicocokkan mengikuti katalog profesi yang tersedia di aplikasi.</p></div>
    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{scopes.map(({icon:Icon,title,text},i)=><article key={title} className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"><div className="flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-[#115e50] transition group-hover:bg-[#115e50] group-hover:text-amber-300"><Icon size={23}/></div><span className="text-xs font-bold text-slate-300">0{i+1}</span></div><h3 className="mt-7 text-xl font-bold text-[#115e50]">{title}</h3><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}</div>
  </div></section>;
}
