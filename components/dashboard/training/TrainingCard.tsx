"use client";

import {
  Star,
  Clock3,
  GraduationCap,
  ArrowRight,
  BookOpen,
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
  training: Training;
}

export default function TrainingCard({
  training,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image */}

      <div className="relative">

        <img
          src={training.image}
          alt={training.title}
          className="h-52 w-full object-cover"
        />

        <div className="absolute left-4 top-4 rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold text-white">

          {training.category}

        </div>

      </div>

      {/* Content */}

      <div className="space-y-5 p-6">

        <div>

          <h3 className="line-clamp-2 text-xl font-bold text-slate-900">

            {training.title}

          </h3>

          <p className="mt-2 line-clamp-3 text-sm text-slate-600">

            {training.description}

          </p>

        </div>

        <div className="space-y-2 text-sm text-slate-600">

          <div className="flex items-center gap-2">

            <GraduationCap size={16} />

            {training.provider}

          </div>

          <div className="flex items-center gap-2">

            <Clock3 size={16} />

            {training.duration}

          </div>

          <div className="flex items-center gap-2">

            <BookOpen size={16} />

            {training.level}

          </div>

          <div className="flex items-center gap-2">

            <Star
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />

            {training.rating}

          </div>

        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700">

          Lihat Detail

          <ArrowRight size={18} />

        </button>

      </div>

    </div>
  );
}