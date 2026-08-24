interface Props {
  current: number;
  total: number;
  percentage: number;
}

export default function ProgressBar({
  current,
  total,
  percentage,
}: Props) {
  return (
    <div className="mb-8">

      <div className="mb-3 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Assessment SIPETA POLRI
          </h2>

          <p className="text-sm text-slate-500">
            Jawab seluruh pertanyaan dengan jujur sesuai kondisi Anda.
          </p>

        </div>

        <div className="rounded-xl bg-cyan-50 px-4 py-2">

          <span className="text-lg font-bold text-cyan-700">
            {current} / {total}
          </span>

        </div>

      </div>

      {/* Progress */}

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      <div className="mt-2 flex justify-between">

        <span className="text-sm text-slate-500">
          Progress Assessment
        </span>

        <span className="font-semibold text-cyan-700">
          {percentage}%
        </span>

      </div>

    </div>
  );
}
