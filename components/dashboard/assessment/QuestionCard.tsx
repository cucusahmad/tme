interface Props {
  question: {
    question_id: bigint | string;
    question: string;
    question_order?: number;
    dimension?: {
      dimension_name: string;
    };
  };
}

export default function QuestionCard({
  question,
}: Props) {
  return (
    <div className="mb-10 rounded-3xl border border-slate-200 bg-slate-50 p-8">

      {/* Dimension */}

      <div className="mb-5">

        <span className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">

          {question.dimension?.dimension_name ??
            "Assessment"}

        </span>

      </div>

      {/* Nomor */}

      <p className="mb-2 text-sm font-medium text-slate-500">

        Pertanyaan

        {question.question_order &&
          ` #${question.question_order}`}

      </p>

      {/* Soal */}

      <h2 className="text-3xl font-bold leading-relaxed text-slate-900">

        {question.question}

      </h2>

      {/* Petunjuk */}

      <p className="mt-8 text-slate-500">

        Pilih jawaban yang paling menggambarkan diri Anda.

        Tidak ada jawaban benar ataupun salah.

      </p>

    </div>
  );
}
