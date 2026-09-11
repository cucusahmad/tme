import { ClipboardCheck, FileSearch, IdCard, MapPinned } from "lucide-react";

const steps = [
  { icon: IdCard, title: "Profil diri", text: "Lengkapi data diri dan pendidikan, lalu pilih bidang profesi yang ingin Anda eksplorasi." },
  { icon: ClipboardCheck, title: "Asesmen kompetensi", text: "Instrumen asesmen mengukur dimensi potensi dan kompetensi secara konsisten sesuai kerangka yang ditetapkan." },
  { icon: FileSearch, title: "Analisis talenta", text: "Sistem mengolah data menjadi profil kekuatan, kesenjangan kompetensi, dan karakteristik talenta individu." },
  { icon: MapPinned, title: "Kecocokan profesi", text: "Lihat peringkat peran yang cocok dalam bidang pilihan Anda dan rekomendasi untuk mengembangkan kompetensi yang dibutuhkan." },
];
export default function CaraKerja() {
  return <section id="cara-kerja" className="bg-[#f4f6f8] py-24 sm:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="mx-auto max-w-3xl text-center"><p className="section-kicker">Cara Kerja Sistem</p><h2 className="section-title mt-5">Dari data individu menjadi peta talenta yang bermakna.</h2><p className="mt-6 text-lg leading-8 text-slate-600">Alur yang terstruktur memastikan setiap informasi bergerak dari profil, asesmen, analisis, hingga rekomendasi arah pengembangan.</p></div>
    <div className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4"><div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-slate-300 lg:block" />{steps.map(({icon:Icon,title,text},i)=><article key={title} className="relative rounded-2xl border border-slate-200 bg-white p-7"><div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border-8 border-[#f4f6f8] bg-[#0b2744] text-amber-300"><Icon size={25}/></div><p className="mt-6 text-xs font-black uppercase tracking-[.18em] text-amber-600">Tahap 0{i+1}</p><h3 className="mt-3 text-xl font-bold text-[#0b2744]">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</div>
    <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center text-sm leading-6 text-amber-950"><strong>Prinsip penggunaan:</strong> skor kecocokan membantu eksplorasi karier, bukan jaminan keberhasilan atau keputusan akhir. Pertimbangkan juga minat, pengalaman, dan tujuan pribadi Anda.</div>
  </div></section>;
}
