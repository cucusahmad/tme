"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Landmark,
  Stethoscope,
  Scale,
  GraduationCap,
  Laptop,
  Briefcase,
  Building2,
  Plane,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const professions = [
  {
    icon: Shield,
    title: "Polisi",
    description: "Analisis kecocokan untuk profesi Kepolisian berdasarkan karakter, integritas, kepemimpinan, dan pelayanan publik.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Landmark,
    title: "ASN",
    description: "Menilai kesiapan menjadi Aparatur Sipil Negara melalui kompetensi, etika, dan orientasi pelayanan.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Dokter",
    description: "Mengukur kecocokan profesi tenaga kesehatan berdasarkan empati, ketelitian, dan kemampuan profesional.",
    color: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Scale,
    title: "Hakim",
    description: "Mengevaluasi integritas, objektivitas, kepemimpinan, dan kemampuan mengambil keputusan.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: GraduationCap,
    title: "Guru",
    description: "Mengidentifikasi potensi sebagai pendidik melalui komunikasi, kepemimpinan, dan kemampuan mengajar.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Laptop,
    title: "Software Engineer",
    description: "Menilai kemampuan analitis, logika, pemecahan masalah, dan kesiapan teknologi digital.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Briefcase,
    title: "Entrepreneur",
    description: "Mengukur jiwa kepemimpinan, inovasi, kreativitas, dan kemampuan mengelola risiko bisnis.",
    color: "from-pink-500 to-orange-500",
  },
  {
    icon: Building2,
    title: "Manajer",
    description: "Menilai kemampuan memimpin tim, komunikasi, perencanaan, dan pengambilan keputusan.",
    color: "from-sky-500 to-indigo-600",
  },
  {
    icon: Plane,
    title: "Pilot",
    description: "Mengukur ketelitian, disiplin, fokus, dan kemampuan mengambil keputusan dalam situasi kritis.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: HeartHandshake,
    title: "Pekerja Sosial",
    description: "Menganalisis empati, komunikasi interpersonal, dan orientasi pelayanan kepada masyarakat.",
    color: "from-teal-500 to-cyan-500",
  },
];

export default function ProfessionSection() {
  return (
    <section
      id="profession"
      className="relative py-28 overflow-hidden"
    >
      <div className="absolute left-0 top-32 h-80 w-80 rounded-full bg-cyan-300/20 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-300/20 blur-[140px]" />

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
            PROFESI
          </span>

          <h2 className="mt-8 text-4xl font-black text-slate-900 md:text-5xl">
            Temukan
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              {" "}Profesi{" "}
            </span>
            yang Tepat
          </h2>

          <p className="mt-8 text-lg leading-9 text-slate-600">
            Talent Match membantu Anda mengetahui tingkat kecocokan terhadap
            berbagai profesi berdasarkan kompetensi, karakter, potensi, dan
            kesiapan masa depan.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">

          {professions.map((item, index) => {

            const Icon = item.icon;

            return (

              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: .5,
                  delay: index * .05,
                }}
                viewport={{ once: true }}
                className="
                group
                rounded-3xl
                border
                border-white/60
                bg-white/75
                p-7
                shadow-xl
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-3
                hover:border-cyan-300
                hover:bg-white
                "
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
                >
                  <Icon
                    className="text-white"
                    size={26}
                  />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <button
                  className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  font-semibold
                  text-cyan-600
                  transition
                  group-hover:gap-3
                  "
                >
                  Lihat Detail

                  <ArrowRight size={16} />
                </button>

              </motion.div>

            );

          })}

        </div>

      </div>
    </section>
  );
}