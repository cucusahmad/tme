"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  Bot,
  Trophy,
  GraduationCap,
  Cpu,
} from "lucide-react";


interface Props {
  item: any;
}

export default function CompetitionCard({
  item,
}: Props) {
 

  const icons = {
  bot: Bot,
  trophy: Trophy,
  graduation: GraduationCap,
  cpu: Cpu,
};

const Icon = icons[item.icon as keyof typeof icons];

  

  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
      className="
      group

      rounded-3xl

      border

      border-cyan-500/20

      bg-white/5

      p-8

      backdrop-blur-xl

      transition

      hover:border-cyan-400

      hover:shadow-[0_0_35px_rgba(0,168,255,.15)]
      "
    >
      <div
        className={`
        mb-8

        flex

        h-20

        w-20

        items-center

        justify-center

        rounded-3xl

        bg-gradient-to-br

        ${item.color}
        `}
      >
      <Icon size={42} className="text-white" />
      </div>

      <span className="text-sm text-cyan-300">
        {item.level}
      </span>

      <h2 className="mt-3 text-2xl font-bold text-white">
        {item.title}
      </h2>

      <p className="mt-4 leading-8 text-slate-400">
        {item.description}
      </p>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Registration Fee
          </p>

          <h4 className="mt-1 text-xl font-bold text-cyan-300">
            {item.fee}
          </h4>
        </div>

        <Link
          href="/auth/register"
          className="
          flex

          h-12

          w-12

          items-center

          justify-center

          rounded-full

          bg-gradient-to-r

          from-cyan-500

          to-purple-600

          text-white

          transition

          group-hover:rotate-45
          "
        >
          <ArrowRight size={20} />
        </Link>
      </div>
    </motion.div>
  );
}