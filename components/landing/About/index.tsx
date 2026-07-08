"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Route,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Assessment Berbasis Kompetensi",
    description:
      "Mengukur potensi, kompetensi, minat, karakter, dan kesiapan karier secara komprehensif.",
  },
  {
    icon: Target,
    title: "Talent Match Score",
    description:
      "Menampilkan persentase kecocokan terhadap berbagai profesi berdasarkan hasil assessment.",
  },
  {
    icon: Route,
    title: "Roadmap Karier",
    description:
      "Memberikan langkah pengembangan yang terarah untuk mencapai profesi impian.",
  },
  {
    icon: TrendingUp,
    title: "Analisis Potensi",
    description:
      "Mengetahui kekuatan utama dan area yang perlu ditingkatkan untuk pengembangan karier.",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-28"
    >
      {/* Background Glow */}

      <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-[140px]" />

      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-300/20 blur-[140px]" />

      <div className="container mx-auto px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            viewport={{ once: true }}
          >

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-white/80 px-5 py-2 backdrop-blur-xl shadow-md">

              <Sparkles
                size={16}
                className="text-cyan-600"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
                ABOUT TALENT MATCH
              </span>

            </div>

            <h2 className="mt-8 text-4xl font-black leading-tight md:text-5xl">

              <span className="text-slate-900">
                Temukan Karier
              </span>

              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                {" "}Masa Depan{" "}
              </span>

              <span className="text-slate-900">
                yang Paling Tepat
              </span>

            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-700">
              Talent Match adalah platform assessment karier yang membantu
              Anda mengenali potensi, kompetensi, minat, karakter, serta
              kesiapan menghadapi dunia kerja. Melalui analisis berbasis data,
              Talent Match memberikan persentase kecocokan profesi sekaligus
              roadmap pengembangan diri agar Anda memiliki arah karier yang
              jelas.
            </p>

            <div className="mt-10 space-y-4">

              {[
                "Assessment berbasis kompetensi dan karakter.",
                "Persentase kecocokan terhadap berbagai profesi.",
                "Roadmap pengembangan karier yang terarah.",
                "Analisis kekuatan dan area yang perlu ditingkatkan.",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-3"
                >

                  <CheckCircle2
                    size={20}
                    className="text-cyan-600"
                  />

                  <p className="text-slate-700">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >

            {features.map((item) => (

              <div
                key={item.title}
                className="
                rounded-3xl
                border
                border-white/60
                bg-white/75
                p-8
                shadow-xl
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-300
                hover:bg-white
                "
              >

                <div
                  className="
                  mb-6
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-cyan-500
                  to-blue-600
                  "
                >

                  <item.icon
                    className="text-white"
                    size={26}
                  />

                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {item.description}
                </p>

              </div>

            ))}

          </motion.div>

        </div>

        {/* Statistics */}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="
          mt-24
          grid
          gap-6
          rounded-3xl
          border
          border-white/60
          bg-white/75
          p-10
          shadow-xl
          backdrop-blur-xl
          md:grid-cols-4
          "
        >

          {[
            {
              value: "100+",
              label: "Pilihan Profesi",
            },
            {
              value: "10+",
              label: "Dimensi Assessment",
            },
            {
              value: "1000+",
              label: "Pertanyaan Assessment",
            },
            {
              value: "AI",
              label: "Career Recommendation",
            },
          ].map((item) => (

            <div
              key={item.label}
              className="text-center"
            >

              <h3 className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-5xl font-black text-transparent">
                {item.value}
              </h3>

              <p className="mt-3 text-slate-700">
                {item.label}
              </p>

            </div>

          ))}

        </motion.div>

      </div>
    </section>
  );
}