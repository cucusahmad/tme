"use client";

interface Props {
  categories: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: Props) {
  return (
    <div>

      <h2 className="mb-5 text-2xl font-bold text-slate-900">

        Categories

      </h2>

      <div className="flex flex-wrap gap-3">

        {categories.map((category) => (

          <button
            key={category}
            onClick={() =>
              onSelect(category)
            }
            className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              selected === category
                ? "bg-cyan-600 text-white shadow-lg"
                : "bg-white text-slate-700 shadow hover:bg-cyan-50"
            }`}
          >

            {category}

          </button>

        ))}

      </div>

    </div>
  );
}