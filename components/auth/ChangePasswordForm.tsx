"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, LockKeyhole, Save, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/api";
import { ChangePasswordInput, ChangePasswordSchema } from "@/validations/change-password";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const fields: Array<{ name: PasswordField; label: string; autoComplete: string }> = [
  { name: "currentPassword", label: "Password saat ini", autoComplete: "current-password" },
  { name: "newPassword", label: "Password baru", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Konfirmasi password baru", autoComplete: "new-password" },
];

export default function ChangePasswordForm({ admin = false }: { admin?: boolean }) {
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(ChangePasswordSchema) });

  async function onSubmit(data: ChangePasswordInput) {
    setMessage(null);
    try {
      const response = await api.put("/auth/change-password", data);
      setMessage({ type: "success", text: response.data.message });
      reset();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message ?? "Password gagal diubah. Silakan coba lagi.",
      });
    }
  }

  const accent = admin ? "focus:border-cyan-500 focus:ring-cyan-500/10" : "focus:border-amber-500 focus:ring-amber-500/10";
  const button = admin
    ? "from-cyan-500 to-blue-600 hover:shadow-cyan-500/20"
    : "from-amber-400 to-amber-500 text-[#07182d] hover:shadow-amber-500/20";

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
          <div className={`rounded-2xl p-3 ${admin ? "bg-cyan-50 text-cyan-700" : "bg-amber-50 text-amber-700"}`}>
            <KeyRound size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Perbarui password</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Masukkan password saat ini untuk mengonfirmasi bahwa akun ini milik Anda.</p>
          </div>
        </div>

        <div className="space-y-5">
          {fields.map(({ name, label, autoComplete }) => (
            <label key={name} className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register(name)}
                  type={visible[name] ? "text" : "password"}
                  autoComplete={autoComplete}
                  className={`w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-slate-900 outline-none transition focus:ring-4 ${accent}`}
                />
                <button
                  type="button"
                  onClick={() => setVisible((value) => ({ ...value, [name]: !value[name] }))}
                  aria-label={visible[name] ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  {visible[name] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {errors[name] && <span className="mt-1.5 block text-sm text-red-600">{errors[name]?.message}</span>}
            </label>
          ))}
        </div>

        {message && (
          <div role="alert" className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="mt-7 flex justify-end border-t border-slate-100 pt-6">
          <button disabled={isSubmitting} className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 text-sm font-bold shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${button}`}>
            <Save size={17} /> {isSubmitting ? "Menyimpan..." : "Simpan password"}
          </button>
        </div>
      </form>

      <aside className="h-fit rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
        <ShieldCheck className={admin ? "text-cyan-300" : "text-amber-300"} size={30} />
        <h3 className="mt-4 text-lg font-bold">Jaga keamanan akun</h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          <li>Gunakan minimal 6 karakter.</li>
          <li>Hindari password yang sama dengan akun lain.</li>
          <li>Jangan membagikan password kepada siapa pun.</li>
        </ul>
      </aside>
    </div>
  );
}
