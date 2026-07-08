import {
  Brain,
  ClipboardList,
  BarChart3,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Welcome */}

      <div className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-10 text-white shadow-xl">

        <h1 className="text-4xl font-black">
          Selamat Datang 👋
        </h1>

        <p className="mt-3 max-w-2xl text-cyan-100">
          Lengkapi biodata dan kerjakan assessment
          untuk mengetahui profesi yang paling sesuai
          dengan potensi, kompetensi, dan karakter Anda.
        </p>

      </div>

      {/* Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">

            <Brain className="text-cyan-600" />

          </div>

          <p className="text-sm text-slate-500">
            Biodata
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            70%
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Kelengkapan Biodata
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

            <ClipboardList className="text-blue-600" />

          </div>

          <p className="text-sm text-slate-500">
            Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            0%
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Belum Dikerjakan
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">

            <BarChart3 className="text-green-600" />

          </div>

          <p className="text-sm text-slate-500">
            Talent Match
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            -
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Belum Tersedia
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">

            <Target className="text-purple-600" />

          </div>

          <p className="text-sm text-slate-500">
            Roadmap
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            0
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Rekomendasi
          </p>

        </div>

      </div>

      {/* Progress */}

      <div className="rounded-3xl bg-white p-8 shadow">

        <h2 className="text-2xl font-bold text-slate-900">
          Progress Assessment
        </h2>

        <div className="mt-8">

          <div className="mb-3 flex justify-between">

            <span className="text-slate-600">
              Kelengkapan Data
            </span>

            <span className="font-semibold text-cyan-600">
              35%
            </span>

          </div>

          <div className="h-3 rounded-full bg-slate-200">

            <div className="h-3 w-[35%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />

          </div>

        </div>

      </div>

      {/* Next Step */}

      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Langkah Berikutnya
        </h2>

        <ul className="mt-6 space-y-3 text-slate-700">

          <li>✅ Lengkapi Biodata</li>

          <li>⬜ Kerjakan Assessment</li>

          <li>⬜ Lihat Talent Match Score</li>

          <li>⬜ Pelajari Roadmap Karier</li>

        </ul>

      </div>

    </div>
  );
}