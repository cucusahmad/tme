"use client";

import {
  Search,
  GraduationCap,
} from "lucide-react";

interface Props {
  keyword: string;
  onSearch: (value: string) => void;
}

export default function HeroSection({
  keyword,
  onSearch,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 p-10 text-white shadow-xl">

      <div className="max-w-3xl">

        <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium">

          <GraduationCap
            size={18}
            className="mr-2"
          />

          Talent Learning Center

        </div>

        <h1 className="text-4xl font-black leading-tight">

          Training &
          <br />
          Workshop

        </h1>

        <p className="mt-5 text-lg text-cyan-100">

          Tingkatkan kompetensi Anda melalui
          pelatihan, workshop, sertifikasi,
          dan pembelajaran yang sesuai dengan
          hasil Talent Assessment.

        </p>

        <div className="relative mt-8">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={keyword}
            onChange={(e) =>
              onSearch(e.target.value)
            }
            placeholder="Cari training..."
            className="h-14 w-full rounded-2xl bg-white pl-14 pr-6 text-slate-700 outline-none"
          />

        </div>

      </div>

    </div>
  );
}