"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type Recommendation = {
  unitName: string;
  percentage: number;
};

export type RecommendationMapRow = {
  assessmentId: string;
  userId: string;
  name: string;
  phone: string | null;
  recommendations: Recommendation[];
};

export default function RecommendationMapTable({ rows }: { rows: RecommendationMapRow[] }) {
  const [query, setQuery] = useState("");
  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("id-ID");
    if (!keyword) return rows;
    return rows.filter((row) => row.name.toLocaleLowerCase("id-ID").includes(keyword));
  }, [query, rows]);

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs font-medium text-slate-500">
          Menampilkan <span className="font-bold text-slate-800">{filteredRows.length}</span> dari {rows.length} pengguna
        </p>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Cari nama pengguna</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama pengguna..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <X size={16} />
            </button>
          )}
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              {['Nama Pengguna', 'Nomor Handphone', 'Rekomendasi 1', 'Rekomendasi 2', 'Rekomendasi 3', 'Aksi'].map((heading) => (
                <th key={heading} className="px-5 py-3.5 font-bold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row) => (
              <tr key={row.assessmentId} className="align-top transition hover:bg-slate-50/70">
                <td className="px-5 py-4 font-bold text-slate-900">{row.name}</td>
                <td className="px-5 py-4 font-medium text-slate-600">{row.phone || "-"}</td>
                {[0, 1, 2].map((index) => {
                  const recommendation = row.recommendations[index];
                  return (
                    <td key={index} className="px-5 py-4">
                      {recommendation ? (
                        <div className="min-w-[190px]">
                          <p className="font-semibold leading-5 text-slate-800">{recommendation.unitName}</p>
                          <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                            {recommendation.percentage.toFixed(1)}%
                          </span>
                        </div>
                      ) : <span className="text-slate-400">-</span>}
                    </td>
                  );
                })}
                <td className="px-5 py-4">
                  <Link href={`/dashboard/admin/users/${row.userId}/assessment`} className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900">
                    Detail <ArrowRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
            {!filteredRows.length && (
              <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-500">
                {query ? `Nama “${query}” tidak ditemukan.` : "Belum ada pengguna yang memiliki score assessment."}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
