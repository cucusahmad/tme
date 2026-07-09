"use client";

import { useState } from "react";

// Struktur data TypeScript berdasarkan respons API Anda
interface RecommendationData {
  top_5_development_priorities: Array<{ title: string; reason: string; description: string }>;
  development_recommendation: { summary: string; recommendations: string[] };
  individual_career_roadmap: Array<{ year: number; focus: string; target: string }>;
  individual_development_plan: Array<{ activity: string; timeline: string; indicator: string }>;
  recommended_learning_path: Array<{ title: string; description: string }>;
  recommended_learning_place: Array<{ name: string; type: string; reason: string }>;
  personal_commitment: { title: string; statement: string };
}

interface RecommendationContentProps {
  recommendation: RecommendationData;
}

export default function RecommendationContent({ recommendation }: RecommendationContentProps) {
  const [tab, setTab] = useState("priority");

  const menus = [
    { key: "priority", label: "Top Priorities" },
    { key: "development", label: "Development" },
    { key: "roadmap", label: "Career Roadmap" },
    { key: "idp", label: "IDP" },
    { key: "learning", label: "Learning Path" },
    { key: "place", label: "Learning Place" },
    { key: "commitment", label: "Commitment" },
  ];

  // Penanganan jika data recommendation belum siap/kosong
  if (!recommendation) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-3xl shadow">
        Data rekomendasi tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-800">AI Recommendation</h1>
        <p className="mt-2 text-slate-500">Personal Development Recommendation</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-3 overflow-auto pb-2 scrollbar-hide">
        {menus.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`rounded-full px-5 py-3 transition text-sm font-medium whitespace-nowrap shadow-sm ${
              tab === item.key
                ? "bg-cyan-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="rounded-3xl bg-white p-8 shadow min-h-[200px]">
        
        {/* 1. TOP PRIORITIES */}
        {tab === "priority" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Top 5 Development Priorities</h2>
            {recommendation.top_5_development_priorities?.map((item, index) => (
              <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600 font-medium">💡 Deskripsi: <span className="font-normal text-slate-500">{item.description}</span></p>
                <p className="mt-1 text-sm text-slate-600 font-medium">🎯 Alasan: <span className="font-normal text-slate-500">{item.reason}</span></p>
              </div>
            ))}
          </div>
        )}

        {/* 2. DEVELOPMENT */}
        {tab === "development" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Development Recommendation</h2>
            <p className="p-4 bg-cyan-50 text-cyan-900 rounded-2xl text-sm leading-relaxed">
              {recommendation.development_recommendation?.summary}
            </p>
            <div className="mt-4">
              <h3 className="text-md font-semibold text-slate-700 mb-2">Rekomendasi Aksi:</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                {recommendation.development_recommendation?.recommendations?.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 3. ROADMAP */}
        {tab === "roadmap" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Individual Career Roadmap</h2>
            {recommendation.individual_career_roadmap?.map((item, index) => (
              <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                <div className="text-center bg-cyan-600 text-white px-4 py-2 rounded-xl h-fit">
                  <span className="block text-xs uppercase tracking-wider">Tahun</span>
                  <span className="text-xl font-bold">{item.year}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{item.focus}</h3>
                  <p className="mt-1 text-sm text-slate-500">🎯 Target: {item.target}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. IDP */}
        {tab === "idp" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Individual Development Plan (IDP)</h2>
            {recommendation.individual_development_plan?.map((item, index) => (
              <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">{item.activity}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div>⏳ <span className="font-medium">Timeline:</span> {item.timeline}</div>
                  <div>📈 <span className="font-medium">Indikator:</span> {item.indicator}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. LEARNING PATH */}
        {tab === "learning" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recommended Learning Path</h2>
            {recommendation.recommended_learning_path?.map((item, index) => (
              <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">📚 {item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* 6. LEARNING PLACE */}
        {tab === "place" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Recommended Learning Place</h2>
            {recommendation.recommended_learning_place?.map((item, index) => (
              <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-slate-800">🏢 {item.name}</h3>
                  <span className="text-xs bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">💡 <span className="font-medium">Alasan:</span> {item.reason}</p>
              </div>
            ))}
          </div>
        )}

        {/* 7. COMMITMENT */}
        {tab === "commitment" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Personal Commitment</h2>
            <div className="p-6 bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-2xl border border-cyan-100/50">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                🤝 {recommendation.personal_commitment?.title}
              </h3>
              <p className="text-slate-600 text-sm italic leading-relaxed">
                "{recommendation.personal_commitment?.statement}"
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}