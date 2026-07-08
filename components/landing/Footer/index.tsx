"use client";

import Link from "next/link";
import {
  Brain,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative mt-32 overflow-hidden border-t border-white/20 bg-white/80 backdrop-blur-xl"
    >
      {/* Glow */}

      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-[150px]" />

      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-300/20 blur-[150px]" />

      <div className="container mx-auto px-6 py-20">

        <div className="grid gap-14 lg:grid-cols-4">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">

                <Brain
                  size={28}
                  className="text-white"
                />

              </div>

              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  Talent Match
                </h2>

                <p className="text-sm text-slate-500">
                  Precision Career Matching Platform
                </p>

              </div>

            </div>

            <p className="mt-6 leading-8 text-slate-600">
              Talent Match membantu setiap individu menemukan profesi yang
              paling sesuai berdasarkan potensi, kompetensi, karakter,
              minat, serta memberikan roadmap pengembangan menuju
              karier impian.
            </p>

          </div>

          {/* Navigation */}

          <div>

            <h3 className="mb-6 text-lg font-bold text-slate-900">
              Navigasi
            </h3>

            <div className="flex flex-col gap-4">

              <Link
                href="#home"
                className="text-slate-600 transition hover:text-cyan-600"
              >
                Beranda
              </Link>

              <Link
                href="#about"
                className="text-slate-600 transition hover:text-cyan-600"
              >
                Tentang
              </Link>

              <Link
                href="#how-it-works"
                className="text-slate-600 transition hover:text-cyan-600"
              >
                Cara Kerja
              </Link>

              <Link
                href="#profession"
                className="text-slate-600 transition hover:text-cyan-600"
              >
                Profesi
              </Link>

              <Link
                href="#faq"
                className="text-slate-600 transition hover:text-cyan-600"
              >
                FAQ
              </Link>

            </div>

          </div>

          {/* Features */}

          <div>

            <h3 className="mb-6 text-lg font-bold text-slate-900">
              Fitur
            </h3>

            <div className="space-y-4 text-slate-600">

              <p>Assessment Karier</p>

              <p>Talent Match Score</p>

              <p>Roadmap Karier</p>

              <p>Analisis Kompetensi</p>

              <p>Rekomendasi Profesi</p>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-lg font-bold text-slate-900">
              Hubungi Kami
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">

                <Mail
                  size={18}
                  className="mt-1 text-cyan-600"
                />

                <span className="text-slate-600">
                  info@talentmatch.id
                </span>

              </div>

              <div className="flex items-start gap-3">

                <Phone
                  size={18}
                  className="mt-1 text-cyan-600"
                />

                <span className="text-slate-600">
                  +62 812-3456-7890
                </span>

              </div>

              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="mt-1 text-cyan-600"
                />

                <span className="text-slate-600">
                  Bandar Lampung, Indonesia
                </span>

              </div>

            </div>

            {/* Social */}

            <div className="mt-8 flex gap-4">

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition hover:scale-110"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition hover:scale-110"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition hover:scale-110"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition hover:scale-110"
              >
                <FaYoutube />
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Talent Match. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm">

            <Link
              href="#"
              className="text-slate-500 transition hover:text-cyan-600"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="text-slate-500 transition hover:text-cyan-600"
            >
              Terms of Service
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}