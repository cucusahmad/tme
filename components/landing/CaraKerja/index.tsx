"use client";

import { motion } from "framer-motion";
import {
  UserRound,
  ClipboardCheck,
  Brain,
  BarChart3,
  Route,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: UserRound,
    title: "Lengkapi Profil",
    description:
      "Isi biodata dasar seperti pendidikan, pengalaman, dan informasi pendukung sebagai dasar assessment.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: ClipboardCheck,
    title: "Kerjakan Assessment",
    description:
      "Jawab seluruh pertanyaan yang mengukur kompetensi, karakter, minat, dan kesiapan karier Anda.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Brain,
    title: "Analisis Talent Match",
    description:
      "Sistem menganalisis setiap jawaban menggunakan model Talent Match untuk menghitung tingkat kecocokan profesi.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Lihat Hasil",
    description:
      "Dapatkan persentase kecocokan terhadap berbagai profesi lengkap dengan analisis setiap dimensi.",
    color: "from-cyan-500 to-sky-500",
  },
  {
    icon: Route,
    title: "Roadmap Karier",
    description:
      "Pelajari kompetensi apa yang sudah baik dan apa yang masih perlu dikembangkan agar sesuai dengan profesi impian.",
    color: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Rocket,
    title: "Capai Karier Impian",
    description:
      "Gunakan roadmap sebagai panduan belajar dan pengembangan diri untuk mencapai tujuan karier Anda.",
    color: "from-orange-500 to-pink-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-28 overflow-hidden"
    >
      {/* Background Glow */}

      <div className="absolute left-0 top-40 h-80 w-80 rounded-full bg-cyan-300/20 blur-[140px]" />

      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-300/20 blur-[140px]" />

      <div className="container mx-auto px-6">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >

          <span className="rounded-full border border-cyan-300 bg-white/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-700 shadow">
            Cara Kerja
          </span>

          <h2 className="mt-8 text-4xl font-black text-slate-900 md:text-5xl">
            Hanya{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              6 Langkah
            </span>{" "}
            Menuju Karier Impian
          </h2>

          <p className="mt-8 text-lg leading-9 text-slate-600">
            Talent Match membantu Anda menemukan profesi yang paling sesuai
            berdasarkan potensi, kompetensi, karakter, dan minat. Seluruh
            proses berlangsung secara sederhana namun menghasilkan analisis
            yang komprehensif.
          </p>

        </motion.div>

        {/* Timeline */}

        <div className="relative">

          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-300 via-blue-300 to-indigo-300 lg:block" />

          <div className="space-y-12">

            {steps.map((step, index) => {

              const Icon = step.icon;

              return (

                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: .6,
                    delay: index * .1,
                  }}
                  viewport={{ once: true }}
                  className={`
                    flex
                    items-center
                    ${
                      index % 2 === 0
                        ? "lg:flex-row"
                        : "lg:flex-row-reverse"
                    }
                  `}
                >

                  <div className="hidden lg:block lg:w-1/2" />

                  <div
                    className="
                    relative
                    z-10
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-xl
                    lg:absolute
                    lg:left-1/2
                    lg:-translate-x-1/2
                    "
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${step.color}`}
                    >
                      <Icon
                        className="text-white"
                        size={24}
                      />
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-0 lg:w-1/2">

                    <div
                      className="
                      rounded-3xl
                      border
                      border-white/60
                      bg-white/75
                      p-8
                      shadow-xl
                      backdrop-blur-xl
                      transition
                      hover:-translate-y-2
                      "
                    >

                      <span className="text-sm font-bold text-cyan-600">
                        LANGKAH {index + 1}
                      </span>

                      <h3 className="mt-3 text-2xl font-bold text-slate-900">
                        {step.title}
                      </h3>

                      <p className="mt-4 leading-8 text-slate-600">
                        {step.description}
                      </p>

                    </div>

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

      </div>
    </section>
  );
}