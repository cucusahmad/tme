"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Radar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  dimensions: any[];
}

export default function DimensionChart({ dimensions = [] }: Props) {
  
  // 1. PENGAMAN UTAMA: Jika array kosong atau belum terdefinisi, tampilkan placeholder loading.
  // Ini mencegah Chart.js me-render canvas kosong yang bisa mengakibatkan bug layout.
  if (!dimensions || dimensions.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-lg text-center text-slate-500 min-h-[400px] flex flex-col justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-48 bg-slate-200 rounded mb-3"></div>
          <p className="text-sm text-slate-400">Memproses grafik analisis dimensi...</p>
        </div>
      </div>
    );
  }

  // 2. MAPPING DENGAN OPTIONAL CHAINING (?.)
  // Mengantisipasi jika item atau objek dimension di dalamnya sempat null/undefined
  const labels = dimensions.map(
    (item) => item?.dimension?.dimension_name || "Dimensi"
  );

  // 3. FORCE CONVERSION KE PRIMITIVE NUMBER
  // Jika percentage berupa tipe data string dari JSON ("85.00") atau bentuk Decimal, 
  // dikonversi paksa menjadi angka biasa. Jika tidak valid, fallback ke 0 agar Chart tidak blank.
  const dataValues = dimensions.map((item) => {
    const val = Number(item?.percentage);
    return isNaN(val) ? 0 : val;
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Pemetaan Talenta",
        data: dataValues,
        backgroundColor: "rgba(6,182,212,0.20)",
        borderColor: "#06b6d4",
        borderWidth: 3,
        pointBackgroundColor: "#0891b2",
        pointBorderColor: "#ffffff",
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Analisis Dimensi Talent
        </h2>
        <p className="mt-2 text-slate-500">
          Visualisasi kekuatan dan area yang masih dapat dikembangkan berdasarkan hasil assessment.
        </p>
      </div>

      <div className="mx-auto h-[500px] max-w-3xl">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}
