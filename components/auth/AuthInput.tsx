interface Props {
  label: string;
  type: string;
  placeholder: string;
  register: any;
  error?: string;
}

export default function AuthInput({
  label,
  type,
  placeholder,
  register,
  error,
}: Props) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none focus:border-cyan-400"
      />

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}