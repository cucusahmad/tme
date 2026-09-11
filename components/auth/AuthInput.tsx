import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  variant?: "dark" | "light";
  autoComplete?: string;
}

export default function AuthInput({
  label,
  type,
  placeholder,
  register,
  error,
  variant = "dark",
  autoComplete,
}: Props) {
  return (
    <div>

      <label htmlFor={register.name} className={`mb-2 block text-sm font-semibold ${variant === "light" ? "text-emerald-950" : "text-slate-300"}`}>
        {label}
      </label>

      <input
        id={register.name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${register.name}-error` : undefined}
        className={`w-full rounded-xl border px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          variant === "light"
            ? "border-emerald-900/15 bg-[#faf7ee]/50 text-emerald-950 focus:border-emerald-600 focus:bg-white focus:ring-emerald-100"
            : "border-white/10 bg-white/5 text-white focus:border-emerald-400 focus:ring-emerald-400/10"
        } ${error ? "border-red-400" : ""}`}
      />

      {error && (
        <p id={`${register.name}-error`} className={`mt-2 text-sm ${variant === "light" ? "text-red-600" : "text-red-400"}`}>
          {error}
        </p>
      )}

    </div>
  );
}
