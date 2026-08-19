"use client";

import Image from "next/image";

import {
  Star,
  Clock3,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

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

export default function FeaturedTraining({
  trainings,
}: Props) {
  return (
    <section>

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">

            Featured Training

          </h2>

          <p className="mt-2 text-slate-500">

            Pelatihan pilihan yang direkomendasikan untuk meningkatkan kompetensi Anda.

          </p>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {trainings.map((training) => (

          <div
            key={training.id}
            className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >

            {/* Image */}

            <div className="relative h-56 overflow-hidden">

              <Image
                src={training.image}
                alt={training.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />

              <span className="absolute left-5 top-5 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">

                {training.category}

              </span>

            </div>

            {/* Content */}

            <div className="space-y-5 p-6">

              <div>

                <h3 className="text-2xl font-bold text-slate-900">

                  {training.title}

                </h3>

                <p className="mt-2 text-slate-600">

                  {training.description}

                </p>

              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">

                <div className="flex items-center gap-2">

                  <GraduationCap size={18} />

                  {training.provider}

                </div>

                <div className="flex items-center gap-2">

                  <Clock3 size={18} />

                  {training.duration}

                </div>

                <div className="flex items-center gap-2">

                  <Star
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  {training.rating}

                </div>

              </div>

              <div className="flex items-center justify-between">

                <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">

                  {training.level}

                </span>

                <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700">

                  Lihat Detail

                  <ArrowRight size={18} />

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
