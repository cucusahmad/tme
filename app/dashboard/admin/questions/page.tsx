import { ListChecks } from "lucide-react";

import QuestionManager from "@/components/admin/QuestionManager";
import { requireAdmin } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default async function AdminQuestionsPage() {
  await requireAdmin();
  const [questions, dimensions] = await Promise.all([
    prisma.question.findMany({
      orderBy: [{ dimension: { profession: { profession_name: "asc" } } }, { dimension: { order_no: "asc" } }, { question_order: "asc" }, { question_id: "asc" }],
      select: {
        question_id: true, question: true, question_order: true, dimension_id: true,
        dimension: { select: { dimension_name: true, profession: { select: { profession_name: true } } } },
        question_option: { orderBy: [{ option_order: "asc" }, { option_id: "asc" }], select: { option_id: true, option_text: true, option_order: true, weight: true, _count: { select: { answer: true } } } },
        _count: { select: { answer: true } },
      },
    }),
    prisma.dimension.findMany({ orderBy: [{ profession: { profession_name: "asc" } }, { order_no: "asc" }, { dimension_name: "asc" }], select: { dimension_id: true, dimension_name: true, profession: { select: { profession_name: true } } } }),
  ]);

  return <div className="space-y-6">
    <div className="flex items-center gap-4"><div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-4 text-white shadow-lg shadow-cyan-100"><ListChecks size={26}/></div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Data Master</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Manajemen Pertanyaan</h1><p className="mt-1 text-sm text-slate-500">Kelola pertanyaan, opsi jawaban, dan weight 0–2.</p></div></div>
    <QuestionManager
      dimensions={dimensions.map(item => ({ id: item.dimension_id.toString(), name: item.dimension_name, professionName: item.profession.profession_name }))}
      questions={questions.map(item => ({ id: item.question_id.toString(), text: item.question, orderNo: item.question_order, dimensionId: item.dimension_id.toString(), dimensionName: item.dimension.dimension_name, professionName: item.dimension.profession.profession_name, answerCount: item._count.answer, options: item.question_option.map(option => ({ id: option.option_id, text: option.option_text, orderNo: option.option_order, weight: Number(option.weight), answerCount: option._count.answer })) }))}
    />
  </div>;
}
