"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  onSelect: (value: number) => void;
}

const ratings = [1, 2, 3, 4, 5];

export default function ScaleSelector({ onSelect }: Props) {
  const [activeRating, setActiveRating] = useState(0);

  return (
    <div>
      <h3 className="mb-3 text-center text-xl font-bold text-slate-900">
        Berikan Rating
      </h3>
      <p className="mb-7 text-center text-sm text-slate-500">
        Pilih jumlah bintang untuk jawaban Anda
      </p>

      <div
        className="flex items-center justify-center gap-2 sm:gap-4"
        onMouseLeave={() => setActiveRating(0)}
        role="group"
        aria-label="Pilih rating jawaban"
      >
        {ratings.map((rating) => {
          const isActive = rating <= activeRating;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => onSelect(rating)}
              onMouseEnter={() => setActiveRating(rating)}
              onFocus={() => setActiveRating(rating)}
              onBlur={() => setActiveRating(0)}
              className="group rounded-xl p-2 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4"
              aria-label={`${rating} bintang`}
            >
              <Star
                className={`h-11 w-11 transition-colors duration-200 sm:h-14 sm:w-14 ${
                  isActive
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-300 group-hover:text-amber-300"
                }`}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
