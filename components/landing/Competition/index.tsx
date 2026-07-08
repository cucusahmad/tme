import CompetitionCard from "./CompetitionCard";
import { competitions } from "./data";

export default function Competition() {
  return (
    <section
      id="competition"
      className="relative pt-10 pb-10"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">

          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">
            COMPETITION CATEGORIES
          </span>

          <h2 className="mt-8 text-5xl font-black text-white">
            Choose Your
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {" "}
              Challenge
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-400">
            Participate in one of four exciting robotics competitions
            designed for students from school to university level.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {competitions.map((item) => (
            <CompetitionCard
              key={item.id}
              item={item}
            />
          ))}

        </div>

      </div>
    </section>
  );
}