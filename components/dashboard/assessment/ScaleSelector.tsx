"use client";

interface Props {
  onSelect: (value: number) => void;
}

const scales = [
  {
    value: 1,
    title: "Sangat\nTidak Setuju",
    color: "bg-red-500",
  },
  {
    value: 2,
    title: "Tidak\nSetuju",
    color: "bg-orange-500",
  },
  {
    value: 3,
    title: "Netral",
    color: "bg-yellow-500",
  },
  {
    value: 4,
    title: "Setuju",
    color: "bg-cyan-500",
  },
  {
    value: 5,
    title: "Sangat\nSetuju",
    color: "bg-green-500",
  },
];

export default function ScaleSelector({
  onSelect,
}: Props) {
  return (
    <div>

      <h3 className="mb-8 text-center text-xl font-bold text-slate-900">
        Pilih Jawaban Anda
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">

        {scales.map((item) => (

          <button
            key={item.value}
            type="button"
            onClick={() =>
              onSelect(item.value)
            }
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl"
          >

            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white ${item.color}`}
            >
              {item.value}
            </div>

            <p className="whitespace-pre-line text-center text-sm font-semibold text-slate-700">

              {item.title}

            </p>

          </button>

        ))}

      </div>

      <div className="mt-10 rounded-2xl bg-cyan-50 p-5">

        <h4 className="font-bold text-cyan-800">
          Petunjuk
        </h4>

        <ul className="mt-3 space-y-2 text-sm text-slate-600">

          <li>
            <b>1</b> = Sangat Tidak Setuju
          </li>

          <li>
            <b>2</b> = Tidak Setuju
          </li>

          <li>
            <b>3</b> = Netral
          </li>

          <li>
            <b>4</b> = Setuju
          </li>

          <li>
            <b>5</b> = Sangat Setuju
          </li>

        </ul>

      </div>

    </div>
  );
}