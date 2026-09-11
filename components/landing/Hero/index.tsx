import { ArrowUpRight, BookOpen, BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

export default function Hero() {
  return (
    <section id="beranda" className="relative overflow-hidden pb-16 pt-36 lg:pb-24 lg:pt-44">
      <HeroBackground />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_.9fr] lg:gap-10 lg:px-8">
        <HeroContent />
        <div className="future-reveal relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] border border-emerald-800/10" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_24px_70px_-25px_rgba(6,78,59,.22)] sm:p-8">
            <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-emerald-800">Masa depan dimulai dari Anda</span><Sparkles size={20} className="shrink-0 text-emerald-600" /></div>
            <svg viewBox="0 0 440 280" role="img" aria-label="Ilustrasi buku pendidikan dan tangga pengembangan menuju kelulusan dan karier" className="my-5 w-full">
              <circle cx="230" cy="139" r="119" fill="#edf6ef" />
              <circle cx="354" cy="65" r="18" fill="#d1fae5" />
              <path d="M35 247H410" stroke="#d2e6dc" strokeWidth="2" />
              <path d="M193 246V203H253V159H313V112H378V246Z" fill="#087f68" />
              <path d="M253 203V159H313V112H378" fill="none" stroke="#34b79a" strokeWidth="4" />
              <rect x="62" y="216" width="124" height="24" rx="5" fill="#064e3b" />
              <rect x="75" y="191" width="124" height="24" rx="5" fill="#e6b957" />
              <rect x="65" y="166" width="124" height="24" rx="5" fill="#6ee7b7" />
              <path d="M83 178H173M94 203H183M81 228H170" stroke="#fffaf0" strokeWidth="3" strokeLinecap="round" />
              <path d="M90 94Q125 77 160 94V148Q125 131 90 148ZM160 94Q195 77 230 94V148Q195 131 160 148Z" fill="#fffaf0" stroke="#087f68" strokeWidth="3" strokeLinejoin="round" />
              <path d="M104 106L144 107M104 117L144 118M176 107L216 106M176 118L207 117" stroke="#9cc9b9" strokeWidth="3" strokeLinecap="round" />
              <path d="M288 63L332 45L379 63L332 82Z" fill="#064e3b" />
              <path d="M306 74V92Q332 109 359 92V74L332 86Z" fill="#047857" />
              <path d="M378 64V96" stroke="#dfaa36" strokeWidth="3" /><circle cx="378" cy="99" r="4" fill="#dfaa36" />
              <path d="M234 133Q247 79 280 69" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="6 6" />
              <path d="M269 65L282 68L277 80" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
              <path d="M57 124V138M50 131H64M254 33V47M247 40H261" stroke="#d9a537" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="space-y-3">
              {[{ icon: GraduationCap, title: "Pendidikan", text: "Kenali bekal dan potensi diri", tone: "bg-emerald-50 text-emerald-700" }, { icon: BookOpen, title: "Pengembangan kompetensi", text: "Bangun kemampuan yang relevan", tone: "bg-emerald-50 text-emerald-700" }, { icon: BriefcaseBusiness, title: "Karier yang sesuai", text: "Melangkah dengan arah yang jelas", tone: "bg-amber-50 text-amber-700" }].map(({icon: Icon, title, text, tone}, i) => <div key={title} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-3 sm:px-4"><div className={`shrink-0 rounded-xl p-2.5 ${tone}`}><Icon size={21} /></div><div className="flex-1"><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-0.5 text-sm text-slate-500">{text}</p></div><span className="hidden text-xs font-semibold text-slate-400 sm:block">0{i + 1}</span></div>)}
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700">Satu perjalanan, berbagai kemungkinan <ArrowUpRight size={16} className="shrink-0" /></p>
          </div>
        </div>
      </div>
    </section>
  );
}
