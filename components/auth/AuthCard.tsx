"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LogIn, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/api";
import { RegisterForm, RegisterSchema } from "@/validations/auth-register";

import AuthInput from "./AuthInput";
import AuthLogo from "./AuthLogo";

export default function AuthCard() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  async function onSubmit(data: RegisterForm) {
    try {
      const response = await api.post("/auth/register", data);
      toast.success(response.data.message);
      router.push("/auth/login");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Registrasi gagal";

      toast.error(message);
    }
  }

  return (
    <div className="relative z-20 mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.9fr_1.1fr]">
      <section
        className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between"
        aria-label="Tentang pendaftaran Talent Match"
      >
        <div className="absolute -left-24 -top-20 h-64 w-64 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
            <Sparkles size={14} /> Talent Match UBL
          </span>
          <h2 className="mt-7 text-3xl font-bold leading-tight tracking-tight">
            Mulai kenali potensi dan arah karier terbaik Anda.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Buat akun untuk mengikuti assessment dan mendapatkan rekomendasi pengembangan yang sesuai dengan profil Anda.
          </p>
        </div>

        <div className="relative space-y-4 text-sm text-slate-300">
          {["Proses pendaftaran singkat", "Assessment berbasis kompetensi", "Rekomendasi karier personal"].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="shrink-0 text-cyan-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <AuthLogo />

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Buat akun baru</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Daftar untuk memulai perjalanan pengembangan Anda.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <AuthInput
            label="Email"
            type="email"
            placeholder="nama@email.com"
            register={register("email")}
            error={errors.email?.message}
            variant="light"
            autoComplete="email"
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Buat password"
            register={register("password")}
            error={errors.password?.message}
            variant="light"
            autoComplete="new-password"
          />

          <AuthInput
            label="Konfirmasi password"
            type="password"
            placeholder="Ulangi password"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            variant="light"
            autoComplete="new-password"
          />

          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <ShieldCheck size={15} className="text-emerald-600" /> Data Anda terlindungi
            </span>
            <Link href="/" className="font-semibold text-blue-700 transition hover:text-blue-600">
              Kembali
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <><UserPlus size={18} className="animate-pulse" /> Memproses...</>
            ) : (
              <>Daftar sekarang <ArrowRight size={18} className="transition group-hover:translate-x-0.5" /></>
            )}
          </button>
        </form>

        <div className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
          <p className="text-sm font-medium text-slate-700">Sudah memiliki akun?</p>
          <Link
            href="/auth/login"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-white px-4 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <LogIn size={17} /> Masuk ke akun Anda
          </Link>
        </div>
      </section>
    </div>
  );
}
