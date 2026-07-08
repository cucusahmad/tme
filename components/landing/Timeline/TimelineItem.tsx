"use client";

import { motion } from "framer-motion";

interface Props {
  item: {
    date: string;
    fullDate: string;
    title: string;
    description: string;
  };
}

export default function TimelineItem({ item }: Props) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      className="group relative flex min-w-[260px] flex-col items-center"
    >
      {/* Circle */}

      <div
        className="
        z-20

        flex

        h-7

        w-7

        items-center

        justify-center

        rounded-full

        border-4

        border-cyan-400

        bg-slate-950

        transition

        duration-300

        group-hover:scale-125

        group-hover:shadow-[0_0_25px_rgba(0,168,255,.6)]
      "
      />

      {/* Card */}

      <div
        className="
        mt-8

        rounded-3xl

        border

        border-cyan-500/20

        bg-white/5

        p-6

        backdrop-blur-xl

        transition

        duration-300

        group-hover:border-cyan-400

        group-hover:bg-white/10
      "
      >
        <p className="text-sm font-semibold text-cyan-300">
          {item.date}
        </p>

        <h3 className="mt-3 text-xl font-bold text-white">
          {item.title}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          {item.fullDate}
        </p>

        <p className="mt-5 leading-7 text-slate-400">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}