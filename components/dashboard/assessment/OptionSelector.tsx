"use client";

interface QuestionOption {
  option_id: number;
  option_text: string;
}

interface Props {
  options: QuestionOption[];
  disabled?: boolean;
  onSelect: (optionId: number) => void;
}

export default function OptionSelector({ options, disabled = false, onSelect }: Props) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-5 text-center text-xl font-bold text-slate-900">
        Pilih jawaban Anda
      </legend>

      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.option_id}
            type="button"
            onClick={() => onSelect(option.option_id)}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left font-medium text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {option.option_text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
