"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroContent() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/70 px-5 py-2 backdrop-blur-xl shadow-md">
        <Sparkles size={16} className="text-cyan-600" />

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
          Future Career Intelligence
        </span>
      </div>

      {/* Title */}
     <h1 className="hero-title mt-8 leading-[0.95]">
  <span className="block text-4xl font-black text-white md:text-5xl xl:text-6xl">
    JELAJAHI
  </span>

  <span className="mt-2 block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-4xl font-black text-transparent md:text-5xl xl:text-6xl">
    KARIR 
  </span>

  <span className="mt-2 block text-4xl font-black text-white md:text-5xl xl:text-6xl">
    MASA DEPAN
  </span>
</h1>

      {/* Motto */}
     <div className="mt-4 flex flex-wrap gap-8 text-lg font-semibold">
  <span className="text-cyan-300">DISCOVER.</span>
  <span className="text-cyan-300">MATCH.</span>
  <span className="text-purple-300">GROW.</span>
</div>

      {/* Description */}
     <p className="mt-4 max-w-xl text-lg leading-9 text-slate-300">
  Talent Match membantu Anda menemukan profesi yang paling sesuai berdasarkan
  potensi, kompetensi, minat, dan karakter. Dapatkan persentase kecocokan
  karier beserta roadmap pengembangan diri untuk mewujudkan profesi impian
  Anda.
</p>

      {/* Buttons */}
      <div className="mt-12 flex flex-wrap gap-5">
        <button
          type="button"
          onClick={() => router.push("/auth/register")}
          className="
            group
            flex
            items-center
            gap-2
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            via-blue-500
            to-indigo-600
            px-8
            py-4
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-cyan-300/60
          "
        >
          Mulai Assessment

          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />
        </button>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("how-it-works")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="
            group
            flex
            items-center
            gap-2
            rounded-full
            border
            border-cyan-200
            bg-white/70
            px-8
            py-4
            font-semibold
            text-slate-700
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-cyan-500
            hover:bg-white
            hover:text-cyan-600
          "
        >
          Cara Kerja

          <Compass
            size={18}
            className="transition group-hover:rotate-45"
          />
        </button>
      </div>

      {/* Statistik */}
      <div className="mt-14 flex flex-wrap gap-10">
        <div>
          <h3 className="text-3xl font-black text-cyan-600">100+</h3>
          <p className="mt-1 text-sm text-slate-500">
            Pilihan Profesi
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black text-blue-600">10+</h3>
          <p className="mt-1 text-sm text-slate-500">
            Dimensi Penilaian
          </p>
        </div>

        <div>
          <h3 className="text-3xl font-black text-indigo-600">AI</h3>
          <p className="mt-1 text-sm text-slate-500">
            Career Recommendation
          </p>
        </div>
      </div>
    </motion.div>
  );
}