"use client";

import {
  Sparkles,
  Brain,
  Target,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

interface Props {
  loading: boolean;
  onGenerate: () => void;
}

export default function GenerateCard({
  loading,
  onGenerate,
}: Props) {
  return (
    <div className="space-y-8">

      {/* Hero */}

      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 p-12 text-white shadow-xl">

        <div className="max-w-3xl">

          <div className="mb-6 inline-flex rounded-full bg-white/20 px-4 py-2">

            <Sparkles className="mr-2" size={18} />

            AI Powered Recommendation

          </div>

          <h1 className="text-5xl font-black leading-tight">

            Personal Career
            <br />
            Recommendation

          </h1>

          <p className="mt-6 text-lg text-cyan-100">

            AI akan menganalisis seluruh hasil assessment,
            kemudian menghasilkan rekomendasi pengembangan
            kompetensi, roadmap karier, learning path,
            serta rencana pengembangan diri yang bersifat
            personal.

          </p>

          <button
            onClick={onGenerate}
            disabled={loading}
            className="mt-10 inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-bold text-cyan-700 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={20} />

            {loading
              ? "Generating Recommendation..."
              : "Generate AI Recommendation"}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

        </div>

      </div>

      {/* Benefit */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">

          <Brain
            className="mb-4 text-cyan-600"
            size={42}
          />

          <h3 className="text-xl font-bold">

            AI Analysis

          </h3>

          <p className="mt-2 text-slate-600">

            Menganalisis seluruh hasil assessment
            menggunakan Artificial Intelligence.

          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <Target
            className="mb-4 text-cyan-600"
            size={42}
          />

          <h3 className="text-xl font-bold">

            Career Roadmap

          </h3>

          <p className="mt-2 text-slate-600">

            Roadmap pengembangan kompetensi
            selama beberapa tahun ke depan.

          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <BookOpen
            className="mb-4 text-cyan-600"
            size={42}
          />

          <h3 className="text-xl font-bold">

            Learning Path

          </h3>

          <p className="mt-2 text-slate-600">

            Prioritas pembelajaran yang harus
            dilakukan berdasarkan hasil assessment.

          </p>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <GraduationCap
            className="mb-4 text-cyan-600"
            size={42}
          />

          <h3 className="text-xl font-bold">

            Learning Place

          </h3>

          <p className="mt-2 text-slate-600">

            AI merekomendasikan tempat belajar,
            pelatihan, sertifikasi dan kursus.

          </p>

        </div>

      </div>

      {/* Output */}

      <div className="rounded-3xl bg-white p-10 shadow">

        <h2 className="mb-8 text-3xl font-bold">

          Hasil yang Akan Anda Dapatkan

        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          {[
            "Top 5 Development Priorities",
            "Development Recommendation",
            "Individual Career Roadmap",
            "Individual Development Plan (IDP)",
            "Recommended Learning Path",
            "Recommended Learning Place",
            "Personal Commitment",
          ].map((item, index) => (

            <div
              key={index}
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-5"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-700">

                {index + 1}

              </div>

              <span className="font-medium">

                {item}

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}