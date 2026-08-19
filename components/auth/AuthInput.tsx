interface Props {
  label: string;
  type: string;
  placeholder: string;
  register: any;
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

      <label className={`mb-2 block text-sm font-semibold ${variant === "light" ? "text-slate-700" : "text-slate-300"}`}>
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          variant === "light"
            ? "border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-blue-100"
            : "border-white/10 bg-white/5 text-white focus:border-cyan-400 focus:ring-cyan-400/10"
        } ${error ? "border-red-400" : ""}`}
      />

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}
