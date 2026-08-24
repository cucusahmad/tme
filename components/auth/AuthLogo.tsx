import { ShieldCheck } from "lucide-react";

export default function AuthLogo() {
  return (
    <div className="flex justify-center text-center">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white">
          <ShieldCheck size={25} />
        </div>
        <div className="text-left">
          <p className="text-lg font-black tracking-tight text-slate-950">SIPETA POLRI</p>
          <p className="max-w-52 text-[10px] font-medium leading-4 text-slate-500">Sistem Informasi Pemetaan Talenta Polri</p>
        </div>
      </div>
    </div>
  );
}
