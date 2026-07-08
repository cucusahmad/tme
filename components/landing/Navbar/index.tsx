
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, Target } from "lucide-react";

const menus = [
  { title: "Beranda", href: "#home" },
  { title: "Tentang", href: "#about" },
  { title: "Cara Kerja", href: "#how-it-works" },
  { title: "Profesi", href: "#profession" },
  { title: "Roadmap", href: "#roadmap" },
  { title: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center"
      >
        <div
          className={`mt-6 w-[95%] max-w-7xl transition-all duration-500 ${
            scroll
              ? "rounded-2xl border border-white/50 bg-white/75 backdrop-blur-xl shadow-xl"
              : "rounded-2xl bg-transparent"
          }`}
        >
          <div className="flex h-20 items-center justify-between px-8">
            <Link href="/" className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg">
                <Target size={22} />
              </div>

              <div>
                <h1
                  className={`text-xl font-black transition-colors ${
                    scroll ? "text-slate-900" : "text-white"
                  }`}
                >
                  Talent Match
                </h1>

                <p
                  className={`text-xs transition-colors ${
                    scroll ? "text-slate-500" : "text-cyan-100"
                  }`}
                >
                  Precision Career Matching Platform
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-10 lg:flex">
              {menus.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group relative font-medium transition ${
                    scroll
                      ? "text-slate-700 hover:text-cyan-600"
                      : "text-white hover:text-cyan-300"
                  }`}
                >
                  {item.title}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-7 py-3 font-semibold text-white shadow-lg"
                >
                  Mulai Assessment
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden transition ${
                scroll ? "text-slate-900" : "text-white"
              }`}
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="fixed left-1/2 top-24 z-40 w-[92%] -translate-x-1/2 rounded-3xl border border-cyan-100 bg-white/90 p-6 shadow-xl backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-5">
              {menus.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-medium text-slate-700 transition hover:text-cyan-600"
                >
                  {item.title}
                </Link>
              ))}

              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 py-3 text-center font-semibold text-white"
              >
                Mulai Assessment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
