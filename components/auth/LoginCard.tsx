"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/api";

import AuthLogo from "./AuthLogo";
import AuthInput from "./AuthInput";

import { LoginSchema } from "@/validations/auth-login";

import { z } from "zod";

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginCard() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

async function onSubmit(data: LoginForm) {
  try {
    const response = await api.post(
      "/auth/login",
      data,
      {
        withCredentials: true,
      }
    );
    console.log(response);

  toast.success("Login berhasil");

const role = response.data.data.role;

setTimeout(() => {

  if (role === "ADMIN") {
    window.location.href =
      "/dashboard/admin";
  } else {
    window.location.href =
      "/dashboard";
  }

}, 300);

  } catch (error: any) {
    toast.error(
      error.response?.data?.message ??
      "Email atau Password salah"
    );
  }
}

  return (
    <div className="relative z-20 w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-10 backdrop-blur-3xl">

      <AuthLogo />

      <h1 className="mt-8 text-center text-3xl font-black text-white">
        Welcome Back
      </h1>

      <p className="mt-2 text-center text-slate-400">
        Login to continue
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-5"
      >
        <AuthInput
          label="Email"
          type="email"
          placeholder="example@email.com"
          register={register("email")}
          error={errors.email?.message}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="********"
          register={register("password")}
          error={errors.password?.message}
        />

        <button
          disabled={isSubmitting}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
        >
          {isSubmitting
            ? "Loading..."
            : "Login"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Don't have an account?

        <Link
          href="/auth/register"
          className="ml-2 font-semibold text-cyan-400"
        >
          Register
        </Link>
      </p>
    </div>
  );
}