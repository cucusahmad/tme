"use client";

import { timeline } from "./data";
import TimelineItem from "./TimelineItem";

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="relative py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <div className="text-center">

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">
            EVENT TIMELINE
          </span>

          <h2 className="mt-8 text-5xl font-black text-white">
            Journey to{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              IRDO 2026
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            Follow every important milestone before the competition begins.
          </p>

        </div>

        {/* Timeline */}

        <div className="relative mt-24">

          {/* Line */}

          <div
            className="
            absolute

            left-0

            right-0

            top-3

            h-[3px]

            bg-gradient-to-r

            from-cyan-500

            via-blue-500

            to-purple-600
          "
          />

          <div
            className="
            flex

            gap-10

            overflow-x-auto

            pb-6

            scrollbar-hide
          "
          >

            {timeline.map((item) => (

              <TimelineItem
                key={item.id}
                item={item}
              />

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}