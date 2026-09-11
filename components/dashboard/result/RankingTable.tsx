import {
  Medal,
  Trophy,
  Award,
} from "lucide-react";

interface Props {
  ranking: any[];
}

export default function RankingTable({
  ranking,
}: Props) {
  function getBadge(rank: number) {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-2 text-yellow-500">
            <Trophy size={20} />
            <span className="font-bold">
              #1
            </span>
          </div>
        );

      case 2:
        return (
          <div className="flex items-center gap-2 text-slate-500">
            <Medal size={20} />
            <span className="font-bold">
              #2
            </span>
          </div>
        );

      case 3:
        return (
          <div className="flex items-center gap-2 text-orange-500">
            <Award size={20} />
            <span className="font-bold">
              #3
            </span>
          </div>
        );

      default:
        return (
          <span className="font-bold text-slate-500">
            #{rank}
          </span>
        );
    }
  }

  return (
    <div className="rounded-3xl bg-white shadow-lg">

      <div className="border-b border-slate-200 p-6">

        <h2 className="text-2xl font-bold text-slate-900">
          Peringkat Kecocokan Profesi
        </h2>

        <p className="mt-1 text-slate-500">
          Peringkat peran dalam bidang pilihan Anda berdasarkan hasil asesmen.
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Ranking
              </th>

              <th className="px-6 py-4 text-left">
                Unit Profesi
              </th>

              <th className="px-6 py-4 text-center">
                Persentase
              </th>

              <th className="px-6 py-4 text-center">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {ranking.map(
              (item, index) => (

                <tr
                  key={
                    item.assessment_result_id ??
                    index
                  }
                  className="border-b border-slate-100 hover:bg-cyan-50"
                >

                  <td className="px-6 py-5">

                    {getBadge(
                      item.rank_order
                    )}

                  </td>

                  <td className="px-6 py-5">

                    <div>

                      <h3 className="font-semibold text-slate-900">

                        {
                          item.profession_unit
                            ?.unit_name
                        }

                      </h3>

                    </div>

                  </td>

                  <td className="px-6 py-5 text-center">

                    <span className="rounded-full bg-cyan-100 px-4 py-2 font-bold text-cyan-700">

                      {Number(
                        item.percentage
                      ).toFixed(2)}
                      %

                    </span>

                  </td>

                  <td className="px-6 py-5 text-center">

                    {item.is_recommended ? (

                      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">

                        Direkomendasikan

                      </span>

                    ) : (

                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">

                        Alternatif

                      </span>

                    )}

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
