import { Activity, BriefcaseBusiness, Radar, UserRoundCheck } from "lucide-react";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

const dimensions = [{ label: "Kepemimpinan", value: 88 }, { label: "Integritas", value: 94 }, { label: "Manajerial", value: 81 }, { label: "Sosial kultural", value: 85 }];

export default function Hero() {
  return (
    <section id="beranda" className="relative min-h-screen overflow-hidden pt-32 lg:pt-36">
      <HeroBackground />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-14 px-6 pb-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
        <HeroContent />
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-7 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Peta Talenta Personel</p><p className="mt-2 text-lg font-bold text-white">Ringkasan profil kompetensi</p></div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-[#071426]"><Radar size={23} /></div></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ icon: UserRoundCheck, value: "Profil", label: "Data personel" }, { icon: Activity, value: "Asesmen", label: "Potensi & kompetensi" }, { icon: BriefcaseBusiness, value: "Arah", label: "Rekomendasi peran" }].map(({icon: Icon, value, label}) => <div key={value} className="rounded-2xl border border-white/10 bg-[#061221]/60 p-4"><Icon size={19} className="mb-4 text-amber-300" /><p className="font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>)}
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#061221]/60 p-5">
              <div className="mb-5 flex items-center justify-between"><p className="text-sm font-bold text-white">Dimensi kompetensi</p><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Terpetakan</span></div>
              <div className="space-y-4">{dimensions.map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-xs"><span className="text-slate-300">{item.label}</span><span className="font-bold text-white">{item.value}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-300" style={{width: `${item.value}%`}} /></div></div>)}</div>
            </div>
            <p className="mt-4 text-center text-[11px] text-slate-500">Ilustrasi tampilan informasi pemetaan talenta</p>
          </div>
        </div>
      </div>
    </section>
  );
}
