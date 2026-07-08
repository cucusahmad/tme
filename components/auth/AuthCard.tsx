"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import AuthLogo from "./AuthLogo";
import AuthInput from "./AuthInput";

import api from "@/lib/api";

import {
  RegisterForm,
  RegisterSchema,
} from "@/validations/auth-register";

export default function AuthCard() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(
      RegisterSchema
    ),
  });

  async function onSubmit(
    data: RegisterForm
  ) {
    try {
      const res =
        await api.post(
          "/auth/register",
          data
        );

      toast.success(
        res.data.message
      );

      router.push("/auth/login");
    } catch (error: any) {
      toast.error(
        error.response?.data
          ?.message ||
          "Register gagal"
      );
    }
  }

  return (
    <div className="relative z-20 w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-10 backdrop-blur-3xl">

      <AuthLogo />

      <h1 className="mt-8 text-center text-3xl font-black text-white">
        Create Account
      </h1>

      <p className="mt-2 text-center text-slate-400">
        Register to participate
      </p>

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="mt-10 space-y-5"
      >

        <AuthInput
          label="Email"
          type="email"
          placeholder="example@email.com"
          register={register("email")}
          error={
            errors.email?.message
          }
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="********"
          register={register(
            "password"
          )}
          error={
            errors.password
              ?.message
          }
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="********"
          register={register(
            "confirmPassword"
          )}
          error={
            errors
              .confirmPassword
              ?.message
          }
        />

        <button
          disabled={isSubmitting}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
        >
          {isSubmitting
            ? "Loading..."
            : "Register"}
        </button>

      </form>

      <p className="mt-8 text-center text-sm text-slate-400">

        Already have an account?

        <Link
          href="/auth/login"
          className="ml-2 font-semibold text-cyan-400"
        >
          Login
        </Link>

      </p>

    </div>
  );
}