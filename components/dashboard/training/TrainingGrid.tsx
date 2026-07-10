"use client";

import TrainingCard from "./TrainingCard";

interface Training {
  id: number;
  title: string;
  provider: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  image: string;
  description: string;
  featured: boolean;
}

interface Props {
  trainings: Training[];
}

export default function TrainingGrid({
  trainings,
}: Props) {
  return (
    <section className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">

            Semua Training

          </h2>

          <p className="mt-2 text-slate-500">

            {trainings.length} pelatihan tersedia

          </p>

        </div>

      </div>

      {trainings.length === 0 ? (

        <div className="rounded-3xl bg-white py-20 text-center shadow">

          <h3 className="text-2xl font-bold text-slate-700">

            Training tidak ditemukan

          </h3>

          <p className="mt-3 text-slate-500">

            Coba gunakan kata kunci lain.

          </p>

        </div>

      ) : (

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {trainings.map((training) => (

            <TrainingCard
              key={training.id}
              training={training}
            />

          ))}

        </div>

      )}

    </section>
  );
}