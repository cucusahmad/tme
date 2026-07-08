import { Award } from "lucide-react";

interface Props {
  recommendation: any;
}

export default function RecommendationCard({
  recommendation,
}: Props) {

  return (

    <div className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-10 text-white shadow-xl">

      <div className="mb-6 flex items-center gap-4">

        <Award size={48} />

        <div>

          <h2 className="text-3xl font-bold">
            Rekomendasi Terbaik
          </h2>

          <p className="opacity-90">
            Berdasarkan hasil assessment Anda
          </p>

        </div>

      </div>

      <h1 className="text-5xl font-black">

        {recommendation?.profession_unit
          ?.unit_name}

      </h1>

      <div className="mt-8 inline-flex rounded-full bg-white/20 px-6 py-3 text-3xl font-bold">

        {recommendation?.percentage} %

      </div>

    </div>

  );

}